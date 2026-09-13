const {chromium}=require('playwright');const fs=require('node:fs');const assert=require('node:assert/strict');
const base=process.env.SEO_ORIGIN||'http://127.0.0.1:3021';
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});const results=[];try{
const sitemap=fs.readFileSync('out/sitemap.xml','utf8');const routes=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
for(const width of [320,390,1440]){const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
 if(base.includes('127.0.0.1')||base.includes('localhost'))await context.route('https://client.yvexor.com/api/catalogue/**',async route=>{try{const response=await context.request.get(route.request().url());await route.fulfill({status:response.status(),body:await response.body(),headers:{'content-type':'application/json','access-control-allow-origin':'*'}});}catch(error){if(!/already handled|Target.*closed|context disposed/i.test(error.message))throw error;}});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 for(const route of routes){assert.equal((await page.goto(base+route)).status(),200);await page.waitForTimeout(100);assert.equal(await page.locator('h1').count(),1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow '+route+' '+width);
  if(width===320){await page.getByLabel('Menu de navigation').click();assert.ok(await page.getByRole('navigation',{name:'Accès rapides mobile'}).isVisible());await page.keyboard.press('Escape');assert.ok(!await page.getByRole('navigation',{name:'Accès rapides mobile'}).isVisible());}
  const missing=await page.locator('img').evaluateAll(images=>images.filter(i=>i.loading!=='lazy'&&i.complete&&!i.naturalWidth).map(i=>i.src));assert.deepEqual(missing,[],route+' broken images');
  if(width===390&&['/','/logiciel-sur-mesure/','/materiel/'].includes(route))await page.screenshot({path:`portal/private/seo-${route.replaceAll('/','')||'home'}-390.png`,fullPage:true});
  results.push({route,width,ok:true});
 }
 await page.goto(base+'/materiel/');await page.getByRole('heading',{name:'Écran tactile 15,6 pouces',exact:true}).waitFor();await page.getByLabel('Rechercher du matériel').fill('introuvable-seo');await page.getByRole('button',{name:'Rechercher',exact:true}).click();await page.getByText('Aucun article disponible pour cette sélection.').waitFor();await page.getByLabel('Rechercher du matériel').fill('');await page.getByRole('button',{name:'Rechercher',exact:true}).click();await page.getByRole('link',{name:'Voir l’article →'}).click();await page.getByText('Référence : YV-ECRAN-156').waitFor();assert.ok((await page.getByRole('link',{name:'Se connecter pour acheter'}).getAttribute('href')).includes('next=%2Fcatalogue%2F'));
 await context.unrouteAll({behavior:'wait'});assert.deepEqual(errors,[]);await context.close();console.log('PASS '+routes.length+' routes, navigation, catalogue/search/detail at '+width);
}
fs.writeFileSync(process.env.SEO_BROWSER_REPORT||'audit/browser-after.json',JSON.stringify({base,results},null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
