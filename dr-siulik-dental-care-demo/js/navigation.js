/* ===================== NAVIGATION ===================== */
(function () {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.mobile-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

  // sticky navbar shadow
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (!toggle || !mobileMenu) return;

  let lastFocused = null;

  function openMenu() {
    lastFocused = document.activeElement;
    mobileMenu.classList.add('is-open');
    document.body.classList.add('no-scroll');
    toggle.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    const firstLink = mobileMenu.querySelector('a');
    if (firstLink) setTimeout(() => firstLink.focus(), 150);
    document.addEventListener('keydown', onKeydown);
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      closeMenu();
      return;
    }
    // focus trap
    if (e.key === 'Tab') {
      const focusables = mobileMenu.querySelectorAll('a, button');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  toggle.addEventListener('click', () => {
    mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  closeBtn?.addEventListener('click', closeMenu);

  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });

  mobileLinks.forEach((a) => a.addEventListener('click', closeMenu));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1080) closeMenu();
  });
})();
