(() => {
  const html = document.documentElement;
  const body = document.body;

  const initYear = (): void => {
    document.querySelectorAll<HTMLElement>('#year').forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  };

  const initMobileMenu = (): void => {
    const burgers = document.querySelectorAll<HTMLButtonElement>('.burger');
    burgers.forEach((burger) => {
      const navId = burger.getAttribute('aria-controls');
      const nav = navId ? document.getElementById(navId) : document.querySelector<HTMLElement>('.nav');
      if (!nav || burger.dataset.tsMenuReady === 'true') return;
      burger.dataset.tsMenuReady = 'true';

      const close = (): void => {
        nav.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        body.classList.remove('no-scroll');
      };

      burger.addEventListener('click', (event) => {
        event.stopPropagation();
        const open = !nav.classList.contains('open');
        nav.classList.toggle('open', open);
        burger.classList.toggle('active', open);
        burger.setAttribute('aria-expanded', String(open));
        body.classList.toggle('no-scroll', open);
      });

      nav.addEventListener('click', (event) => {
        const target = event.target as HTMLElement | null;
        if (target?.closest('a')) close();
      });

      document.addEventListener('click', (event) => {
        const target = event.target as Node | null;
        if (target && !burger.contains(target) && !nav.contains(target)) close();
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') close();
      });
    });
  };

  const initLazyImages = (): void => {
    document.querySelectorAll<HTMLImageElement>('img').forEach((image) => {
      if (!image.hasAttribute('decoding')) image.decoding = 'async';
      if (!image.hasAttribute('loading') && !image.closest('.hero, .hero-section, header, .header')) {
        image.loading = 'lazy';
      }
    });
  };

  const initSmoothAnchors = (): void => {
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector<HTMLElement>(id);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', id);
      });
    });
  };

  const initHeader = (): void => {
    const header = document.getElementById('sticky-header') ?? document.querySelector<HTMLElement>('.header');
    if (!header) return;
    const update = (): void => header.classList.toggle('scrolled', window.scrollY > 12);
    update();
    window.addEventListener('scroll', update, { passive: true });
  };

  const initReveal = (): void => {
    const items = document.querySelectorAll<HTMLElement>('[data-reveal], .reveal-on-scroll');
    if (!items.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px' });
    items.forEach((item) => observer.observe(item));
  };

  const initBackToTop = (): void => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ts-back-to-top';
    button.setAttribute('aria-label', 'Вернуться наверх');
    button.innerHTML = '↑';
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    body.appendChild(button);
    const update = (): void => button.classList.toggle('is-visible', window.scrollY > 500);
    update();
    window.addEventListener('scroll', update, { passive: true });
  };

  const init = (): void => {
    html.classList.add('ts-enhanced');
    initYear();
    initMobileMenu();
    initLazyImages();
    initSmoothAnchors();
    initHeader();
    initReveal();
    initBackToTop();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
