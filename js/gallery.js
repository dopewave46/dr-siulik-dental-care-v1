/* ===================== GALLERY: filters + lightbox ===================== */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.masonry-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach((item) => {
        const match = filter === 'all' || item.dataset.cat === filter;
        item.style.display = match ? '' : 'none';
      });
    });
  });

  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;
  const lbStage = lightbox.querySelector('.lightbox-stage');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  let visibleItems = [];
  let currentIndex = 0;

  function getVisible() {
    return Array.from(items).filter((i) => i.style.display !== 'none');
  }

  function renderStage() {
    const item = visibleItems[currentIndex];
    if (!item || !lbStage) return;
    const img = item.querySelector('img');
    if (img) {
      lbStage.innerHTML = '';
      const clone = img.cloneNode(true);
      lbStage.appendChild(clone);
    } else {
      const ph = item.querySelector('.ph');
      lbStage.innerHTML = ph ? ph.outerHTML : '';
    }
  }

  function openAt(index) {
    visibleItems = getVisible();
    if (!visibleItems.length) return;
    currentIndex = index;
    renderStage();
    lightbox.classList.add('is-open');
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  function step(dir) {
    if (!visibleItems.length) return;
    currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
    renderStage();
  }

  items.forEach((item) => {
    item.addEventListener('click', () => openAt(getVisible().indexOf(item)));
  });

  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click', () => step(-1));
  nextBtn?.addEventListener('click', () => step(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
})();
