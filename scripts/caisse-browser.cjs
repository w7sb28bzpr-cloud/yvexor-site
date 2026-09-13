const {chromium,devices}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs');
const base=process.env.CAISSE_ORIGIN||'http://127.0.0.1:3021';
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});const results=[];try{
 for(const viewport of [{width:1440,height:960},{width:320,height:740},{width:390,height:844},{width:412,height:915}]){
  const context=await browser.newContext({viewport,serviceWorkers:'block',reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of ['/caisse/','/caisse/boulangerie/','/caisse/snack/','/caisse/coiffure/','/caisse/autre/','/logiciel-caisse-marseille/']){
   assert.equal((await page.goto(base+route)).status(),200);await page.waitForTimeout(150);assert.equal(await page.locator('h1').count(),1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow '+viewport.width);
  }
  await page.goto(base+'/caisse/boulangerie/');await page.getByRole('link',{name:'Choisir Pilotage',exact:false}).click();await page.getByRole('link',{name:'Choisir un poste YVEXOR',exact:false}).click();await page.getByLabel('Site internet YVEXOR ·').check();
  assert.equal(await page.getByTestId('monthly-total').innerText(),'158 € HT / mois');assert.equal(await page.getByTestId('hardware-total').innerText(),'380 € HT');
  await page.reload();assert.equal(await page.getByTestId('monthly-total').innerText(),'158 € HT / mois');
  await page.getByLabel('1. Votre activité').selectOption('alimentation');await page.locator('input[name="plan-choice"]').nth(1).check();await page.locator('input[name="hardware-choice"]').first().check();await page.getByLabel('Site internet YVEXOR ·').uncheck();assert.equal(await page.getByTestId('monthly-total').innerText(),'79 € HT / mois');
  await page.getByLabel('1. Votre activité').selectOption('snack');await page.locator('input[name="plan-choice"]').nth(2).check();await page.getByLabel('Site internet YVEXOR ·').check();await page.getByLabel('Commande mobile / QR ·').check();assert.equal(await page.getByTestId('monthly-total').innerText(),'187 € HT / mois');
  await page.locator('input[name="plan-choice"]').nth(1).check();await page.getByLabel('Site internet YVEXOR ·').uncheck();await page.getByLabel('Commande mobile / QR ·').uncheck();await page.getByLabel('Nombre de bornes').fill('1');await page.locator('input[name="hardware-choice"]').nth(1).check();assert.equal(await page.getByTestId('monthly-total').innerText(),'98 € HT / mois');
  await page.getByLabel('Nombre de écrans').fill('2');assert.equal(await page.getByTestId('monthly-total').innerText(),'116 € HT / mois');
  await page.getByLabel('Je souhaite un TPE').check();assert.equal(await page.getByTestId('monthly-total').innerText(),'116 € HT / mois');await page.getByLabel('Je préfère acheter').check();assert.equal(await page.getByTestId('monthly-total').innerText(),'Sur devis');
  await page.getByLabel('1. Votre activité').selectOption('coiffure');assert.equal(await page.getByLabel('Nombre de bornes').count(),0);await page.getByLabel('Je préfère acheter').uncheck();assert.equal(await page.getByTestId('monthly-total').innerText(),'60 € HT / mois');
  const query=await page.locator('form.cx-config').evaluate(f=>Object.fromEntries(new FormData(f)));assert.equal(query.profession,'coiffure');assert.equal(query.kiosk,'0');assert.equal(query.tpe,'true');assert.equal(query.hardware,'post');
  await page.goto(base+'/caisse/');await page.screenshot({path:`portal/private/caisse-${viewport.width}.png`,fullPage:viewport.width===1440});
  assert.deepEqual(errors,[]);results.push({viewport,ok:true});await context.close();console.log('PASS caisse: '+viewport.width);
 }
 fs.writeFileSync('portal/private/caisse-browser.json',JSON.stringify(results,null,2));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
