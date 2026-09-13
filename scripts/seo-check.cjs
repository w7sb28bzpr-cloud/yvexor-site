// Dependency-free assertions against the exact static export sent to Google.
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const root=path.resolve('out');const origin='https://yvexor.com';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const sitemap=read('sitemap.xml');const routes=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]));
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'");
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],decode(m[2])]));
const tags=(html,name)=>[...html.matchAll(new RegExp(`<${name}\\b[^>]*>`,'g'))].map(m=>attrs(m[0]));
const meta=(html,key)=>tags(html,'meta').find(m=>m.name===key||m.property===key)?.content;
const canon=html=>tags(html,'link').filter(m=>m.rel==='canonical').map(m=>m.href);
const aliases=['/a-propos/','/realisations/','/yvexor-pos/'];
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
for(const [route,html]of pages){for(const a of tags(html,'a')){if(!a.href||/^(tel:|sms:|mailto:)/.test(a.href))continue;const url=new URL(a.href,origin+route);if(url.origin!==origin)continue;assert.ok(pages.has(url.pathname),route+' links to non-indexable/missing '+a.href);if(url.hash)assert.ok(tags(pages.get(url.pathname),'[a-zA-Z][a-zA-Z0-9]*').some(t=>t.id===decodeURIComponent(url.hash.slice(1))),route+' broken anchor '+a.href);}}
for(const route of aliases){assert.ok(!pages.has(route));assert.match(read(route.slice(1)+'index.html'),/noindex/);}
for(const entry of fs.readdirSync(root,{withFileTypes:true})){if(entry.isDirectory()&&!['_next','404'].includes(entry.name)&&fs.existsSync(path.join(root,entry.name,'index.html')))assert.ok(pages.has('/'+entry.name+'/')||aliases.includes('/'+entry.name+'/'),'Public route absent from sitemap: '+entry.name);}
assert.match(read('404.html'),/noindex/);assert.match(read('404.html'),/Cette page est introuvable/);
assert.match(read('404.html'),/<title>Page introuvable \| YVEXOR<\/title>/);
assert.match(read('robots.txt'),/Allow: \/\s/);assert.match(read('robots.txt'),/Sitemap: https:\/\/yvexor.com\/sitemap.xml/);
assert.ok(!read('materiel/index.html').includes('Chargement du catalogue…'),'Catalogue is only a JavaScript loading state');
console.log(`PASS: ${routes.length} indexable pages — unique metadata, canonicals, HTML content, JSON-LD, images, internal links, sitemap, robots and 404.`);
