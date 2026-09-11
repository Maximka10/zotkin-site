(function () {
  if (!('IntersectionObserver' in window)) return;

  const selectors = [
    '.service-card', '.review-card', '.order-step', '.usp-list li', '.contact-item', '.zones-list li',
    '.contacts-section', '.map-section', '.hero', '.cards .card', '.services-list li', '.estimator-section', '.contact-form-section'
  ];

  const targets = document.querySelectorAll<HTMLElement>(selectors.join(', '));
  if (!targets.length) return;

  targets.forEach((el, idx) => {
    if (el.classList.contains('reveal-in')) return;
    el.classList.add('reveal-in');
    el.style.transitionDelay = (idx % 3) * 70 + 'ms';
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el) => io.observe(el));
})();
