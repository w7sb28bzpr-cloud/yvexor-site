const PHONE_NUMBER = '+33756913013';
const WEBSITE_URL = 'https://yvexor.com/';
const SMS_MESSAGE = 'Bonjour, je vous contacte depuis le site YVEXOR. Je souhaite obtenir plus d’informations sur vos services.';

const menuButton = document.getElementById('mobile-menu-button');
const navigation = document.getElementById('main-navigation');
const statusElement = document.getElementById('contact-status');

function isMobileMenuOpen() {
  return navigation?.classList.contains('open') ?? false;
}

function setMobileMenu(open) {
  if (!menuButton || !navigation) return;

  navigation.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  menuButton.querySelector('span').textContent = open ? '×' : '☰';
}

menuButton?.addEventListener('click', () => {
  setMobileMenu(!isMobileMenuOpen());
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMobileMenu(false));
});

document.addEventListener('click', (event) => {
  if (!isMobileMenuOpen()) return;
  if (navigation?.contains(event.target) || menuButton?.contains(event.target)) return;
  setMobileMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isMobileMenuOpen()) {
    setMobileMenu(false);
    menuButton?.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) setMobileMenu(false);
});

function setStatus(message) {
  if (statusElement) statusElement.textContent = message;
}

function isAppleMobileDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function buildSmsUrl(message = SMS_MESSAGE) {
  const separator = isAppleMobileDevice() ? '&' : '?';
  return `sms:${PHONE_NUMBER}${separator}body=${encodeURIComponent(message)}`;
}

document.querySelectorAll('[data-sms]').forEach((link) => {
  link.setAttribute('href', buildSmsUrl());
  link.addEventListener('click', () => {
    setStatus('Ouverture de l’application Messages avec le numéro YVEXOR et le message préremplis…');
  });
});

function escapeVCardText(value) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function buildVCard() {
  const note = 'Contact uniquement par SMS. YVEXOR conçoit des systèmes automatisés sur mesure : IA privée, agents de veille, applications, domotique, caisses tactiles, systèmes de paiement et automatisations métier.';

  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:YVEXOR;;;;',
    'FN:YVEXOR',
    'ORG:YVEXOR',
    'TITLE:' + escapeVCardText('Automatisation, IA, applications, domotique et caisses tactiles'),
    'TEL;TYPE=CELL,VOICE,MSG:' + PHONE_NUMBER,
    'URL:' + WEBSITE_URL,
    'NOTE:' + escapeVCardText(note),
    'END:VCARD'
  ].join('\r\n') + '\r\n';
}

