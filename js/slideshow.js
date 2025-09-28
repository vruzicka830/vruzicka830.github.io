(function () {
  const root = document.querySelector('.slideshow');
  if (!root) return;

  const slidesWrap = root.querySelector('#slides');
  const slides = Array.from(root.querySelectorAll('.slide'));
  const prevBtn = root.querySelector('#prevBtn');
  const nextBtn = root.querySelector('#nextBtn');
  const dotsWrap = root.querySelector('#dots');
  const playPauseBtn = root.querySelector('#playPauseBtn');

  // Create dots if none present
  if (dotsWrap && dotsWrap.children.length === 0) {
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      b.addEventListener('click', () => go(i, true));
      dotsWrap.appendChild(b);
    });
  }
  const dots = Array.from(dotsWrap.querySelectorAll('button'));

  let index = 0;
  let autoplay = true;
  const INTERVAL_MS = 4000;
  let timer = null;

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const active = k === index;
      s.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach((d, k) => {
      d.setAttribute('aria-current', String(k === index));
    });
  }

  function next() { go(index + 1, true); }
  function prev() { go(index - 1, true); }

  function go(i, userInitiated = false) {
    show(i);
    if (userInitiated) restartAutoplay();
  }

  function startAutoplay() {
    if (!autoplay || timer) return;
    timer = setInterval(() => go(index + 1, false), INTERVAL_MS);
    playPauseBtn.setAttribute('aria-pressed', 'true'); // playing
    playPauseBtn.setAttribute('aria-label', 'Pause autoplay');
    playPauseBtn.textContent = '❚❚';
  }

  function stopAutoplay() {
    autoplay = false;
    if (timer) clearInterval(timer);
    timer = null;
    playPauseBtn.setAttribute('aria-pressed', 'false'); // paused
    playPauseBtn.setAttribute('aria-label', 'Start autoplay');
    playPauseBtn.textContent = '▶';
  }

  function restartAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (autoplay) startAutoplay();
  }

  // Events
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // Play/Pause toggle
  playPauseBtn.addEventListener('click', () => {
    if (autoplay) stopAutoplay();
    else { autoplay = true; startAutoplay(); }
  });

  // Pause on hover/focus; resume on leave/blur if playing
  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', () => { autoplay = true; startAutoplay(); });

  // Keyboard navigation
  root.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight': e.preventDefault(); next(); break;
      case 'ArrowLeft' : e.preventDefault(); prev(); break;
      case 'Home'      : e.preventDefault(); go(0, true); break;
      case 'End'       : e.preventDefault(); go(slides.length - 1, true); break;
      case ' ':
      case 'Spacebar':
        // Space toggles play/pause if focus is within slideshow region
        if (root.contains(document.activeElement)) {
          e.preventDefault();
          playPauseBtn.click();
        }
        break;
    }
  });

  // Make region focusable to capture keys
  root.tabIndex = 0;

  // Basic touch swipe
  let touchStartX = 0, touchEndX = 0;
  slidesWrap.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  slidesWrap.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const dx = touchEndX - touchStartX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
  }, { passive: true });

  // Init
  show(0);
  startAutoplay();
})();

