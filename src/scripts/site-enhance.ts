(() => {
  const html = document.documentElement;
  const body = document.body;
  const initYear=():void=>document.querySelectorAll<HTMLElement>('#year').forEach(el=>el.textContent=String(new Date().getFullYear()));
  const initMobileMenu=():void=>document.querySelectorAll<HTMLButtonElement>('.burger').forEach(burger=>{
    const navId=burger.getAttribute('aria-controls'); const nav=navId?document.getElementById(navId):document.querySelector<HTMLElement>('.nav'); if(!nav||burger.dataset.tsMenuReady==='true')return; burger.dataset.tsMenuReady='true';
    const close=():void=>{nav.classList.remove('open');burger.classList.remove('active');burger.setAttribute('aria-expanded','false');body.classList.remove('no-scroll');};
    burger.addEventListener('click',e=>{e.stopPropagation();const open=!nav.classList.contains('open');nav.classList.toggle('open',open);burger.classList.toggle('active',open);burger.setAttribute('aria-expanded',String(open));body.classList.toggle('no-scroll',open);});
    nav.addEventListener('click',e=>{if((e.target as HTMLElement|null)?.closest('a'))close();}); document.addEventListener('click',e=>{const t=e.target as Node|null;if(t&&!burger.contains(t)&&!nav.contains(t))close();}); document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  });
  const initImages=():void=>document.querySelectorAll<HTMLImageElement>('img').forEach(img=>{if(!img.hasAttribute('decoding'))img.decoding='async';if(!img.hasAttribute('loading')&&!img.closest('.hero,.hero-section,header,.header'))img.loading='lazy';});
  const initAnchors=():void=>document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(link=>link.addEventListener('click',e=>{const id=link.getAttribute('href');if(!id||id==='#')return;const target=document.querySelector<HTMLElement>(id);if(!target)return;e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'',id);}));
  const initHeader=():void=>{const header=document.getElementById('sticky-header')??document.querySelector<HTMLElement>('.header');if(!header)return;const update=():void=>header.classList.toggle('scrolled',scrollY>12);update();addEventListener('scroll',update,{passive:true});};
  const initActiveNav=():void=>{const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();document.querySelectorAll<HTMLAnchorElement>('.nav a[href]').forEach(a=>{const href=(a.getAttribute('href')||'').split('#')[0].split('?')[0];if(!href||href.startsWith('http')||href.startsWith('tel:')||href.startsWith('mailto:'))return;const target=(href.split('/').pop()||'index.html').toLowerCase();if(target===current)a.setAttribute('aria-current','page');});};
  const initBackToTop=():void=>{if(document.querySelector('.ts-back-to-top'))return;const b=document.createElement('button');b.type='button';b.className='ts-back-to-top';b.setAttribute('aria-label','Вернуться наверх');b.innerHTML='↑';b.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));body.appendChild(b);const update=():void=>b.classList.toggle('is-visible',scrollY>500);update();addEventListener('scroll',update,{passive:true});};
  const init=():void=>{html.classList.add('ts-enhanced');initYear();initMobileMenu();initImages();initAnchors();initHeader();initActiveNav();initBackToTop();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
