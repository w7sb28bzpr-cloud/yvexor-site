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
const platform = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ? 'ios' : /Android/.test(navigator.userAgent) ? 'android' : 'desktop';
document.querySelectorAll('[data-platform]').forEach(guide => { guide.open = guide.dataset.platform === platform; });
document.querySelectorAll('[data-password-toggle]').forEach(button => {
  const input = document.getElementById(button.dataset.passwordToggle);
  if (!input) return;
  button.hidden = false;
  button.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    button.textContent = show ? 'Masquer le mot de passe' : 'Afficher le mot de passe';
    button.setAttribute('aria-pressed', String(show));
  });
});
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
const addLine = document.getElementById('add-quote-item');
if (addLine) addLine.addEventListener('click', () => {
  const total = document.getElementById('id_items-TOTAL_FORMS');
  const index = Number(total.value);
  if (index >= 30) return;
  const clone = document.getElementById('quote-item-template').content.cloneNode(true);
  clone.querySelectorAll('*').forEach(element => {
    for (const attr of ['name', 'id', 'for']) {
      if (element.hasAttribute(attr)) element.setAttribute(attr, element.getAttribute(attr).replaceAll('__prefix__', String(index)));
    }
  });
  document.getElementById('quote-items').appendChild(clone);
  total.value = String(index + 1);
  addLine.disabled = index + 1 >= 30;
});
async function refreshMessages() {
  if (document.hidden || app.hidden) return;
  try {
    const badge = document.getElementById('notification-count');
    if (badge) {
      const response = await fetch('/api/summary/', {headers:{Accept:'application/json'}});
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const counts=await response.json(); badge.textContent=String(counts.unread); badge.hidden=!counts.unread;
        document.querySelectorAll('[data-chat-count]').forEach(el=>{el.textContent=String(counts.chat_unread||0);el.hidden=!counts.chat_unread;});
      }
    }
    const thread = document.querySelector('[data-thread-url]');
    if (!thread) return;
    const response = await fetch(thread.dataset.threadUrl, {headers:{Accept:'application/json'}});
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) return;
    const data = await response.json();
    if (!data.messages.length) return;
    const signature = JSON.stringify(data.messages);
    if (thread.dataset.signature !== signature) {
      const fragment = document.createDocumentFragment();
      for (const message of data.messages) {
        const row = document.createElement('article'); row.className = 'bubble' + (message.mine ? ' mine' : '');
        const author = document.createElement('strong'); author.textContent = message.author;
        const body = document.createElement('div'); body.className = 'message-body'; body.textContent = message.body;
        const date = document.createElement('small'); date.textContent = message.date + ' · ' + (message.read ? 'Lu' : 'Envoyé');
        row.append(author, body, date); fragment.appendChild(row);
      }
      thread.replaceChildren(fragment); thread.dataset.signature = signature;
    }
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (csrf) await fetch(thread.dataset.readUrl, {method:'POST', headers:{'X-CSRFToken':csrf}});
  } catch { /* A temporary connection failure must preserve the visible conversation. */ }
}
setInterval(refreshMessages, 15000);
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
    for(const field of ['category','budget','timeline']){const selected=wizard.querySelector(`input[name="${field}"]:checked`);if(selected){const p=document.createElement('p');p.textContent=selected.closest('label').textContent.trim();target.appendChild(p);}}
    document.getElementById('request-fields').hidden=true;
    document.getElementById('step-idea').removeAttribute('aria-current');document.getElementById('step-review').setAttribute('aria-current','step');
    review.hidden = false; submit.hidden = false; reviewButton.hidden = true;
    review.scrollIntoView({behavior: 'smooth', block: 'center'});
  });
  document.getElementById('edit-request').addEventListener('click', () => {
    document.getElementById('request-fields').hidden=false;
    document.getElementById('step-review').removeAttribute('aria-current');document.getElementById('step-idea').setAttribute('aria-current','step');
    review.hidden = true; submit.hidden = true; reviewButton.hidden = false;
    wizard.elements.title.focus();
  });
  wizard.addEventListener('input', () => { review.hidden = true; submit.hidden = true; reviewButton.hidden = false; });
}
