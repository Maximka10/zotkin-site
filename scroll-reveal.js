(function(){
  if (!('IntersectionObserver' in window)) return;

  var selectors = [
    '.service-card', '.review-card', '.order-step', '.usp-list li', '.contact-item', '.zones-list li',
    '.contacts-section', '.map-section', '.hero', '.cards .card', '.services-list li', '.estimator-section', '.contact-form-section'
  ];

  var targets = document.querySelectorAll(selectors.join(', '));
  if (!targets.length) return;

  targets.forEach(function(el, idx){
    if (el.classList.contains('reveal-in')) return;
    el.classList.add('reveal-in');
    el.style.transitionDelay = (idx % 3) * 70 + 'ms';
  });

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function(el){ io.observe(el); });
})();
