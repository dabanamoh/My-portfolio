const menu=document.querySelector('.menu-toggle');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.querySelector('#nav').classList.toggle('open',open);menu.textContent=open?'Close':'Menu';});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true')menu.click();});
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&!card.dataset.category.split(' ').includes(button.dataset.filter);if(!card.hidden)count++;});const status=document.querySelector('.results-count');if(status)status.textContent=`${count} projects shown`; }));
const lightbox=document.querySelector('.lightbox');
document.querySelectorAll('[data-lightbox]').forEach(button=>button.addEventListener('click',()=>{lightbox.querySelector('img').src=button.dataset.lightbox;lightbox.querySelector('img').alt=button.dataset.caption;lightbox.querySelector('p').textContent=button.dataset.caption;lightbox.showModal();}));
lightbox?.querySelector('button').addEventListener('click',()=>lightbox.close());
lightbox?.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});
const form=document.querySelector('.contact-form');
const FORM_ENDPOINT='https://api.web3forms.com/submit';
const WEB3FORMS_KEY='038b1a02-073d-4e0d-b43f-3d616502b501'; // Web3Forms 'Portfolio website' form (public key, safe in client code)
function showState(kind){const status=document.querySelector('.form-status');status.hidden=false;status.classList.toggle('state-error',kind==='error');status.textContent=kind==='error'?'Your message could not be sent. Your details are still here. Try again in a moment, or reach me on LinkedIn.':'Message sent - thank you! It\'s landed straight in my inbox. I reply to genuine enquiries within ~24 hours.';status.focus();}
form?.addEventListener('submit',e=>{e.preventDefault();if(form.botcheck&&form.botcheck.checked)return;const btn=form.querySelector('button[type="submit"]');const d=Object.fromEntries(new FormData(form));btn.disabled=true;fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({access_key:WEB3FORMS_KEY,subject:'Portfolio enquiry'+(d.service?': '+d.service:''),from_name:'Portfolio website',name:d.name,email:d.email,'Help with':d.service||'Not specified',Timing:d.timeline||'',message:d.details,botcheck:''})}).then(r=>r.json()).then(res=>{if(!res||!res.success)throw new Error('send failed');form.reset();showState('success');}).catch(()=>showState('error')).finally(()=>{btn.disabled=false;});});

// Motion is progressive enhancement: content is never hidden while waiting for JS.
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!Element.prototype.animate || !('IntersectionObserver' in window)) return;
  const active = new Map();
  const seen = new WeakSet();
  const targets = [...document.querySelectorAll(
    '.editorial-hero .hero-title, .hero-summary, .stage > div, .page-intro > *, ' +
    '.about-hero > *, .contact-layout > *, .case-hero > *, .case-cover, ' +
    '.section-head, .feature-project, .project-card, .step, .about-strip > *, ' +
    '.design-ribbon > *, .cta-inner > *, .case-section, .gallery figure, .credential-card'
  )].filter(element => !element.parentElement.closest('.case-section, .feature-project, .hero-art'));

  function reveal(element, delay = 0) {
    if (preference.matches || element.hidden) return;
    active.get(element)?.cancel();
    const animation = element.animate([
      { opacity: 0, transform: 'translateY(18px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 620, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
    active.set(element, animation);
    const clean = () => { if (active.get(element) === animation) active.delete(element); };
    animation.onfinish = clean;
    animation.oncancel = clean;
  }

  const observer = new IntersectionObserver(entries => {
    let stagger = 0;
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting || target.hidden || seen.has(target)) return;
      seen.add(target);
      observer.unobserve(target);
      reveal(target, Math.min(stagger++ * 65, 195));
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  function syncPreference() {
    observer.disconnect();
    active.forEach(animation => animation.cancel());
    active.clear();
    if (!preference.matches) targets.forEach(target => {
      if (!seen.has(target)) observer.observe(target);
    });
  }
  preference.addEventListener('change', syncPreference);
  syncPreference();

  // Keyboard focus must never land on an element still fading in.
  document.addEventListener('focusin', event => {
    active.forEach((animation, element) => {
      if (element.contains(event.target)) animation.cancel();
    });
  });
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    active.forEach((animation, element) => { if (element.matches('[data-category]')) animation.cancel(); });
    let stagger = 0;
    document.querySelectorAll('[data-category]:not([hidden])').forEach(card => {
      const bounds = card.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) {
        seen.add(card);
        observer.unobserve(card);
        reveal(card, Math.min(stagger++ * 55, 165));
      }
    });
  }));
})();

// Scroll-linked visual depth. Text, controls and native scrolling stay stationary.
(() => {
  const main = document.querySelector('main');
  if (!main) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 760px)');
  const layers = [...document.querySelectorAll('.stage-media .product-window, .feature-media .product-window, .case-cover img, .portrait-block img')];
  const offsets = new WeakMap();
  let frame = 0;
  function render() {
    frame = 0;
    if (reduced.matches) return;
    const height = window.innerHeight;

    main.style.setProperty('--ambient-y', `${-Math.min(window.scrollY * .09, compact.matches ? 60 : 90)}px`);
    layers.forEach(layer => {
      if (layer.closest('[hidden]')) return;
      const bounds = layer.getBoundingClientRect();
      const centre = bounds.top - (offsets.get(layer) || 0) + bounds.height / 2;
      if (bounds.bottom < -50 || bounds.top > height + 50) return;
      const prominent = layer.matches('.stage-media .product-window, .case-cover img, .portrait-block img');
      const hero = layer.matches('.stage-media .product-window');
      const portrait = layer.matches('.portrait-block img');
      const range = compact.matches ? (hero ? 55 : portrait ? 50 : prominent ? 38 : 28) : (hero ? 85 : portrait ? 65 : 40);
      const speed = hero ? .55 : portrait ? .4 : prominent ? .28 : .14;
      const offset = Math.max(-range, Math.min(range, (height / 2 - centre) * speed));
      offsets.set(layer, offset);
      layer.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
    });
  }
  function schedule() {
    if (!reduced.matches && !frame) frame = requestAnimationFrame(render);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    main.classList.toggle('parallax-scene', !reduced.matches);
    layers.forEach(layer => {
      layer.classList.toggle('parallax-layer', !reduced.matches);
      layer.style.removeProperty('--parallax-y');
      offsets.delete(layer);
    });
    main.style.removeProperty('--ambient-y');
    schedule();
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('load', schedule, { once: true });
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', schedule));
  reduced.addEventListener('change', sync);
  compact.addEventListener('change', sync);
  sync();
})();
