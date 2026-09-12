const {chromium}=require('playwright');
const fs=require('fs');const assert=require('assert');const path=require('path');
(async()=>{
 const sessions=JSON.parse(fs.readFileSync('portal/private/shop-preview-sessions.json','utf8'));
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  for(const width of [320,390,768,1440]){
   const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
   await context.addCookies([{name:'yvexor_session',value:sessions.client,domain:'127.0.0.1',path:'/'}]);
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   for(const route of ['/catalogue/','/catalogue/ecran-tactile-15-6/','/credits/','/panier/','/commandes/','/paiements/']){
    assert.equal((await page.goto('http://127.0.0.1:8182'+route)).status(),200,route);
    assert.ok(await page.locator('main').evaluate(n=>n.scrollWidth<=n.clientWidth+1),`${route} overflow ${width}`);
    if(route==='/catalogue/ecran-tactile-15-6/'){
     await page.locator('.shop-gallery img').evaluate(i=>i.decode());
     assert.ok(await page.getByText('199,99 € TTC',{exact:true}).count());
     if(width===390||width===1440)await page.screenshot({path:`portal/private/shop-client-${width}.png`});
    }
   }
   await context.addCookies([{name:'yvexor_session',value:sessions.admin,domain:'127.0.0.1',path:'/'}]);
   for(const route of ['/admin/boutique/','/admin/boutique/nouveau/','/admin/boutique/categories/',`/admin/clients/${sessions.org}/credits/`,`/admin/clients/${sessions.org}/paiement/`]){
    assert.equal((await page.goto('http://127.0.0.1:8182'+route)).status(),200,route);
    assert.ok(await page.locator('main').evaluate(n=>n.scrollWidth<=n.clientWidth+1),`${route} overflow ${width}`);
   }
   await context.route('https://client.yvexor.com/**',async route=>{
    const url=new URL(route.request().url());const r=await context.request.get('http://127.0.0.1:8182'+url.pathname+url.search);
    await route.fulfill({status:r.status(),body:await r.body(),headers:{'content-type':r.headers()['content-type'],'access-control-allow-origin':'*'}});
   });
   await page.goto('http://127.0.0.1:3021/materiel/');
   await page.getByRole('heading',{name:'Écran tactile 15,6 pouces',exact:true}).waitFor();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Public overflow '+width);
   await page.getByRole('link',{name:'Voir l’article →'}).click();
   await page.getByText('Référence : YV-ECRAN-156').waitFor();
   const buy=page.getByRole('link',{name:'Se connecter pour acheter'});
   assert.ok((await buy.getAttribute('href')).includes('next=%2Fcatalogue%2Fecran-tactile-15-6%2F'));
   if(width===390||width===1440)await page.screenshot({path:`portal/private/shop-public-${width}.png`,fullPage:true});
   assert.deepEqual(errors,[]);console.log('PASS shop client/admin/public layouts and product flow '+width);await context.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
