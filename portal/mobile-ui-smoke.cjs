/* Local authenticated QA; never runs fixtures or password changes in production.
   Requires Playwright, local Django at 8181 and portal/.venv. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const path=require('node:path');
const fs=require('node:fs');
const root=path.resolve(__dirname,'..'), origin='http://127.0.0.1:8181';
const output=execFileSync(path.join(__dirname,'.venv/Scripts/python.exe'),['portal/manage.py','shell','-c',"exec(open('portal/tests/mobile-fixtures.py', encoding='utf-8').read())"],{cwd:root,encoding:'utf8',env:{...process.env,PORTAL_DEBUG:'1',PORTAL_SECRET_KEY:'local-test-only-not-production'}});
const fixture=JSON.parse(output.trim().split('\n').at(-1)); // Never log sessions.
const errors=[];
const pause=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
async function contextFor(browser,width,height,touch=true,session=fixture.client,fallback=false) {
 const context=await browser.newContext({viewport:{width,height},hasTouch:touch});
 await context.addCookies([{name:fixture.cookie,value:session,domain:'127.0.0.1',path:'/',httpOnly:true,sameSite:'Lax'}]);
 await context.addInitScript(({fallback})=>{
   if(fallback){Object.defineProperty(window,'visualViewport',{value:undefined});window.simulateViewport=(height)=>{Object.defineProperty(window,'innerHeight',{configurable:true,value:height});dispatchEvent(new Event('resize'));};return;}
   const viewport=new EventTarget();Object.assign(viewport,{height:innerHeight,offsetTop:0,scale:1});
   Object.defineProperty(window,'visualViewport',{value:viewport});
   window.simulateViewport=(height,offsetTop=0,scale=1)=>{Object.assign(viewport,{height,offsetTop,scale});viewport.dispatchEvent(new Event('resize'));viewport.dispatchEvent(new Event('scroll'));};
 },{fallback});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 return {context,page};
}
async function visit(page,route){const response=await page.goto(origin+route,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,route);await pause(page);}
async function dockCheck(page) {
 return page.evaluate(()=>{
  const nav=document.querySelector('.mobile-nav'), main=document.querySelector('.workspace>main');
  const n=nav.getBoundingClientRect(), app=document.querySelector('#application').getBoundingClientRect();
  const visible=getComputedStyle(nav).display!=='none';
  return {visible, bottom:n.bottom, appBottom:app.bottom, height:innerHeight, mainBottom:main.getBoundingClientRect().bottom, navTop:n.top,
    links:[...nav.querySelectorAll('a')].every(a=>{const b=a.getBoundingClientRect(),s=a.querySelector('span').getBoundingClientRect();return b.height>=44 && s.top>=n.top && s.bottom<=n.bottom;}),
    overflow:document.documentElement.scrollWidth>innerWidth || main.scrollWidth>main.clientWidth+1};
 });
}
async function keyboardFlow(page,route,fields,height=844) {
 await visit(page,route);
 for(const field of fields) {
  await page.locator(field).focus();await pause(page);
  if(field===fields[0])assert.equal(await page.locator('.mobile-nav').isVisible(),true,'Hardware keyboard/focus alone leaves dock visible');
  await page.evaluate(()=>simulateViewport(420,60));await pause(page);
  assert.equal(await page.locator('.mobile-nav').isVisible(),false,'OSK hides dock');
  await page.locator(field).fill('Test de saisie mobile');await pause(page);
  const fit=await page.locator(field).evaluate(el=>{
   const b=el.getBoundingClientRect(),m=document.querySelector('.workspace>main').getBoundingClientRect();
   return b.top>=Math.max(m.top,visualViewport.offsetTop)-1 && b.bottom<=Math.min(m.bottom,visualViewport.offsetTop+visualViewport.height)+1;
  });assert.ok(fit,route+' active field visible: '+field);
 }
 // Closing OSK must restore the dock even though the field still has focus.
 await page.evaluate(h=>simulateViewport(h),height);await pause(page);
 assert.equal(await page.locator('.mobile-nav').isVisible(),true,'Dock restored without blur/refresh');
 const dock=await dockCheck(page);assert.ok(Math.abs(dock.bottom-height)<2);assert.ok(dock.links);
}
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  for(const [width,height,touch] of [[320,700,true],[375,812,true],[390,844,true],[430,932,true],[768,1024,true],[1440,900,false]]) {
   const {context,page}=await contextFor(browser,width,height,touch);
   for(const route of ['/client/','/projects/','/messages/','/requests/','/account/','/requests/new/','/projects/'+fixture.project+'/']) {
    await visit(page,route);const dock=await dockCheck(page);assert.equal(dock.overflow,false,`${width} ${route} horizontal overflow`);
    if(touch){assert.ok(dock.visible && dock.links,`${width} ${route} dock visible`);assert.ok(Math.abs(dock.bottom-height)<2);assert.ok(dock.mainBottom<=dock.navTop+1);}
    await page.locator('.workspace>main').evaluate(el=>{el.scrollTop=el.scrollHeight;});await pause(page);
    if(touch)assert.ok(Math.abs((await dockCheck(page)).bottom-height)<2,'Scroll must not shift dock');
   }
   console.log('PASS responsive routes at '+width+'px');await context.close();
  }
  const {context,page}=await contextFor(browser,390,844);
  await visit(page,'/client/');
  await page.evaluate(()=>{document.documentElement.style.setProperty('--safe-top','47px');document.documentElement.style.setProperty('--safe-bottom','34px');});await pause(page);
  assert.ok((await page.locator('.topbar-brand').boundingBox()).y>=47,'Nonzero top safe area respected');
  const safeDock=await dockCheck(page);assert.ok(Math.abs(safeDock.bottom-844)<2);
  assert.ok(await page.locator('.mobile-nav').evaluate(el=>[...el.querySelectorAll('a span')].every(label=>label.getBoundingClientRect().bottom<=el.getBoundingClientRect().bottom-34)),'Labels above bottom safe area');
  await keyboardFlow(page,'/requests/new/',['#id_title','#id_body','#id_details']);
  await keyboardFlow(page,'/account/',['#id_old_password','#id_new_password1','#id_new_password2']);
  // Safari chrome movement and pinch zoom must not count as an OSK.
  await page.evaluate(()=>simulateViewport(780,0));await pause(page);assert.equal(await page.locator('.mobile-nav').isVisible(),true);
  await page.evaluate(()=>simulateViewport(400,20,2));await pause(page);assert.equal(await page.locator('.mobile-nav').isVisible(),true);
  await page.evaluate(()=>simulateViewport(420,60));await pause(page);
  await page.setViewportSize({width:844,height:390});await page.evaluate(()=>{simulateViewport(390);dispatchEvent(new Event('orientationchange'));});await pause(page);
  assert.equal(await page.locator('.mobile-nav').isVisible(),true,'Rotation resets OSK state');assert.ok(Math.abs((await dockCheck(page)).bottom-390)<2);
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>{simulateViewport(844);dispatchEvent(new Event('orientationchange'));});await pause(page);
  await visit(page,'/account/');
  const newPassword=page.locator('#id_new_password1');
  await newPassword.fill('123456789012');assert.equal(await page.locator('[data-password-rule=length]').getAttribute('data-valid'),'true');assert.equal(await page.locator('[data-password-rule=numeric]').getAttribute('data-valid'),'false');
  await newPassword.fill('DifferentLocalPassword!2030');assert.equal(await page.locator('[data-password-rule=numeric]').getAttribute('data-valid'),'true');
  for(const id of ['old_password','new_password1','new_password2']) {
   const input=page.locator('#id_'+id);assert.equal((await input.boundingBox()).height,56);
   const eye=page.locator('[data-password-toggle=id_'+id+']');await eye.click();assert.equal(await input.getAttribute('type'),'text');await eye.click();assert.equal(await input.getAttribute('type'),'password');
  }
  await page.locator('#password-change').scrollIntoViewIfNeeded();
  fs.mkdirSync(path.join(__dirname,'private'),{recursive:true});await page.screenshot({path:path.join(__dirname,'private/password-mobile-audit.png')});
  await page.locator('#id_old_password').fill('LocalPreviewOnly!2026');await page.locator('#id_new_password2').fill('DifferentLocalPassword!2030');
  await page.getByRole('button',{name:'Modifier mon mot de passe',exact:true}).click();
  await page.getByText('Mot de passe modifié. Les anciennes sessions des autres appareils ne sont plus valables.',{exact:true}).waitFor();
  await visit(page,'/client/'); // Current session survives the password change.
  await page.screenshot({path:path.join(__dirname,'private/dashboard-mobile-audit.png')});
  await visit(page,'/messages/'+fixture.org+'/');await page.locator('#id_body').fill('Test du clavier dans une discussion');
  await page.getByRole('button',{name:'Envoyer le message'}).click();await page.getByText('Test du clavier dans une discussion',{exact:true}).waitFor();
  await page.evaluate(()=>simulateViewport(420,60));await pause(page);
  const chat=await page.evaluate(()=>{const h=document.querySelector('.chat-header').getBoundingClientRect(), c=document.querySelector('.chat-composer').getBoundingClientRect();return h.top>=60 && c.bottom<=480;});assert.ok(chat,'Contact and composer remain visible');
  await context.close();
  const admin=await contextFor(browser,390,844,true,fixture.admin);
  await keyboardFlow(admin.page,'/admin/clients/',['#q']);
  await keyboardFlow(admin.page,'/projects/'+fixture.project+'/',['#id_name','#id_description']);
  await admin.context.close();
  const fallback=await contextFor(browser,390,844,true,fixture.admin,true);
  await visit(fallback.page,'/account/');await fallback.page.locator('#id_old_password').focus();await fallback.page.evaluate(()=>simulateViewport(420));await pause(fallback.page);assert.equal(await fallback.page.locator('.mobile-nav').isVisible(),false,'Fallback detects large innerHeight reduction');
  await fallback.page.evaluate(()=>simulateViewport(844));await pause(fallback.page);assert.equal(await fallback.page.locator('.mobile-nav').isVisible(),true);await fallback.context.close();
  const desktop=await contextFor(browser,390,844,false,fixture.admin);
  await visit(desktop.page,'/account/');await desktop.page.locator('#id_old_password').focus();await desktop.page.evaluate(()=>simulateViewport(420));await pause(desktop.page);assert.equal(await desktop.page.locator('.mobile-nav').isVisible(),true,'Non-touch input focus must not hide dock');await desktop.context.close();
  assert.deepEqual(errors,[]);console.log('PASS OSK forms/chat, active fields, close with focus retained, chrome/zoom, orientation, physical keyboard, fallback, password eyes/checklist/change; local tests, not native iPhone OSK.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
