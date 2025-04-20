
// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const theme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', theme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// Vote functionality
document.getElementById('btn-votar').addEventListener('click', async () => {
  const username = document.getElementById('usuario').value.trim();
  
  if (!username) {
    alert('Por favor ingrese un nombre de usuario');
    return;
  }

  try {
    const keychain = new KeychainSDK(window);
    
    const voteData = {
      username: username,
      witness: 'aliento',
      vote: true
    };
    
    const witnessvote = await keychain.witnessVote(voteData);
    alert('¡Voto exitoso!');
    console.log({ witnessvote });
  } catch (error) {
    alert('Error al votar: ' + error.message);
    console.error({ error });
  }
});
