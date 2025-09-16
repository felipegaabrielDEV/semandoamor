// --- Menu mobile (abre/fecha) ---
document.addEventListener('click', (ev) => {
  // Verifica se o clique foi em um botão com atributo [data-menu]
  const btn = ev.target.closest('[data-menu]');
  if (btn) {
    // Alterna a classe "open" no menu (abre/fecha)
    document.querySelector('nav ul').classList.toggle('open');
    return;
  }

  // Se o clique foi em um link <a> dentro do nav → fecha o menu
  if (ev.target.closest('nav a')) {
    document.querySelector('nav ul').classList.remove('open');
  }
});

// Fecha o menu ao apertar a tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelector('nav ul').classList.remove('open');
  }
});

// --- Destacar página ativa no menu ---
(function () {
  // Pega o nome do arquivo da URL atual (ex: index.html, sobre.html)
  const p = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // Percorre todos os links do menu
  document.querySelectorAll('nav a').forEach(a => {
    const h = a.getAttribute('href').toLowerCase();

    // Se o href do link for igual ao arquivo atual → marca como página atual
    if (h === p) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();

// --- Botão "Voltar ao topo" ---
(function () {
  const b = document.getElementById('backtop');
  if (!b) return; // se não existir botão, não faz nada

  // Exibe ou oculta o botão dependendo da rolagem da página
  window.addEventListener('scroll', () => {
    b.classList.toggle('show', window.scrollY > 340);
  });

  // Quando clicado, rola suavemente até o topo
  b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// --- Função copiar PIX ---
window.copiarPix = (btn) => {
  // Copia o número do PIX para a área de transferência
  navigator.clipboard.writeText('55168291000113').then(() => {
    if (btn) {
      // Troca o texto do botão para "Copiado" e adiciona classe temporária
      btn.textContent = 'Copiado';
      btn.classList.add('copied');

      // Depois de 1,6s volta para "Copiar"
      setTimeout(() => {
        btn.textContent = 'Copiar';
        btn.classList.remove('copied');
      }, 1600);
    }
  });
};

// --- Fallback local (salva submissões no localStorage quando fora do Netlify) ---
(() => {
  const form = document.getElementById('contatoForm');
  if (!form) return;

  form.addEventListener('submit', () => {
    // Descobre se o site está rodando no Netlify
    const host = (location.hostname || '').toLowerCase();
    const isNetlify = host.includes('netlify.app') || host.includes('netlify');
    if (isNetlify) return; // se for Netlify → não salva local

    try {
      // Monta objeto com dados do formulário
      const payload = {
        nome: form.nome?.value || '',
        email: form['_replyto']?.value || form.email?.value || '',
        mensagem: form.mensagem?.value || '',
        consent: form.consent?.checked ? 'sim' : 'não',
        ts: new Date().toISOString() // timestamp
      };

      // Recupera dados já salvos, adiciona novo e grava de volta
      const key = 'sa_submissoes';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push(payload);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) { /* ignora erros */ }
  });
})();

// --- Intercepta envio em ambiente local (ex: Live Server) ---
(() => {
  const form = document.getElementById('contatoForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const host = (location.hostname || '').toLowerCase();
    const isNetlify = host.includes('netlify.app') || host.includes('netlify');
    const isLocal = host.includes('127.0.0.1') || host.includes('localhost');

    if (isNetlify) return; // Se for Netlify, deixa o envio normal

    // Se for ambiente local → salva no localStorage e redireciona manualmente
    if (isLocal || host === '') {
      e.preventDefault(); // impede o envio real do POST

      try {
        // Cria o payload novamente
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

      // Redireciona para a página de sucesso
      window.location.href = 'sucesso.html';
    }
  });
})();
