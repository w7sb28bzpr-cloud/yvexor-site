// Read-only crawl of public HTML, before JavaScript execution.
const {chromium}=require('playwright');
const fs=require('node:fs');
const origin=process.env.SEO_ORIGIN||'https://yvexor.com';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const context=await browser.newContext({javaScriptEnabled:false,serviceWorkers:'block'});
 const sitemap=await (await context.request.get(origin+'/sitemap.xml')).text();
 const paths=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 const rows=[];
 for(const path of [...paths,'/a-propos/','/realisations/','/yvexor-pos/','/seo-introuvable-audit/']){
  const response=await context.request.get(origin+path);const html=await response.text();
  const page=await context.newPage();await page.route('**/*',r=>r.abort());await page.setContent(html.replace(/<meta\b[^>]*http-equiv="refresh"[^>]*>/gi,''));
  const data=await page.evaluate(()=>{
   const content=document.querySelector('main');
   return {title:document.title,description:document.querySelector('meta[name="description"]')?.content,canonical:document.querySelector('link[rel="canonical"]')?.href,robots:document.querySelector('meta[name="robots"]')?.content,lang:document.documentElement.lang,h1:[...document.querySelectorAll('h1')].map(n=>n.textContent),headings:[...document.querySelectorAll('h1,h2,h3')].map(n=>[n.tagName,n.textContent]),og:Object.fromEntries([...document.querySelectorAll('meta[property^="og:"]')].map(n=>[n.getAttribute('property'),n.content])),jsonLd:[...document.querySelectorAll('script[type="application/ld+json"]')].map(n=>{try{return JSON.parse(n.textContent)}catch{return 'INVALID'}}),links:[...document.querySelectorAll('a[href]')].map(n=>({href:n.getAttribute('href'),text:n.textContent.trim()})),ids:[...document.querySelectorAll('[id]')].map(n=>n.id),images:[...document.images].map(n=>({src:n.getAttribute('src'),alt:n.getAttribute('alt'),width:n.getAttribute('width'),height:n.getAttribute('height'),loading:n.loading})),paragraphs:[...content?.querySelectorAll('p')||[]].map(n=>n.textContent),landmarks:{main:document.querySelectorAll('main').length,header:!!document.querySelector('header'),footer:!!document.querySelector('footer')},textLength:content?.textContent.length||0};
  });rows.push({path,status:response.status(),bytes:Buffer.byteLength(html),...data});await page.close();
 }
 const broken=[];const incoming=new Set(['/']);
 for(const row of rows)for(const link of row.links){if(!link.href||/^(tel:|sms:|mailto:)/.test(link.href))continue;const url=new URL(link.href,'https://yvexor.com'+row.path);if(url.origin!=='https://yvexor.com')continue;const target=rows.find(r=>r.path===url.pathname);if(!target){broken.push({from:row.path,to:link.href,reason:'unlisted route'});continue;}if(url.hash&&!target.ids.includes(decodeURIComponent(url.hash.slice(1))))broken.push({from:row.path,to:link.href,reason:'missing anchor'});if(row.path!==url.pathname)incoming.add(url.pathname);}
 const redirects=[];if(origin==='https://yvexor.com')for(const url of ['http://yvexor.com/','https://www.yvexor.com/','http://www.yvexor.com/','https://yvexor.com/contact']){const r=await context.request.get(url,{maxRedirects:0});redirects.push({url,status:r.status(),location:r.headers().location});}
 const result={date:new Date().toISOString(),origin,rows,broken,orphans:paths.filter(p=>!incoming.has(p)),redirects,robots:await(await context.request.get(origin+'/robots.txt')).text()};
 fs.mkdirSync('audit',{recursive:true});fs.writeFileSync(process.env.SEO_REPORT||'audit/seo-before.json',JSON.stringify(result,null,2));
 if((process.env.SEO_REPORT||'').includes('after')){const cell=s=>String(s||'').replaceAll('|','\\|').replaceAll('\n',' ');fs.writeFileSync('audit/metadata-after.md','# Métadonnées finales YVEXOR\n\n| URL | Title | Meta description |\n|---|---|---|\n'+rows.filter(r=>paths.includes(r.path)).map(r=>`| ${r.path} | ${cell(r.title)} | ${cell(r.description)} |`).join('\n')+'\n');}
 console.log(JSON.stringify({pages:rows.map(r=>({path:r.path,status:r.status,h1:r.h1,title:r.title,ld:r.jsonLd.length})),broken,orphans:result.orphans,redirects},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
