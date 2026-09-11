(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.video-testimonial'));
    if (!cards.length) return;

    var videos = cards.map(function (card) { return card.querySelector('video'); });

    cards.forEach(function (card, i) {
      var video = videos[i];
      var toggleBtn = card.querySelector('.vt-toggle');
      var muteBtn = card.querySelector('.vt-mute');
      if (!video || !toggleBtn) return;

      toggleBtn.addEventListener('click', function () {
        if (video.paused) {
          // Only one story plays at a time — keeps the section calm and focused.
          videos.forEach(function (v) { if (v !== video) v.pause(); });
          video.play();
        } else {
          video.pause();
        }
      });

      video.addEventListener('play', function () { card.classList.add('is-playing'); });
      video.addEventListener('pause', function () { card.classList.remove('is-playing'); });
      video.addEventListener('ended', function () { card.classList.remove('is-playing'); });

      if (muteBtn) {
        muteBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          video.muted = !video.muted;
          muteBtn.setAttribute('aria-pressed', String(video.muted));
          muteBtn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
        });
      }
    });
  });
})();
