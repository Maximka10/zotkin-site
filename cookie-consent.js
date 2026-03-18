(function () {
  var storageKey = 'zolotar58_cookie_consent';

  function hasConsent() {
    return window.localStorage.getItem(storageKey) === 'accepted';
  }

  function saveConsent() {
    window.localStorage.setItem(storageKey, 'accepted');
  }

  function buildBanner() {
    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.id = 'cookieBanner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-labelledby', 'cookieBannerTitle');

    banner.innerHTML =
      '<div class="cookie-banner__content">' +
        '<div class="cookie-banner__body">' +
          '<h3 class="cookie-banner__title" id="cookieBannerTitle">Файлы cookie</h3>' +
          '<p class="cookie-banner__text">Мы используем cookie, чтобы сайт работал корректно и был удобнее для вас. Нажимая «Принять», вы подтверждаете согласие на использование cookie.</p>' +
        '</div>' +
        '<button type="button" class="cookie-banner__btn" id="cookieBannerAccept">Принять</button>' +
      '</div>';

    return banner;
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (hasConsent() || document.getElementById('cookieBanner')) return;

    var banner = buildBanner();
    document.body.appendChild(banner);

    var button = document.getElementById('cookieBannerAccept');
    if (!button) return;

    button.addEventListener('click', function () {
      saveConsent();
      banner.classList.add('cookie-banner--hidden');
      setTimeout(function () {
        if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
      }, 240);
    });
  });
})();