document.getElementById('add-contact')?.addEventListener('click', () => {
  const blob = new Blob([buildVCard()], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'YVEXOR-contact.vcf';
  link.setAttribute('aria-label', 'Télécharger la fiche contact YVEXOR');
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  setStatus('La fiche contact YVEXOR est prête. Ouvrez-la puis choisissez « Ajouter aux contacts » ou « Enregistrer ».');
});

/* Clin d’œil conservé de l’ancien site, avec un effet volontairement léger. */
const chaosButton = document.getElementById('chaos-button');
let chaosTimer;

chaosButton?.addEventListener('click', () => {
  const active = document.body.classList.toggle('chaos-mode');
  window.clearTimeout(chaosTimer);
  chaosButton.textContent = active ? 'Reconstruire le site ⚡' : 'Détruire le site 😂';

  if (active) {
    chaosTimer = window.setTimeout(() => {
      document.body.classList.remove('chaos-mode');
      chaosButton.textContent = 'Détruire le site 😂';
    }, 5000);
  }
});

/* Expérience interactive : aucune réponse n'est stockée ni transmise. */
(() => {
  const gameStage = document.getElementById('yv-game-stage');
  const playArea = document.getElementById('yv-game-play-area');
  const scene = document.getElementById('yv-game-scene');
  const core = document.getElementById('yv-game-core');
  const step = document.getElementById('yv-game-step');
  const question = document.getElementById('yv-game-question');
  const context = document.getElementById('yv-game-context');
  const answers = document.getElementById('yv-game-answers');
  const result = document.getElementById('yv-game-result');
  const resultTitle = document.getElementById('yv-game-result-title');
  const resultText = document.getElementById('yv-game-result-text');
  const scoreRing = document.getElementById('yv-game-score-ring');
  const scoreText = document.getElementById('yv-game-score-text');
  const progress = document.getElementById('yv-game-progress');
  const progressBar = document.getElementById('yv-game-progress-bar');
  const restartButton = document.getElementById('yv-game-restart');
  const smsButton = document.getElementById('yv-game-sms');

  if (!gameStage || !playArea || !answers || !result) return;

  const gameSmsMessage = [
    'Bonjour YVEXOR,',
    '',
    'Je viens de terminer l’expérience interactive sur votre site.',
    '',
    'Mon activité :',
    'Mon besoin ou mon idée :',
    'La tâche que je souhaite simplifier :'
  ].join('\n');

  const situations = [
    {
      mark: 'POS',
      scene: 'pos',
      question: 'Un commerce perd du temps entre la caisse, le stock et les clôtures. Quelle approche choisissez-vous ?',
      context: 'Le besoin n’est pas simplement un logiciel, mais un outil adapté au fonctionnement réel du magasin.',
      answers: [
        ['Installer immédiatement un logiciel standard', 0],
        ['Observer le terrain puis construire une interface sur mesure', 1],
        ['Ajouter de nouveaux fichiers de suivi manuels', 0]
      ]
    },
    {
      mark: 'IA',
      scene: 'ai',
      question: 'Une équipe reçoit trop d’e-mails et répète les mêmes tâches chaque jour. Quelle solution retenez-vous ?',
      context: 'L’automatisation devient utile lorsqu’elle suit les règles de l’entreprise et conserve une validation humaine.',
      answers: [
        ['Créer une IA métier avec des règles, des sources et un contrôle', 1],
        ['Laisser une IA répondre seule à toutes les demandes', 0],
        ['Continuer manuellement sans mesurer le temps perdu', 0]
      ]
    },
    {
      mark: 'DOM',
      scene: 'building',
      question: 'Un bâtiment consomme trop et ses équipements fonctionnent séparément. Quelle est la bonne approche ?',
      context: 'Une domotique efficace relie les usages, les horaires, les accès et la consommation dans un scénario cohérent.',
      answers: [
        ['Tout remplacer avant d’étudier les usages', 0],
        ['Connecter progressivement les équipements réellement utiles', 1],
        ['Ajouter uniquement des objets connectés décoratifs', 0]
      ]
    }
  ];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let situationIndex = 0;
  let gameScore = 0;
  let gameLocked = false;

  function updateProgress(value) {
    progress?.setAttribute('aria-valuenow', String(value));
    if (progressBar) progressBar.style.width = `${(value / situations.length) * 100}%`;
  }

  function renderSituation() {
    const item = situations[situationIndex];
    gameLocked = false;
    step.textContent = `Situation ${situationIndex + 1} sur ${situations.length}`;
    question.textContent = item.question;
    context.textContent = item.context;
    core.textContent = item.mark;
    scene.dataset.scene = item.scene;
    answers.replaceChildren();

    item.answers.forEach(([label, value], answerIndex) => {
      const button = document.createElement('button');
      const mark = document.createElement('span');
      const labelText = document.createElement('span');

      button.type = 'button';
      button.className = 'yv-game-answer';
      mark.className = 'yv-game-answer-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = String.fromCharCode(65 + answerIndex);
      labelText.textContent = label;
      button.append(mark, labelText);
      button.addEventListener('click', (event) => chooseAnswer(value, event));
      answers.appendChild(button);
    });
  }

  function createSparks(event) {
    if (reduceMotion) return;
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const stageRect = gameStage.getBoundingClientRect();

    for (let i = 0; i < 8; i += 1) {
      const spark = document.createElement('i');
      spark.className = 'yv-game-spark';
      spark.style.left = `${buttonRect.left - stageRect.left + buttonRect.width / 2}px`;
      spark.style.top = `${buttonRect.top - stageRect.top + buttonRect.height / 2}px`;
      spark.style.setProperty('--yv-game-x', `${(Math.random() - 0.5) * 150}px`);
      spark.style.setProperty('--yv-game-y', `${(Math.random() - 0.5) * 110}px`);
      gameStage.appendChild(spark);
      window.setTimeout(() => spark.remove(), 700);
    }
  }

  function chooseAnswer(value, event) {
    if (gameLocked) return;
    gameLocked = true;
    gameScore += value;
    answers.querySelectorAll('button').forEach((button) => { button.disabled = true; });
    createSparks(event);
    core.classList.add('is-active');
    situationIndex += 1;
    updateProgress(situationIndex);

    window.setTimeout(() => {
      core.classList.remove('is-active');
      if (situationIndex < situations.length) renderSituation();
      else showResult();
    }, reduceMotion ? 0 : 360);
  }

  function showResult() {
    const percentage = Math.round((gameScore / situations.length) * 100);
    let title;
    let text;

    if (gameScore === 3) {
      title = 'Vous pensez déjà comme YVEXOR.';
      text = 'Vous partez du terrain, choisissez les bons outils et construisez une solution utile. C’est exactement notre méthode : comprendre, prototyper, tester et déployer.';
    } else if (gameScore === 2) {
      title = 'Votre projet mérite une solution sur mesure.';
      text = 'Vous avez identifié l’essentiel. YVEXOR peut transformer votre idée en un système simple, professionnel et adapté à votre activité.';
    } else {
      title = 'Bonne nouvelle : tout peut être simplifié.';
      text = 'Le rôle de YVEXOR est de rendre la technologie accessible, sans jargon inutile et sans imposer une solution déconnectée du terrain.';
    }

    playArea.hidden = true;
    result.hidden = false;
    scoreRing.style.setProperty('--yv-game-score', `${percentage}%`);
    scoreText.textContent = `${gameScore}/${situations.length}`;
    resultTitle.textContent = title;
    resultText.textContent = text;
    resultTitle.setAttribute('tabindex', '-1');
    resultTitle.focus();
  }

  function restartGame() {
    situationIndex = 0;
    gameScore = 0;
    gameLocked = false;
    result.hidden = true;
    playArea.hidden = false;
    scoreRing.style.setProperty('--yv-game-score', '0%');
    updateProgress(0);
    renderSituation();
    step.focus?.();
  }

  smsButton?.setAttribute('href', buildSmsUrl(gameSmsMessage));
  restartButton?.addEventListener('click', restartGame);
  renderSituation();
})();
