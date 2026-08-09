/* ===================== BOOKING STEPPER (DEMO ONLY) ===================== */
(function () {
  const wrap = document.querySelector('.booking');
  if (!wrap) return;

  const steps = Array.from(wrap.querySelectorAll('.step-panel'));
  const pills = Array.from(wrap.querySelectorAll('.step-pill'));
  const nextBtns = wrap.querySelectorAll('[data-step-next]');
  const prevBtns = wrap.querySelectorAll('[data-step-prev]');
  const treatmentCards = wrap.querySelectorAll('.pick-card[data-treatment]');
  const dateCards = wrap.querySelectorAll('.pick-card[data-date]');
  const timeCards = wrap.querySelectorAll('.pick-card[data-time]');

  let current = 0;
  const state = { treatment: '', date: '', time: '', name: '', phone: '', email: '', message: '' };

  function goTo(index) {
    steps[current].classList.remove('is-active');
    pills[current].classList.remove('is-active');
    pills[current].classList.add('is-done');
    current = index;
    steps[current].classList.add('is-active');
    pills.forEach((p, i) => {
      p.classList.toggle('is-active', i === current);
      p.classList.toggle('is-done', i < current);
    });
    wrap.querySelector('.booking-panels').scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (current === steps.length - 2) fillReview();
  }

  function selectCard(group, card, key) {
    group.forEach((c) => c.classList.remove('is-selected'));
    card.classList.add('is-selected');
    state[key] = card.dataset[key] || card.textContent.trim();
  }

  treatmentCards.forEach((c) => c.addEventListener('click', () => selectCard(treatmentCards, c, 'treatment')));
  dateCards.forEach((c) => c.addEventListener('click', () => selectCard(dateCards, c, 'date')));
  timeCards.forEach((c) => c.addEventListener('click', () => selectCard(timeCards, c, 'time')));

  nextBtns.forEach((btn) =>
    btn.addEventListener('click', () => {
      if (current === 3) {
        const form = wrap.querySelector('.patient-form');
        if (form && !form.reportValidity()) return;
        state.name = wrap.querySelector('#pf-name')?.value || '';
        state.phone = wrap.querySelector('#pf-phone')?.value || '';
        state.email = wrap.querySelector('#pf-email')?.value || '';
        state.message = wrap.querySelector('#pf-message')?.value || '';
      }
      if (current < steps.length - 1) goTo(current + 1);
    })
  );
  prevBtns.forEach((btn) => btn.addEventListener('click', () => { if (current > 0) goTo(current - 1); }));

  function fillReview() {
    const map = {
      '[data-review="treatment"]': state.treatment || 'Not selected',
      '[data-review="date"]': state.date || 'Not selected',
      '[data-review="time"]': state.time || 'Not selected',
      '[data-review="name"]': state.name || '—',
      '[data-review="phone"]': state.phone || '—',
      '[data-review="email"]': state.email || '—',
      '[data-review="message"]': state.message || '—',
    };
    Object.entries(map).forEach(([sel, val]) => {
      const el = wrap.querySelector(sel);
      if (el) el.textContent = val;
    });
  }

  const confirmBtn = wrap.querySelector('[data-confirm-booking]');
  confirmBtn?.addEventListener('click', () => {
    try {
      sessionStorage.setItem('demoBooking', JSON.stringify(state));
    } catch (e) {}
    window.location.href = 'appointment-confirmation.html';
  });

  goTo(0);
})();

/* Fill confirmation page from sessionStorage, demo only */
(function () {
  const target = document.querySelector('[data-confirmation]');
  if (!target) return;
  let data = {};
  try {
    data = JSON.parse(sessionStorage.getItem('demoBooking') || '{}');
  } catch (e) {}
  const map = {
    '[data-c="treatment"]': data.treatment || 'General Consultation',
    '[data-c="date"]': data.date || 'To be confirmed',
    '[data-c="time"]': data.time || 'To be confirmed',
    '[data-c="name"]': data.name || 'Guest Patient',
  };
  Object.entries(map).forEach(([sel, val]) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = val;
  });
})();
