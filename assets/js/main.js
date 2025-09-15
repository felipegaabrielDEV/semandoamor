
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-menu]');
  if (btn) { document.querySelector('nav ul').classList.toggle('open'); return; }
  if (ev.target.closest('nav a')) { document.querySelector('nav ul').classList.remove('open'); }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { document.querySelector('nav ul').classList.remove('open'); } });
(function () {
  const p = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('nav a').forEach(a => { const h = a.getAttribute('href').toLowerCase(); if (h === p) { a.setAttribute('aria-current', 'page') } })
})();
(function () { const b = document.getElementById('backtop'); if (!b) return; window.addEventListener('scroll', () => { b.classList.toggle('show', window.scrollY > 340) }); b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' })); })();
window.copiarPix = (btn) => { navigator.clipboard.writeText('55168291000113').then(() => { if (btn) { btn.textContent = 'Copiado'; btn.classList.add('copied'); setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('copied') }, 1600) } }) };

// --- Local fallback save (for dev/local): stores submissions in localStorage ---
(() => {
  const form = document.getElementById('contatoForm');
  if (!form) return;
  form.addEventListener('submit', () => {
    // only store locally when NOT on Netlify (host doesn't contain 'netlify')
    const host = (location.hostname || '').toLowerCase();
    const isNetlify = host.includes('netlify.app') || host.includes('netlify');
    if (isNetlify) return;

    try {
      const payload = {
        nome: form.nome?.value || '',
        email: form['_replyto']?.value || form.email?.value || '',
        mensagem: form.mensagem?.value || '',
        consent: form.consent?.checked ? 'sim' : 'não',
        ts: new Date().toISOString()
      };
      const key = 'sa_submissoes';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push(payload);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {/* ignore */ }
  });
})();

// --- Intercepta envio local (evita HTTP 405 do Live Server) ---
(() => {
  const form = document.getElementById('contatoForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    const host = (location.hostname || '').toLowerCase();
    const isNetlify = host.includes('netlify.app') || host.includes('netlify');
    const isLocal = host.includes('127.0.0.1') || host.includes('localhost');
    if (isNetlify) return; // deixa o Netlify receber o POST normalmente
    // Ambiente local: salva (já salvamos acima) e redireciona sem fazer POST
    if (isLocal || host === '') {
      e.preventDefault();
      try {
        const payload = {
          nome: form.nome?.value || '',
          email: form['_replyto']?.value || form.email?.value || '',
          mensagem: form.mensagem?.value || '',
          consent: form.consent?.checked ? 'sim' : 'não',
          ts: new Date().toISOString()
        };
        const key = 'sa_submissoes';
        const arr = JSON.parse(localStorage.getItem(key) || '[]');
        arr.push(payload);
        localStorage.setItem(key, JSON.stringify(arr));
      } catch (_) { }
      window.location.href = 'sucesso.html';
    }
  });
})();
