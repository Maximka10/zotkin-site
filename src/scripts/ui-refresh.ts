(() => {
  const root = document.documentElement;

  const init = (): void => {
    root.classList.add('ui-refresh');
    if (!document.querySelector('link[data-ui-refresh]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'refresh.css';
      link.dataset.uiRefresh = 'true';
      document.head.appendChild(link);
    }
    if (!document.querySelector('link[data-premium-ui]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'premium.css';
      link.dataset.premiumUi = 'true';
      document.head.appendChild(link);
    }
    root.style.setProperty('--ui-vh', `${window.innerHeight * 0.01}px`);
    document.querySelectorAll<HTMLImageElement>('img').forEach((image) => {
      if (!image.hasAttribute('decoding')) image.decoding = 'async';
      if (!image.hasAttribute('loading') && !image.closest('.hero, .hero-section, header, .header')) image.loading = 'lazy';
    });
  };
  window.addEventListener('resize', () => root.style.setProperty('--ui-vh', `${window.innerHeight * 0.01}px`), { passive: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
