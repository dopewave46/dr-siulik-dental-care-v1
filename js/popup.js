/* ===================== QUICK ACTIONS (Call / WhatsApp) ===================== */
(function () {
  const qa = document.querySelector('.quick-actions');
  if (!qa) return;
  const toggle = qa.querySelector('.qa-toggle');
  toggle?.addEventListener('click', () => {
    qa.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', qa.classList.contains('is-open') ? 'true' : 'false');
  });
  document.addEventListener('click', (e) => {
    if (qa.classList.contains('is-open') && !qa.contains(e.target)) {
      qa.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      qa.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ===================== LEAD CAPTURE POPUP (demo) ===================== */
(function () {
  const popup = document.querySelector('.lead-popup');
  if (!popup) return;
  if (document.body.hasAttribute('data-no-popup')) return;

  const closeBtn = popup.querySelector('.lead-close');
  const form = popup.querySelector('form');
  const note = popup.querySelector('.lead-note');
  let lastFocused = null;

  function openPopup() {
    lastFocused = document.activeElement;
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    closeBtn?.focus();
    document.addEventListener('keydown', onKeydown);
    try { sessionStorage.setItem('leadPopupShown', '1'); } catch (e) {}
  }

  function closePopup() {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closePopup();
  }

  closeBtn?.addEventListener('click', closePopup);
  popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (note) {
      note.textContent = 'Demo mode — this request was not sent. A real site would call you back shortly.';
    }
    setTimeout(closePopup, 1600);
  });

  let alreadyShown = false;
  try { alreadyShown = sessionStorage.getItem('leadPopupShown') === '1'; } catch (e) {}
  if (!alreadyShown) {
    setTimeout(openPopup, 5000);
  }
})();
