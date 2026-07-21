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

function buildSmsUrl() {
  const separator = isAppleMobileDevice() ? '&' : '?';
  return `sms:${PHONE_NUMBER}${separator}body=${encodeURIComponent(SMS_MESSAGE)}`;
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
