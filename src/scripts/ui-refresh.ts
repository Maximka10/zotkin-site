(() => {
  const root = document.documentElement;
  root.classList.add('ui-refresh');

  const addStylesheet = (): void => {
    if (document.querySelector('link[data-ui-refresh]')) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'refresh.css';
    link.dataset.uiRefresh = 'true';
    document.head.appendChild(link);
  };

  const setViewportUnit = (): void => {
    root.style.setProperty('--ui-vh', `${window.innerHeight * 0.01}px`);
  };

  const enhanceImages = (): void => {
    const images = document.querySelectorAll<HTMLImageElement>('img');
    images.forEach((image) => {
      if (!image.hasAttribute('decoding')) image.decoding = 'async';
      if (!image.closest('.hero, .hero-section, header, .header') && !image.hasAttribute('loading')) {
        image.loading = 'lazy';
      }
    });
  };

  const syncMobileNav = (): void => {
    const nav = document.getElementById('mobile-nav');
    const burger = document.getElementById('burger');
    if (!nav || !burger) return;

    const sync = (): void => {
      const open = nav.classList.contains('open');
      nav.setAttribute('aria-hidden', String(!open));
      burger.setAttribute('aria-expanded', String(open));
      root.classList.toggle('mobile-menu-open', open);
    };

    const observer = new MutationObserver(sync);
    observer.observe(nav, { attributes: true, attributeFilter: ['class'] });
    observer.observe(burger, { attributes: true, attributeFilter: ['class'] });
    sync();
  };

  const init = (): void => {
    addStylesheet();
    setViewportUnit();
    enhanceImages();
    syncMobileNav();
  };

  window.addEventListener('resize', setViewportUnit, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
