document.addEventListener('DOMContentLoaded', function(){

  /* Fiche contact YVEXOR intégrée directement dans le HTML — SMS only */
  const YVEXOR_PHONE_E164 = '+33756913013';
  const YVEXOR_FALLBACK_SITE = 'https://w7sb28bzpr-cloud.github.io/yvexor-site/';
  const YVEXOR_SITE = window.location.href && window.location.href.startsWith('http') ? window.location.href : YVEXOR_FALLBACK_SITE;

  function buildYvexorVCard(){
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:YVEXOR;;;;',
      'FN:YVEXOR',
      'ORG:YVEXOR',
      'TITLE:Automatisation IA • Domotique • Caisses tactiles',
      'TEL;TYPE=CELL,VOICE:' + YVEXOR_PHONE_E164,
      'URL:' + YVEXOR_SITE,
      'NOTE:Contact uniquement par SMS. YVEXOR conçoit des systèmes automatisés sur mesure : IA, agents de veille, domotique, caisses tactiles, applications et automatisations métier.',
      'END:VCARD'
    ].join('\r\n');
  }

  function downloadYvexorContact(event){
    if(event) event.preventDefault();
    const vcard = buildYvexorVCard();
    const blob = new Blob([vcard], {type:'text/vcard;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'YVEXOR-contact.vcf';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 1200);
  }

  document.querySelectorAll('[data-yvexor-vcard]').forEach((link) => {
    link.addEventListener('click', downloadYvexorContact);
    link.setAttribute('aria-label', 'Ajouter YVEXOR aux contacts');
  });

  const burger = document.getElementById('burger');
  const mobilePanel = document.getElementById('mobilePanel');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const mobileChaosBtn = document.getElementById('mobileChaosBtn');
  const contactFloatingClose = document.getElementById('contactFloatingClose');

  burger?.addEventListener('click', toggleMobileMenu);
  mobileBackdrop?.addEventListener('click', closeMobileMenu);
  contactFloatingClose?.addEventListener('click', () => {
    document.getElementById('contactFloating')?.remove();
  });

  mobilePanel?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  mobileChaosBtn?.addEventListener('click', () => {
    closeMobileMenu();
    setTimeout(() => document.getElementById('chaosBtn')?.click(), 120);
  });

  function toggleMobileMenu(event){
    if(event){
      event.preventDefault();
      event.stopPropagation();
    }
    const isOpen = mobilePanel?.classList.contains('open');
    if(isOpen){
      closeMobileMenu();
    }else{
      openMobileMenu();
    }
  }

  function openMobileMenu(){
    burger?.classList.add('active');
    burger?.setAttribute('aria-expanded', 'true');
    burger?.setAttribute('aria-label', 'Fermer le menu');
    mobilePanel?.classList.add('open');
    mobilePanel?.setAttribute('aria-hidden', 'false');
    mobileBackdrop?.classList.add('open');
    document.body.classList.add('menu-open');
    mobilePanel?.querySelector('a')?.focus();
  }

  function closeMobileMenu(){
    burger?.classList.remove('active');
    burger?.setAttribute('aria-expanded', 'false');
    burger?.setAttribute('aria-label', 'Ouvrir le menu');
    mobilePanel?.classList.remove('open');
    mobilePanel?.setAttribute('aria-hidden', 'true');
    mobileBackdrop?.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  window.toggleMobileMenu = toggleMobileMenu;
  window.closeMobileMenu = closeMobileMenu;

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeMobileMenu();
  });

  window.addEventListener('resize', () => {
    if(window.innerWidth > 760) closeMobileMenu();
  });

  /* Sections statiques : pas d'animation de scroll pour garder un rendu propre partout */
  const observedSections = document.querySelectorAll('section:not(.hero)');
  observedSections.forEach((section) => section.classList.add('section-visible'));

  /* ══════════════════════════════════════════
     CHAOS ENGINE v2 — Particles + Glitch + Shockwave + Lightning
  ══════════════════════════════════════════ */
  const chaosBtn        = document.getElementById('chaosBtn');
  const rebuildFlash    = document.getElementById('rebuildFlash');
  const chaosHudTitle   = document.getElementById('chaosHudTitle');
  const chaosHudSub     = document.getElementById('chaosHudSub');
  const chaosCanvas     = document.getElementById('chaosCanvas');
  const ctx             = chaosCanvas ? chaosCanvas.getContext('2d') : null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmallOrSlowDevice = window.innerWidth <= 760 ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    navigator.connection?.saveData;
  const particleScale = prefersReducedMotion ? 0.12 : (isSmallOrSlowDevice ? 0.45 : 1);

  let chaosActive    = false;
  let chaosRAF       = null;
  let chaosTimer     = null;
  let chaosTextTimer = null;
  let originals      = [];
  let particles      = [];
  let glitchBlocks   = [];

  const hudPhrases = [
    ['SYSTÈME DÉTRUIT', 'YVEXOR.EXE — CRITICAL FAILURE'],
    ['CORE DUMP', 'MEMORY OVERFLOW // 0x0000DEAD'],
    ['ERREUR FATALE', 'KERNEL PANIC — NO OUTPUT'],
    ['CRASH TOTAL', 'SEGFAULT AT 0xFFFF — ABORT'],
    ['SITE EN PANNE', 'EXCEPTION NON GÉRÉE // RESTART'],
    ['REALITY BROKEN', 'YVEXOR CORE REBUILDING...'],
  ];
  let hudIdx = 0;

  const glitchWords = [
    'NULL','0xDEAD','CRASH','ABORT','ERROR','SEGFAULT',
    'PANIC','OVERFLOW','CORRUPTED','FATAL','#!%@',
    '01001','YVEXOR','CORE','DUMP','MEMORY','LEAK',
    '████','▓▒░','???','NaN','undefined','void*',
  ];

  function resizeCanvas(){
    if(!chaosCanvas) return;
    chaosCanvas.width  = window.innerWidth;
    chaosCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function spawnParticles(cx, cy, count){
    const adjustedCount = Math.max(1, Math.round(count * particleScale));
    for(let i = 0; i < adjustedCount; i++){
      const angle  = Math.random() * Math.PI * 2;
      const speed  = 2 + Math.random() * 14;
      const size   = 2 + Math.random() * 8;
      const colors = ['#ff003c','#ff006e','#00fff7','#0a84ff','#ffffff','#fbbf24','#a78bfa'];
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: .012 + Math.random() * .025,
        square: Math.random() > .5,
      });
    }
  }

  function spawnGlitchBlocks(){
    const blockCount = isSmallOrSlowDevice ? 6 : 14;
    for(let i = 0; i < blockCount; i++){
      glitchBlocks.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        w: 30 + Math.random() * 240,
        h: 3  + Math.random() * 16,
        color: Math.random() > .5
          ? `rgba(255,0,60,${(.15+Math.random()*.4).toFixed(2)})`
          : `rgba(0,255,247,${(.1+Math.random()*.3).toFixed(2)})`,
        life: 1,
        decay: .06 + Math.random() * .1,
        offsetX: (Math.random() - .5) * 80,
      });
    }
  }

  function chaosLoop(){
    if(!chaosActive || !ctx) return;
    ctx.clearRect(0, 0, chaosCanvas.width, chaosCanvas.height);

    if(Math.random() < (isSmallOrSlowDevice ? .1 : .22)) spawnGlitchBlocks();

    glitchBlocks.forEach(b => {
      ctx.save();
      ctx.globalAlpha = b.life;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x + b.offsetX * (1 - b.life), b.y, b.w, b.h);
      ctx.restore();
      b.life -= b.decay;
    });
    glitchBlocks = glitchBlocks.filter(b => b.life > 0);

    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      if(p.square){
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
      }else{
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size/2, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
      p.x += p.vx;
      p.y += p.vy;
      p.vy += .25;
      p.vx *= .97;
      p.alpha -= p.decay;
    });
    particles = particles.filter(p => p.alpha > 0);

    chaosRAF = requestAnimationFrame(chaosLoop);
  }

  function triggerShockwave(){
    const sw = document.createElement('div');
    sw.className = 'shockwave';
    sw.style.left = '50%';
    sw.style.top  = '38%';
    document.body.appendChild(sw);
    setTimeout(() => sw.remove(), 1100);
  }

  function triggerLightning(){
    const l = document.createElement('div');
    l.className = 'lightning';
    document.body.appendChild(l);
    setTimeout(() => l.remove(), 650);
  }

  function randomGlitch(){
    const len = 3 + Math.floor(Math.random() * 7);
    let out = '';
    for(let i = 0; i < len; i++){
      out += glitchWords[Math.floor(Math.random() * glitchWords.length)] + ' ';
    }
    return out.trim();
  }

  function setChaosButton(label, rebuilding=false){
    if(!chaosBtn) return;
    chaosBtn.textContent = label;
    if(rebuilding){
      chaosBtn.style.background = 'linear-gradient(135deg,#22c55e,#00d4ff)';
      chaosBtn.style.color = '#002b1e';
    }else{
      chaosBtn.style.background = '';
      chaosBtn.style.color = '';
    }
  }

  function startChaos(){
    if(chaosActive) return;
    chaosActive = true;
    setChaosButton('⚡ Reconstruire', true);

    document.body.classList.add('chaos-mode');
    resizeCanvas();
    chaosLoop();

    spawnParticles(window.innerWidth / 2, window.innerHeight * 0.38, 300);
    triggerShockwave();
    setTimeout(triggerLightning, 60);
    setTimeout(triggerLightning, 260);
    setTimeout(() => spawnParticles(window.innerWidth * .22, window.innerHeight * .55, 130), 350);
    setTimeout(() => spawnParticles(window.innerWidth * .78, window.innerHeight * .32, 130), 550);
    setTimeout(triggerShockwave, 600);
    setTimeout(triggerLightning, 680);
    setTimeout(() => spawnParticles(window.innerWidth * .5, window.innerHeight * .7, 80), 900);

    const targets = Array.from(document.querySelectorAll(
      'main h1, main h2, main h3, main h4, main p, main li, main .example, main .audience, main .note'
    ));
    originals = targets.map(el => ({ el, html: el.innerHTML }));
    targets.forEach(el => el.classList.add('chaos-target'));

    function scramble(){
      if(!chaosActive) return;
      originals.forEach(item => {
        if(Math.random() < .6) item.el.textContent = randomGlitch();
      });
    }
    scramble();
    chaosTextTimer = setInterval(scramble, 85);

    hudIdx = 0;
    const hudInterval = setInterval(() => {
      if(!chaosActive){ clearInterval(hudInterval); return; }
      const p = hudPhrases[hudIdx % hudPhrases.length];
      if(chaosHudTitle) chaosHudTitle.textContent = p[0];
      if(chaosHudSub) chaosHudSub.textContent = p[1];
      hudIdx++;
    }, 750);

    chaosTimer = setTimeout(rebuildPage, 12000);
  }

  function rebuildPage(){
    if(!chaosActive) return;
    clearTimeout(chaosTimer);
    clearInterval(chaosTextTimer);
    chaosActive = false;

    cancelAnimationFrame(chaosRAF);
    if(ctx) ctx.clearRect(0, 0, chaosCanvas.width, chaosCanvas.height);
    particles = [];
    glitchBlocks = [];

    originals.forEach(item => {
      item.el.innerHTML = item.html;
      item.el.classList.remove('chaos-target');
    });
    originals = [];

    document.body.classList.remove('chaos-mode');
    setChaosButton('Détruire le site 😂', false);

    rebuildFlash.classList.remove('active');
    void rebuildFlash.offsetWidth;
    rebuildFlash.classList.add('active');

    resizeCanvas();
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2, 220);
    const rebuildColors = ['#00fff7','#0a84ff','#22c55e','#ffffff','#a78bfa'];
    particles.forEach(p => p.color = rebuildColors[Math.floor(Math.random() * rebuildColors.length)]);

    function rebuildLoop(){
      if(!ctx) return;
      ctx.clearRect(0, 0, chaosCanvas.width, chaosCanvas.height);
      particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size/2, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += .25;
        p.vx *= .97;
        p.alpha -= p.decay;
      });
      particles = particles.filter(p => p.alpha > 0);
      if(particles.length > 0) requestAnimationFrame(rebuildLoop);
      else if(ctx) ctx.clearRect(0, 0, chaosCanvas.width, chaosCanvas.height);
    }
    rebuildLoop();
  }

  if(chaosBtn){
    chaosBtn.addEventListener('click', () => {
      if(chaosActive) rebuildPage();
      else startChaos();
    });
  }

  const stars = document.querySelector('.stars');
  if(stars){
    const starCount = prefersReducedMotion ? 12 : (isSmallOrSlowDevice ? 28 : 55);
    for(let i = 0; i < starCount; i++){
      const s = document.createElement('span');
      s.className = 'star';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.opacity = (Math.random() * .55 + .15).toFixed(2);
      s.style.transform = 'scale(' + (Math.random() * 1.5 + .5).toFixed(2) + ')';
      stars.appendChild(s);
    }
  }
});
