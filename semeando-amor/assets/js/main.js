// =========================
// MENU MOBILE
// =========================
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-menu]'); // Verifica se clicou no botão do menu
  if (btn) {
    document.querySelector('nav ul').classList.toggle('open'); // Abre/fecha o menu adicionando/removendo a classe .open
    return;
  }
  if (ev.target.closest('nav a')) {
    document.querySelector('nav ul').classList.remove('open'); // Se clicou em um link do menu, fecha o menu
  }
});

// =========================
// FECHAR MENU COM ESC
// =========================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelector('nav ul').classList.remove('open'); // Fecha o menu ao apertar a tecla ESC
  }
});

// =========================
// DESTACAR LINK ATUAL NO MENU
// =========================
(function () {
  const p = (location.pathname.split('/').pop() || 'index.html').toLowerCase(); // Pega o nome da página atual (ex: index.html)
  document.querySelectorAll('nav a').forEach(a => {
    const h = a.getAttribute('href').toLowerCase(); // Pega o href de cada link
    if (h === p) {
      a.setAttribute('aria-current', 'page'); // Marca o link da página atual
    }
  });
})();

// =========================
// BOTÃO "VOLTAR AO TOPO"
// =========================
(function () {
  const b = document.getElementById('backtop'); // Seleciona o botão
  if (!b) return; // Se não existe, sai
  window.addEventListener('scroll', () => {
    b.classList.toggle('show', window.scrollY > 340); // Mostra/esconde o botão dependendo do scroll
  });
  b.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Rola suavemente até o topo
  );
})();

// =========================
// BOTÃO COPIAR PIX
// =========================
window.copiarPix = (btn) => {
  navigator.clipboard.writeText('55168291000113').then(() => { // Copia o PIX para a área de transferência
    if (btn) {
      btn.textContent = 'Copiado'; // Muda o texto do botão
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copiar'; // Volta para "Copiar" depois de 1.6s
        btn.classList.remove('copied');
      }, 1600);
    }
  });
};

// =========================
// SALVAR SUBMISSÕES LOCALMENTE (quando não for Netlify)
// =========================
(() => {
  const form = document.getElementById('contatoForm'); // Seleciona o formulário de contato
  if (!form) return;
  form.addEventListener('submit', () => {
    const host = (location.hostname || '').toLowerCase(); // Pega o host atual
    const isNetlify = host.includes('netlify.app') || host.includes('netlify'); // Verifica se está no Netlify
    if (isNetlify) return; // Se for Netlify, não salva localmente

    try {
      // Monta o objeto com os dados do formulário
      const payload = {
        nome: form.nome?.value || '',
        email: form['_replyto']?.value || form.email?.value || '',
        mensagem: form.mensagem?.value || '',
        consent: form.consent?.checked ? 'sim' : 'não',
        ts: new Date().toISOString()
      };
      const key = 'sa_submissoes';
      const arr = JSON.parse(localStorage.getItem(key) || '[]'); // Recupera dados já salvos
      arr.push(payload); // Adiciona o novo
      localStorage.setItem(key, JSON.stringify(arr)); // Salva de volta
    } catch (e) {
      /* ignora erros */
    }
  });
})();

// =========================
// INTERCEPTAR ENVIO LOCAL (evita erro 405 do Live Server)
// =========================
(() => {
  const form = document.getElementById('contatoForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    const host = (location.hostname || '').toLowerCase();
    const isNetlify = host.includes('netlify.app') || host.includes('netlify'); // Detecta Netlify
    const isLocal = host.includes('127.0.0.1') || host.includes('localhost'); // Detecta ambiente local
    if (isNetlify) return; // No Netlify, deixa enviar normalmente

    // Ambiente local: salva no localStorage e redireciona sem tentar POST
    if (isLocal || host === '') {
      e.preventDefault(); // Bloqueia envio padrão
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
        localStorage.setItem(key, JSON.stringify(arr)); // Salva localmente
      } catch (_) { }
      window.location.href = 'sucesso.html'; // Redireciona para página de sucesso
    }
  });
})();
