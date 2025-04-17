// Utilidades
function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  
  function parseAccountFromPath() {
    const raw = new URL(window.location).pathname;
    const clean = raw.replace(/^\/@?/, '').replace(/\/$/, '');
    return clean || 'aliento';
  }
  
  function showError(msg) {
    document.getElementById('info').innerText = msg;
    document.getElementById('btn-votar').style.display = 'none';
  }
  
  // Lógica principal
  async function fetchWitness(account) {
    return new Promise((resolve, reject) => {
      hive.api.getWitnessByAccount(account, (err, result) => {
        if (err || !result) reject(err || new Error('No encontrado'));
        else resolve(result);
      });
    });
  }
  
  function renderTitle(account) {
    document.getElementById('titulo').innerText = `Testigo: ${escapeHtml(account)}`;
  }
  
  function renderInfo(wiz) {
    const infoEl = document.getElementById('info');
    const url = (() => {
      try {
        const u = new URL(wiz.url);
        return (u.protocol === 'http:' || u.protocol === 'https:') ? wiz.url : '#';
      } catch {
        return '#';
      }
    })();
  
    infoEl.innerHTML = `
      <p>URL: ${url === '#' 
        ? 'URL no válida' 
        : `<a href="${escapeHtml(url)}" target="_blank">${escapeHtml(wiz.url)}</a>`}
      </p>
      <p>Autoridad: ${escapeHtml(wiz.signing_key)}</p>
      <p>Votos: ${escapeHtml(wiz.votes)}</p>
    `;
  }
  
  function setupVoteButton(account) {
    const btn = document.getElementById('btn-votar');
    btn.style.display = 'inline-block';
    btn.disabled = false;
  
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      if (!window.hive_keychain?.requestVote) {
        alert('Instala Hive Keychain');
        btn.disabled = false;
        return;
      }
      try {
        const resp = await new Promise((res, rej) => {
          window.hive_keychain.requestVote(account, true, res);
        });
        const userLang = navigator.language.startsWith('es') ? 'es' : 'en';
        const msg = resp.success
          ? { es: '¡Votaste con éxito!', en: 'You voted successfully!' }
          : { es: 'Error al votar.', en: 'Error while voting.' };
        alert(msg[userLang]);
      } catch {
        alert('Error al votar.');
      } finally {
        btn.disabled = false;
      }
    });
  }
  
  // Inicialización
  (async function init() {
    const account = parseAccountFromPath();
    renderTitle(account);
  
    if (!hive?.api) {
      return showError('Hive API no está disponible.');
    }
  
    try {
      const wiz = await fetchWitness(account);
      renderInfo(wiz);
      setupVoteButton(account);
    } catch {
      showError('Error al cargar los datos del testigo.');
    }
  })();
  