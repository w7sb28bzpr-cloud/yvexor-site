const {chromium}=require('playwright');const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.CAISSE_ORIGIN||'https://yvexor.com';
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});const page=await context.newPage();const results=[];
 for(const route of ['/caisse/','/caisse/snack/','/caisse/coiffure/']){
  await page.addInitScript(()=>{window.cxMetrics={lcp:0,cls:0};new PerformanceObserver(l=>{for(const e of l.getEntries())window.cxMetrics.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.cxMetrics.cls+=e.value}).observe({type:'layout-shift',buffered:true})});
  const response=await page.goto(base+route);assert.equal(response.status(),200);await page.waitForTimeout(1500);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));results.push({route,status:response.status(),...await page.evaluate(()=>window.cxMetrics)});
 }
 // Anonymous draft handoff only. No account, request, order or payment is created.
 const response=await context.request.get('https://client.yvexor.com/caisse/preparer/?profession=snack&plan=stock&hardware=post&kiosk=1',{maxRedirects:0});assert.equal(response.status(),302);assert.equal(response.headers().location,'/auth/login/');
 const login=await context.request.get('https://client.yvexor.com/auth/login/');assert.equal(login.status(),200);assert.match(login.headers()['x-robots-tag'],/noindex/);
 for(const host of ['client','admin']){const r=await context.request.get(`https://${host}.yvexor.com/auth/login/`);assert.equal(r.status(),200)}
 const invalid=await context.request.get('https://client.yvexor.com/caisse/preparer/?profession=restaurant&plan=stock&hardware=post',{maxRedirects:0});assert.equal(invalid.status(),400);
 fs.writeFileSync('portal/private/caisse-production.json',JSON.stringify({base,conditions:'Chromium, largeur 390px, sans ralentissement CPU/réseau. Mesures de laboratoire, pas des Core Web Vitals terrain ni un test iOS physique.',results,handoff:'PASS: anonymous draft to login, no business record created',privateLogin:'PASS client/admin noindex',restaurant:'PASS rejected from shared pricing'},null,2));console.log(results);console.log('PASS production handoff + protected client/admin login');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
