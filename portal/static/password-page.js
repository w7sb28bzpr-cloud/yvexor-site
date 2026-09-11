(() => {
  const input=document.getElementById('id_new_password1');if(!input)return;
  function update() {
    // Guidance only; common-password/similarity checks remain on the server.
    const valid={length:[...input.value].length>=12,numeric:input.value.length>0 && !/^\p{Number}+$/u.test(input.value)};
    document.querySelectorAll('[data-password-rule]').forEach(row=>{
      const state=String(valid[row.dataset.passwordRule]);
      if(row.dataset.valid===state)return;
      row.dataset.valid=state;
      row.firstElementChild.textContent=state==='true'?'✓':'○';
      row.querySelector('[data-rule-state]').textContent=state==='true'?'Respecté : ':'À respecter : ';
    });
  }
  input.addEventListener('input',update);input.addEventListener('change',update);update();
})();
