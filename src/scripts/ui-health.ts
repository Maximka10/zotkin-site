(() => {
  const init=():void=>{document.querySelectorAll<HTMLImageElement>('img').forEach(img=>{if(!img.alt)img.alt='';});document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(a=>{const href=a.getAttribute('href')||'';if(href.startsWith('http')&&!a.hasAttribute('rel'))a.rel='noopener noreferrer';});document.querySelectorAll<HTMLButtonElement>('button').forEach(b=>{if(!b.getAttribute('aria-label')&&b.textContent?.trim()==='')b.setAttribute('aria-label','Кнопка');});};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
