
// Fetch and display witness list
async function fetchWitnesses() {
  try {
    const response = await fetch('https://api.hive.blog', {
      method: 'POST',
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "condenser_api.get_witnesses_by_vote",
        "params": ["", 100],
        "id": 1
      })
    });
    
    const data = await response.json();
    const witnesses = data.result;
    const vestsToHP = vests => {
      const totalVests = parseFloat(vests) / 1e6;
      return (totalVests * 0.49).toFixed(0);
    };
    
    const witnessList = document.getElementById('lista-testigos');
    witnessList.innerHTML = witnesses.map((witness, index) => `
      <li class="witness-item">
        <h3>${witness.owner}</h3>
        <p>Rank: #${index + 1}</p>
        <p>Votes: ${vestsToHP(witness.votes)} HP</p>
        <p>Version: ${witness.running_version}</p>
        <p>Price Feed: $${parseFloat(witness.hbd_exchange_rate.base).toFixed(3)}</p>
        <p>Missed Blocks: ${witness.total_missed}</p>
        <p>Last Block: ${witness.last_confirmed_block_num}</p>
        <p>Location: ${witness.url.includes('location') ? witness.url.split('location:')[1].split(',')[0] : 'No especificada'}</p>
      </li>
    `).join('');
  } catch (error) {
    console.error('Error fetching witnesses:', error);
  }
}

// Loading state for vote button
function setVoteLoading(loading) {
  const button = document.getElementById('btn-votar');
  if (loading) {
    button.disabled = true;
    button.textContent = 'Voting...';
  } else {
    button.disabled = false;
    button.textContent = '🔑 Vote with Keychain';
  }
}

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
// Initialize witness list on load
document.addEventListener('DOMContentLoaded', fetchWitnesses);

document.getElementById('btn-votar').addEventListener('click', async () => {
  setVoteLoading(true);
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
    await fetchWitnesses(); // Refresh witness list
  } catch (error) {
    alert('Error al votar: ' + error.message);
    console.error({ error });
  } finally {
    setVoteLoading(false);
  }
});
