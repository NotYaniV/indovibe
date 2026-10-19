const loader=document.querySelector('#loader'), count=document.querySelector('.loader-count'), line=document.querySelector('.loader-line span');
let start=null,duration=2100;
function tick(now){if(!start)start=now;const p=Math.min((now-start)/duration,1);const n=Math.round(p*100);count.textContent=String(n).padStart(3,'0');line.style.width=(p*100)+'%';if(p<1)requestAnimationFrame(tick);else setTimeout(()=>loader.classList.add('loader-done'),350)}
requestAnimationFrame(tick);

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const menuBtn=document.querySelector('.menu-btn'), mobile=document.querySelector('.mobile-menu');
menuBtn.addEventListener('click',()=>{mobile.classList.toggle('open');document.body.classList.toggle('menu-open')});
mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('open');document.body.classList.remove('menu-open')}));

/* ---- additions: smooth scroll, parallax, horizontal gallery ---- */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) return; // page still works without these
  gsap.registerPlugin(ScrollTrigger);

  // smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger stays in sync
  if (window.Lenis) {
    const lenis = new Lenis({ duration: 1.15, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // parallax: each image layer drifts slower than its frame
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.fromTo(el, { yPercent: -7 }, {
      yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // gallery: vertical scroll moves the strip sideways (desktop only; mobile swipes natively)
  gsap.matchMedia().add('(min-width: 801px)', () => {
    const track = document.querySelector('.gallery-track');
    const dist = () => Math.max(0, track.scrollWidth - innerWidth + 32);
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '.gallery', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true },
    });
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
