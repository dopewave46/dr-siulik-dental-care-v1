/* ===================== BOOKING STEPPER (DEMO ONLY) ===================== */
(function () {
  const wrap = document.querySelector('.booking');
  if (!wrap) return;

  const steps = Array.from(wrap.querySelectorAll('.step-panel'));
  const pills = Array.from(wrap.querySelectorAll('.step-pill'));
  const nextBtns = wrap.querySelectorAll('[data-step-next]');
  const prevBtns = wrap.querySelectorAll('[data-step-prev]');
  const treatmentCards = wrap.querySelectorAll('.pick-card[data-treatment]');
  const timeCards = wrap.querySelectorAll('.pick-card[data-time]');
  const calendarEl = document.getElementById('booking-calendar');

  let current = 0;
  const state = { treatment: '', date: '', dateISO: '', time: '', name: '', phone: '', email: '', message: '' };

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

  function selectCard(group, card, key, autoAdvance) {
    group.forEach((c) => c.classList.remove('is-selected'));
    card.classList.add('is-selected');
    state[key] = card.dataset[key] || card.textContent.trim();
    if (autoAdvance) {
      setTimeout(() => {
        if (current < steps.length - 1) goTo(current + 1);
      }, 380);
    }
  }

  treatmentCards.forEach((c) => c.addEventListener('click', () => selectCard(treatmentCards, c, 'treatment', true)));
  timeCards.forEach((c) => c.addEventListener('click', () => selectCard(timeCards, c, 'time', true)));

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

  function buildWhatsAppMessage(s) {
    const lines = [
      "Hi! I'd like to book an appointment at Dr. Siulik's Dental Care.",
      `Treatment: ${s.treatment || 'Not specified'}`,
      `Date: ${s.date || 'Not specified'}`,
      `Time: ${s.time || 'Not specified'}`,
      `Name: ${s.name || 'Not specified'}`,
      `Phone: ${s.phone || 'Not specified'}`,
    ];
    if (s.message) lines.push(`Note: ${s.message}`);
    return lines.join('\n');
  }

  const confirmBtn = wrap.querySelector('[data-confirm-booking]');
  confirmBtn?.addEventListener('click', () => {
    try {
      sessionStorage.setItem('demoBooking', JSON.stringify(state));
    } catch (e) {}
    // Client-side JS cannot silently send a WhatsApp message — this opens
    // WhatsApp with the booking details pre-filled; the patient still has
    // to tap Send there for the clinic to actually receive it.
    const waUrl = 'https://wa.me/7008675007?text=' + encodeURIComponent(buildWhatsAppMessage(state));
    window.open(waUrl, '_blank', 'noopener');
    window.location.href = 'appointment-confirmation.html';
  });

  /* ===================== CALENDAR WIDGET ===================== */
  if (calendarEl) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let viewYear = today.getFullYear();
    let viewMonth = today.getMonth();
    let selectedISO = null;

    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const WEEKDAYS = ['S','M','T','W','T','F','S'];
    const iconLeft = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';
    const iconRight = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';

    function isoDate(y, m, d) {
      return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }

    function formatDisplay(y, m, d) {
      const dt = new Date(y, m, d);
      const weekday = dt.toLocaleDateString('en-US', { weekday: 'short' });
      const month = dt.toLocaleDateString('en-US', { month: 'short' });
      return `${weekday}, ${d} ${month}`;
    }

    function render() {
      const firstDay = new Date(viewYear, viewMonth, 1).getDay();
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

      let html = `
        <div class="cal-head">
          <h4>${MONTHS[viewMonth]} ${viewYear}</h4>
          <div class="cal-nav">
            <button type="button" data-cal-prev ${isCurrentMonth ? 'disabled' : ''} aria-label="Previous month">${iconLeft}</button>
            <button type="button" data-cal-next aria-label="Next month">${iconRight}</button>
          </div>
        </div>
        <div class="cal-weekdays">${WEEKDAYS.map((w) => `<span>${w}</span>`).join('')}</div>
        <div class="cal-days">`;

      for (let i = 0; i < firstDay; i++) {
        html += `<button type="button" class="cal-day is-empty" disabled tabindex="-1"></button>`;
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(viewYear, viewMonth, d);
        const iso = isoDate(viewYear, viewMonth, d);
        const isPast = dateObj < today;
        const isToday = dateObj.getTime() === today.getTime();
        const isSelected = iso === selectedISO;
        html += `<button type="button" class="cal-day${isToday ? ' is-today' : ''}${isSelected ? ' is-selected' : ''}" data-iso="${iso}" ${isPast ? 'disabled' : ''} aria-label="${formatDisplay(viewYear, viewMonth, d)}">${d}</button>`;
      }
      html += `</div>`;
      calendarEl.innerHTML = html;

      calendarEl.querySelector('[data-cal-prev]')?.addEventListener('click', () => {
        viewMonth -= 1;
        if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
        render();
      });
      calendarEl.querySelector('[data-cal-next]')?.addEventListener('click', () => {
        viewMonth += 1;
        if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
        render();
      });
      calendarEl.querySelectorAll('.cal-day[data-iso]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const [y, m, d] = btn.dataset.iso.split('-').map(Number);
          selectedISO = btn.dataset.iso;
          state.dateISO = selectedISO;
          state.date = formatDisplay(y, m - 1, d);
          render();
          setTimeout(() => {
            if (current < steps.length - 1) goTo(current + 1);
          }, 380);
        });
      });
    }

    render();
  }

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

  // Point the WhatsApp button at the real booking details (fallback in case
  // the auto-opened WhatsApp tab from the booking step was popup-blocked).
  const waLink = document.querySelector('[data-c-whatsapp]');
  if (waLink) {
    const lines = [
      "Hi! I'd like to book an appointment at Dr. Siulik's Dental Care.",
      `Treatment: ${data.treatment || 'Not specified'}`,
      `Date: ${data.date || 'Not specified'}`,
      `Time: ${data.time || 'Not specified'}`,
      `Name: ${data.name || 'Not specified'}`,
      `Phone: ${data.phone || 'Not specified'}`,
    ];
    if (data.message) lines.push(`Note: ${data.message}`);
    waLink.href = 'https://wa.me/7008675007?text=' + encodeURIComponent(lines.join('\n'));
  }
})();
