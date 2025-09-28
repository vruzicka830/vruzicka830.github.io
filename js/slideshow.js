(function () {
  const root = document.querySelector('.slideshow');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.slide'));
  const prevBtn = root.querySelector('#prevBtn');
  const nextBtn = root.querySelector('#nextBtn');

  // Find which slide starts visible
  let index = slides.findIndex(s => s.getAttribute('aria-hidden') === 'false');
  if (index === -1) index = 0;

  // Make slideshow focusable for keyboard
  root.tabIndex = 0;

  // Show slide i, wrap around if needed
  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, k) => {
      s.setAttribute('aria-hidden', String(k !== index));
    });
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  // Button clicks
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Keyboard controls
  root.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight': e.preventDefault(); next(); break;
      case 'ArrowLeft' : e.preventDefault(); prev(); break;
      case 'Home'      : e.preventDefault(); show(0); break;
      case 'End'       : e.preventDefault(); show(slides.length - 1); break;
    }
  });

  // Ensure one slide visible on load
  show(index);
})();
