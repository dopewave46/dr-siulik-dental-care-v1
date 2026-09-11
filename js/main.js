/* ===================== MAIN ===================== */
(function () {
  const yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach((el) => (el.textContent = new Date().getFullYear()));

  // Demo form submissions — nothing is sent anywhere
  document.querySelectorAll('form[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('[data-form-note]');
      if (note) {
        note.textContent = 'Demo mode — this form is not connected yet. No information was sent.';
        note.classList.add('is-visible');
      } else {
        alert('Demo mode — this form is not connected yet. No information was sent.');
      }
      form.reset();
    });
  });

  // Testimonial / strip arrow controls already handled via data-scroll-target in animations.js
})();
