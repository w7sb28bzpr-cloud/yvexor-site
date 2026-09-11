if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const gate = document.getElementById('install-gate');
const app = document.getElementById('application');
function updateGate() {
  // Installation is a UX requirement, not authorization. All data is protected on the server.
  const needsInstall = !standalone() && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';
  gate.hidden = !needsInstall;
  app.hidden = needsInstall;
}
updateGate();
window.matchMedia('(display-mode: standalone)').addEventListener('change', updateGate);
let installPrompt;
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault(); installPrompt = event;
  document.getElementById('install-button').hidden = false;
});
document.getElementById('install-button').addEventListener('click', async () => {
  if (!installPrompt) return;
  await installPrompt.prompt(); installPrompt = null;
  document.getElementById('install-button').hidden = true;
});
window.addEventListener('appinstalled', () => { document.getElementById('install-help').textContent = 'Application installée. Ouvrez maintenant YVEXOR depuis son icône.'; });
const wizard = document.getElementById('request-wizard');
if (wizard) {
  const review = document.getElementById('request-review');
  const reviewButton = document.getElementById('review-request');
  const submit = document.getElementById('submit-request');
  reviewButton.hidden = false; submit.hidden = true;
  reviewButton.addEventListener('click', () => {
    if (!wizard.reportValidity()) return;
    const target = document.getElementById('review-content'); target.replaceChildren();
    for (const field of ['title','body','details']) {
      const p = document.createElement('p'); p.textContent = wizard.elements[field].value; target.appendChild(p);
    }
    review.hidden = false; submit.hidden = false; reviewButton.hidden = true;
    review.scrollIntoView({behavior: 'smooth', block: 'center'});
  });
  document.getElementById('edit-request').addEventListener('click', () => {
    review.hidden = true; submit.hidden = true; reviewButton.hidden = false;
    wizard.elements.title.focus();
  });
  wizard.addEventListener('input', () => { review.hidden = true; submit.hidden = true; reviewButton.hidden = false; });
}
