(() => {
  const root = document.documentElement;
  const init = (): void => {
    root.classList.add('ui-refresh');
    const styles: Array<[string,string]> = [['data-ui-refresh','refresh.css'],['data-premium-ui','premium.css'],['data-global-overhaul','global-overhaul.css'],['data-design-v2','design-system-v2.css']];
    styles.forEach(([attr, href]) => { if (!document.querySelector(`link[${attr}]`)) { const link=document.createElement('link'); link.rel='stylesheet'; link.href=href; link.setAttribute(attr,'true'); document.head.appendChild(link); } });
    const setVh=():void=>root.style.setProperty('--ui-vh',`${window.innerHeight*0.01}px`); setVh(); window.addEventListener('resize',setVh,{passive:true});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
