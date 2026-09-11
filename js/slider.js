/* ===================== BEFORE / AFTER SLIDER ===================== */
(function () {
  document.querySelectorAll('.ba-slider').forEach((slider) => {
    const handle = slider.querySelector('.ba-handle');
    const beforeWrap = slider.querySelector('.ba-before-wrap');
    let dragging = false;

    function setPos(percent) {
      percent = Math.min(100, Math.max(0, percent));
      beforeWrap.style.width = percent + '%';
      handle.style.left = percent + '%';
      slider.setAttribute('aria-valuenow', Math.round(percent));
    }

    function posFromClientX(clientX) {
      const rect = slider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    function onMove(clientX) {
      setPos(posFromClientX(clientX));
    }

    slider.addEventListener('pointerdown', (e) => {
      dragging = true;
      slider.setPointerCapture(e.pointerId);
      onMove(e.clientX);
    });
    slider.addEventListener('pointermove', (e) => {
      if (dragging) onMove(e.clientX);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((evt) =>
      slider.addEventListener(evt, () => (dragging = false))
    );

    // keyboard support
    slider.setAttribute('tabindex', '0');
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-valuemin', '0');
    slider.setAttribute('aria-valuemax', '100');
    slider.setAttribute('aria-label', 'Before and after comparison slider');
    const currentWidth = parseFloat(beforeWrap.style.width) || 50;
    setPos(currentWidth);

    slider.addEventListener('keydown', (e) => {
      const current = parseFloat(beforeWrap.style.width) || 50;
      if (e.key === 'ArrowLeft') { setPos(current - 5); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setPos(current + 5); e.preventDefault(); }
      if (e.key === 'Home') { setPos(0); e.preventDefault(); }
      if (e.key === 'End') { setPos(100); e.preventDefault(); }
    });
  });
})();
