/* ===================== ANIMATIONS ===================== */
(function () {
  // Scroll reveal
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length && !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else if (reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-reveal-delay');
            if (delay) entry.target.style.transitionDelay = delay + 'ms';
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      item.closest('.faq-list')?.querySelectorAll('.faq-item.is-open').forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      if (isOpen) {
        item.classList.remove('is-open');
        a.style.maxHeight = null;
        q.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Horizontal strip arrow scroll
  document.querySelectorAll('[data-scroll-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.getAttribute('data-scroll-target'));
      if (target) target.scrollBy({ left: btn.dataset.dir === 'prev' ? -280 : 280, behavior: 'smooth' });
    });
  });
})();
