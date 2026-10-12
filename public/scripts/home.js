const installCommand = 'git clone https://github.com/zhpelo/shopagg-b2b-website.git';

window.copyInstallCommand = async function copyInstallCommand() {
  const button = document.querySelector('.install-command button');
  if (!button) return;

  try {
    await navigator.clipboard.writeText(installCommand);
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.classList.add('copied');
  } catch (error) {
    button.innerHTML = '<i class="fas fa-triangle-exclamation"></i>';
    button.title = '复制失败，请手动复制命令';
  }

  window.setTimeout(() => {
    button.innerHTML = '<i class="far fa-copy"></i>';
    button.classList.remove('copied');
    button.removeAttribute('title');
  }, 1800);
};
