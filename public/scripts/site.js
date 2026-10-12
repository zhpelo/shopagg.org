window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

window.toggleMobileMenu = function toggleMobileMenu() {
  const panel = document.getElementById('mobilePanel');
  const button = document.querySelector('.mobile-menu-btn');
  if (!panel) return;
  const open = panel.classList.toggle('open');
  button?.setAttribute('aria-expanded', String(open));
};

document.querySelectorAll('#mobilePanel a').forEach((link) => {
  link.addEventListener('click', () => {
    document.getElementById('mobilePanel')?.classList.remove('open');
    document.querySelector('.mobile-menu-btn')?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (event) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
