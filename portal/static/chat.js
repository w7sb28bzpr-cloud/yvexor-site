(() => {
 const shell=document.querySelector('[data-chat]'); if(!shell)return;
 const timeline=document.getElementById('chat-timeline'), list=document.getElementById('chat-messages'), form=document.getElementById('chat-form'), input=form.elements.body, status=document.getElementById('chat-status'), send=form.querySelector('[type=submit]'), older=document.getElementById('chat-older');
 let last=Number(shell.dataset.last), first=Number(shell.dataset.first), busy=false, polling=false, retryDelay=3000, timer;
 const seen=new Set([...list.querySelectorAll('[data-message-id]')].map(el=>Number(el.dataset.messageId)));
 const csrf=()=>form.elements.csrfmiddlewaretoken.value;
 const nearBottom=()=>timeline.scrollHeight-timeline.scrollTop-timeline.clientHeight<100;
 function add(row, prepend=false){
  if(seen.has(row.id))return;
  const bubble=document.createElement('article');bubble.className='chat-bubble'+(row.mine?' mine':'');bubble.dataset.messageId=row.id;
  const body=document.createElement('div');body.className='chat-body';body.textContent=row.body;
  const meta=document.createElement('small'), time=document.createElement('time');time.textContent=row.date;meta.append(time);
  if(row.mine){const receipt=document.createElement('span');receipt.className='chat-receipt';receipt.textContent=row.read?' · Lu':' · Envoyé';meta.append(receipt);}
  bubble.append(body,meta);prepend?list.prepend(bubble):list.append(bubble);seen.add(row.id);
  first=first?Math.min(first,row.id):row.id;last=Math.max(last,row.id);document.getElementById('chat-empty').hidden=true;
 }
 async function read(){
  if(document.hidden||!nearBottom()||!last)return;
  try{await fetch(shell.dataset.read,{method:'POST',headers:{'X-CSRFToken':csrf()},body:new URLSearchParams({through:last})});}catch{}
 }
 async function sync(){
  if(polling||document.hidden||document.getElementById('application').hidden)return;
  polling=true;
  try{
   const response=await fetch(shell.dataset.updates+'?after='+last,{headers:{Accept:'application/json'},cache:'no-store'});
   if(!response.ok||!response.headers.get('content-type')?.includes('application/json'))throw Error('session');
   const data=await response.json(), stick=nearBottom();data.messages.forEach(row=>add(row));
   list.querySelectorAll('.mine').forEach(el=>{if(Number(el.dataset.messageId)<=data.last_read)el.querySelector('.chat-receipt').textContent=' · Lu';});
   if(stick)timeline.scrollTop=timeline.scrollHeight;
   await read();retryDelay=data.has_more?100:3000;
   if(status.dataset.connectionError){status.textContent='Connexion rétablie.';delete status.dataset.connectionError;}
  }catch{status.textContent='Connexion interrompue. Votre texte est conservé. Si nécessaire, reconnectez-vous.';status.dataset.connectionError='1';retryDelay=10000;}
  finally{polling=false;}
 }
 async function tick(){await sync();timer=setTimeout(tick,retryDelay);}
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy||!form.reportValidity()||!input.value.trim())return;
  busy=true;send.disabled=true;input.readOnly=true;status.textContent='Envoi…';
  try{
   const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json','X-CSRFToken':csrf()}});
   if(!response.headers.get('content-type')?.includes('application/json'))throw Error('Session expirée. Reconnectez-vous pour envoyer votre message.');
   const data=await response.json();if(!response.ok)throw Error(data.error||'Envoi impossible. Réessayez.');
   // Synchronize in order: never skip messages received while our POST was in flight.
   input.value='';input.style.height='';form.elements.client_nonce.value=data.nonce;status.textContent='Envoyé';
   await sync();timeline.scrollTop=timeline.scrollHeight;await read();
  }catch(error){status.textContent=error.message||'Envoi impossible. Votre texte est conservé, réessayez.';}
  finally{busy=false;send.disabled=false;input.readOnly=false;input.focus({preventScroll:true});}
 });
 input.addEventListener('input',()=>{const stick=nearBottom();input.style.height='auto';input.style.height=Math.min(input.scrollHeight,130)+'px';if(stick)timeline.scrollTop=timeline.scrollHeight;});
 older.addEventListener('click',async()=>{older.disabled=true;const height=timeline.scrollHeight;
  try{const response=await fetch(shell.dataset.updates+'?before='+first,{headers:{Accept:'application/json'}});if(!response.ok)throw Error();const data=await response.json();[...data.messages].reverse().forEach(row=>add(row,true));older.hidden=!data.has_more;timeline.scrollTop+=timeline.scrollHeight-height;}catch{status.textContent='Impossible de charger les anciens messages. Réessayez.';}finally{older.disabled=false;}
 });
 timeline.addEventListener('scroll',()=>{if(nearBottom())read();},{passive:true});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){clearTimeout(timer);tick();}});
 let followLatest=true;
 timeline.addEventListener('scroll',()=>{followLatest=nearBottom();},{passive:true});
 // Resize the timeline, never the document or the contact header. Preserve a
 // reader's position in history; bring the latest replies into view when typing.
 const observer=new ResizeObserver(()=>{if(followLatest||document.activeElement===input)timeline.scrollTop=timeline.scrollHeight;});
 observer.observe(timeline);
 window.addEventListener('portal:viewport',()=>{if(document.activeElement===input)timeline.scrollTop=timeline.scrollHeight;});
 timeline.scrollTop=timeline.scrollHeight;tick();
})();
