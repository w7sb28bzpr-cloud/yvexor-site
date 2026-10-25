// Dependency-free assertions against the exact static export sent to Google.
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const root=path.resolve('out');const origin='https://yvexor.com';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const sitemap=read('sitemap.xml');const routes=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]));
assert.ok(!routes.some(url=>url.pathname==='/projets/'||url.pathname.startsWith('/projets/')), 'With zero approved projects, the project hub and details must be absent from sitemap');
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'");
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],decode(m[2])]));
const tags=(html,name)=>[...html.matchAll(new RegExp(`<${name}\\b[^>]*>`,'g'))].map(m=>attrs(m[0]));
const meta=(html,key)=>tags(html,'meta').find(m=>m.name===key||m.property===key)?.content;
const canon=html=>tags(html,'link').filter(m=>m.rel==='canonical').map(m=>m.href);
const projectsHtml=read('projets/index.html');assert.match(meta(projectsHtml,'robots')||'',/noindex/,'With zero approved projects, /projets/ must remain noindex');
const homeHtml=read('index.html');
assert.ok(homeHtml.includes('Du logiciel au terrain, nous construisons la solution autour de votre besoin.'),'Homepage needs the approved YVEXOR positioning');
assert.ok(homeHtml.includes('aria-label="YVEXOR — Technologie sur mesure"'),'Homepage needs the approved static YVEXOR H1');
const homeDoors=homeHtml.match(/<nav class="[^"]*" aria-label="Choisir un parcours">([\s\S]*?)<\/nav>/)?.[1]||'';
const homeDoorLinks=[...homeDoors.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(match=>({attributes:attrs(`<a ${match[1]}>`),text:decode(match[2].replace(/<[^>]*>/g,''))}));
assert.deepEqual(homeDoorLinks.map(link=>[link.text,link.attributes.href]),[['Explorer les solutions','/solutions/'],['Explorer par métier','/metiers/']],'Homepage must provide exactly the two approved entry points');
assert.ok(!homeHtml.includes('home-process-title'),'Homepage must stay an immersive entry point without the long process section');
const compactJourney=homeHtml.match(/<section class="[^"]*" aria-label="Le parcours YVEXOR en bref">([\s\S]*?)<\/section>/)?.[1]||'';
const journeyLabels=[...compactJourney.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map(match=>decode(match[1].replace(/<[^>]*>/g,'')));
assert.deepEqual(journeyLabels,['Votre besoin','Solution sur mesure','Du logiciel au terrain'],'Homepage may show only the compact three-part YVEXOR journey');
assert.ok(homeHtml.includes('aria-hidden="true"'),'Decorative code animation must stay hidden from assistive technology');
assert.ok(!homeHtml.includes('home-project-title'),'No featured project placeholder is rendered while there are zero approved projects');
const solutionHub=read('solutions/index.html');
assert.ok(solutionHub.includes('Construire une solution sur mesure')&&solutionHub.includes('Les outils pour mon entreprise'),'Solutions hub must expose the two approved entry points');
assert.ok(solutionHub.includes('Vous avez un besoin particulier, une idée ou un équipement à connecter ? Nous construisons la solution autour.'),'Solutions hub must retain the approved custom-build message');
assert.ok(['Caisse','Site web','Gestion métier'].every(name=>solutionHub.includes(name)),'Only the three confirmed initial business tools should appear publicly');
assert.ok(!['Comptabilité','CRM','Facturation','Ressources humaines','Odoo'].some(name=>solutionHub.includes(name)),'Unconfirmed tools and platforms must not be advertised publicly');
for(const canonicalPath of ['/logiciel-sur-mesure/','/automatisation-entreprise/','/logiciel-caisse-marseille/','/applications-metier/','/site-presence-web/','/systemes-connectes/','/solutions/hebergement-infrastructure/','/solutions/retrofit-equipement-non-connecte/','/solutions-restaurants/','/solutions-hotels/','/logiciel-garage/','/caisse/','/boutique/','/materiel/']){
 assert.ok(routes.some(url=>url.pathname===canonicalPath),'Historical canonical route must remain in sitemap: '+canonicalPath);
}
assert.ok(!routes.some(url=>/^\/solutions\/(?:caisse|site-web|application-metier)\/$/.test(url.pathname)),'Business tools must not create duplicate canonical detail routes');
assert.ok(routes.some(url=>url.pathname==='/metiers/'),'The industry portal must be indexable');
for(const [route,name,tools] of [
 ['/solutions-restaurants/','Restaurant & restauration',['Caisse','Gestion métier','Site web']],
 ['/solutions-hotels/','Hôtel & hôtellerie',['Gestion métier','Site web']],
 ['/logiciel-garage/','Garage automobile',['Gestion métier']],
]){
 const html=read(route.slice(1)+'index.html');
 assert.ok(html.includes(`<h1 class="site-display site-heading-xl">${name.replaceAll('&','&amp;')}</h1>`),route+' must render the reconstructed Industry experience');
 assert.ok(tools.every(tool=>html.includes(tool)),route+' must render its explicitly related tools');
 assert.deepEqual(canon(html),[origin+route],route+' must retain its unique historical canonical');
 assert.ok(!routes.some(url=>url.pathname===`/metiers/${route.includes('restaurants')?'restaurant':route.includes('hotels')?'hotel':'garage'}/`),'Industry must not gain a competing /metiers detail route');
}
const aliases=['/realisations/','/yvexor-pos/','/projets/'];
const pages=new Map();const titles=new Set();const descriptions=new Set();
for(const url of routes){
 assert.equal(url.origin,origin);assert.ok(url.pathname.endsWith('/'));assert.ok(!/auth|admin|api|client/.test(url.pathname));
 const html=read(url.pathname.slice(1)+'index.html');pages.set(url.pathname,html);
 const title=decode(html.match(/<title>(.*?)<\/title>/s)?.[1]||'');const description=meta(html,'description');
 assert.ok(title&&description,url.pathname+' missing title/description');assert.ok(!titles.has(title),'Duplicate title '+title);assert.ok(!descriptions.has(description),'Duplicate description '+description);titles.add(title);descriptions.add(description);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,url.pathname+' H1');assert.equal(tags(html,'main').length,1,url.pathname+' main');assert.ok(tags(html,'header').length&&tags(html,'footer').length,url.pathname+' landmarks');
 assert.match(html,/<html[^>]*lang="fr"/);assert.deepEqual(canon(html),[url.href]);assert.ok(!/noindex/.test(meta(html,'robots')||''));
 assert.equal(meta(html,'og:title'),title);assert.equal(meta(html,'og:description'),description);assert.equal(meta(html,'og:url'),url.href);assert.equal(meta(html,'twitter:title'),title);
 const structured=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1])).flatMap(d=>d['@graph']||[d]);
 assert.ok(structured.some(d=>d['@type']==='Organization'));assert.ok(structured.some(d=>['WebPage','AboutPage','CollectionPage'].includes(d['@type'])));
 if(url.pathname!=='/')assert.ok(structured.some(d=>d['@type']==='BreadcrumbList'));
 assert.ok(!structured.some(d=>['Review','AggregateRating'].includes(d['@type'])));
 for(const img of tags(html,'img')){assert.ok('alt'in img,url.pathname+' missing alt');assert.ok(img.width&&img.height,url.pathname+' missing dimensions');if(img.src.startsWith('/'))assert.ok(fs.existsSync(path.join(root,img.src)),img.src);}
}
for(const [route,html]of pages){for(const a of tags(html,'a')){if(!a.href||/^(tel:|sms:|mailto:)/.test(a.href))continue;const url=new URL(a.href,origin+route);if(url.origin!==origin)continue;assert.ok(pages.has(url.pathname)||url.pathname==='/projets/',route+' links to non-indexable/missing '+a.href);if(url.hash)assert.ok(tags(pages.get(url.pathname)||read(url.pathname.slice(1)+'index.html'),'[a-zA-Z][a-zA-Z0-9]*').some(t=>t.id===decodeURIComponent(url.hash.slice(1))),route+' broken anchor '+a.href);}}
for(const route of aliases){assert.ok(!pages.has(route));assert.match(read(route.slice(1)+'index.html'),/noindex/);}
function checkDirectories(dir,prefix=''){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(!entry.isDirectory()||['_next','404'].includes(entry.name))continue;const route=prefix+'/'+entry.name,folder=path.join(dir,entry.name);if(fs.existsSync(path.join(folder,'index.html')))assert.ok(pages.has(route+'/')||aliases.includes(route+'/'),'Public route absent from sitemap: '+route);checkDirectories(folder,route);}}checkDirectories(root);
assert.match(read('404.html'),/noindex/);assert.match(read('404.html'),/Cette page est introuvable/);
assert.match(read('404.html'),/<title>Page introuvable \| YVEXOR<\/title>/);
assert.match(read('robots.txt'),/Allow: \/\s/);assert.match(read('robots.txt'),/Sitemap: https:\/\/yvexor.com\/sitemap.xml/);
assert.ok(!read('materiel/index.html').includes('Chargement du catalogue…'),'Catalogue is only a JavaScript loading state');
console.log(`PASS: ${routes.length} indexable pages — unique metadata, canonicals, HTML content, JSON-LD, images, internal links, sitemap, robots and 404.`);
