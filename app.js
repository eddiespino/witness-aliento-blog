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

try
  {
    const keychain = new KeychainSDK(window);
    
    const formParamsAsObject = {
     "data": {
          "username": "eddiespino",
          "witness": "aliento",
          "vote": true
     }
}
    
    const witnessvote = await keychain
         .witnessVote(
              formParamsAsObject.data);
    console.log({ witnessvote });
  } catch (error) {
    console.log({ error });
  }
