/* Central mobile viewport controller. No business data or credentials here. */
(() => {
  const root=document.documentElement, viewport=window.visualViewport;
  const mobile=matchMedia('(max-width:720px), (max-width:1024px) and (any-pointer:coarse)');
  const touch=()=>navigator.maxTouchPoints>0 || matchMedia('(any-pointer:coarse)').matches;
  const editable=element=>element instanceof HTMLElement && !element.matches(':disabled,[readonly]') &&
    (element.matches('textarea,[contenteditable="true"]') || (element.matches('input') && !['button','submit','reset','checkbox','radio','file','range','color','hidden','date','time','month','week'].includes(element.type)));
  let baseline=viewport?.height || innerHeight, width=innerWidth, isVirtualKeyboardOpen=false;
  let frame=0, focusTimer=0, controller;
  function ensureFieldVisible() {
    const field=document.activeElement;
    if (!isVirtualKeyboardOpen || !editable(field) || field.closest('.chat-composer')) return;
    // Scroll only the nearest existing scroll container, only if obscured.
    let scroller=field.parentElement;
    while(scroller && scroller!==document.body) {
      if (/(auto|scroll)/.test(getComputedStyle(scroller).overflowY) && scroller.scrollHeight>scroller.clientHeight) break;
      scroller=scroller.parentElement;
    }
    if (!scroller || scroller===document.body) return;
    const box=field.getBoundingClientRect(), area=scroller.getBoundingClientRect();
    const top=Math.max(area.top,viewport?.offsetTop || 0)+12;
    const bottom=Math.min(area.bottom,(viewport?.offsetTop || 0)+(viewport?.height || innerHeight))-12;
    const delta=box.top<top ? box.top-top : box.bottom>bottom ? Math.min(box.bottom-bottom,box.top-top) : 0;
    if (Math.abs(delta)>1) scroller.scrollTop+=delta;
  }
  function update() {
    frame=0;
    if (viewport && Math.abs(viewport.scale-1)>.05) return; // Preserve pinch zoom.
    const height=viewport?.height || innerHeight;
    const rotated=Math.abs(innerWidth-width)>80;
    if(rotated) {baseline=height; width=innerWidth; isVirtualKeyboardOpen=false;}
    const editing=editable(document.activeElement);
    if(!editing && !isVirtualKeyboardOpen) baseline=height;
    if(!isVirtualKeyboardOpen) baseline=Math.max(baseline,height);
    // The baseline also covers browsers that resize innerHeight with the OSK.
    // Hysteresis ignores Safari chrome and prevents flicker during animation.
    const missing=Math.max(baseline-height,viewport ? innerHeight-height : 0);
    const threshold=isVirtualKeyboardOpen ? Math.max(90,baseline*.10) : Math.max(140,baseline*.18);
    isVirtualKeyboardOpen=mobile.matches && touch() && editing && !rotated && missing>threshold;
    root.classList.toggle('is-virtual-keyboard-open',isVirtualKeyboardOpen);
    root.style.setProperty('--visual-height',height+'px');
    root.style.setProperty('--visual-top',(viewport?.offsetTop || 0)+'px');
    window.dispatchEvent(new CustomEvent('portal:viewport',{detail:{isVirtualKeyboardOpen}}));
    ensureFieldVisible();
  }
  function schedule() {if(!frame)frame=requestAnimationFrame(update);}
  function focusChanged() {schedule();clearTimeout(focusTimer);focusTimer=setTimeout(schedule,250);}
  function orientationChanged() {baseline=viewport?.height || innerHeight; width=innerWidth; isVirtualKeyboardOpen=false; root.classList.remove('is-virtual-keyboard-open');schedule();}
  function start() {
    controller?.abort();controller=new AbortController();const options={signal:controller.signal,passive:true};
    viewport?.addEventListener('resize',schedule,options);viewport?.addEventListener('scroll',schedule,options);
    window.addEventListener('resize',schedule,options);window.addEventListener('orientationchange',orientationChanged,options);
    mobile.addEventListener('change',schedule,options);
    document.addEventListener('focusin',focusChanged,options);document.addEventListener('focusout',focusChanged,options);
    update();
  }
  window.addEventListener('pagehide',()=>{controller?.abort();cancelAnimationFrame(frame);frame=0;clearTimeout(focusTimer);});
  window.addEventListener('pageshow',start);start();
})();
