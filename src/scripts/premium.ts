const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const closeMenu = () => { menuButton?.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); };
menuButton?.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('menu-open', open); });
document.querySelectorAll('.mobile-nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && document.body.classList.contains('menu-open')) { closeMenu(); menuButton?.focus(); } });
window.matchMedia('(min-width: 1000px)').addEventListener('change', closeMenu);
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => { observer.observe(el); el.classList.add('will-reveal'); });
}
let scrollPending = false;
const updateScroll = () => { const distance = document.documentElement.scrollHeight - window.innerHeight; const progress = distance > 0 ? window.scrollY / distance : 0; document.querySelector<HTMLElement>('.scroll-progress')?.style.setProperty('transform', `scaleX(${progress})`); document.querySelector('.site-header')?.classList.toggle('scrolled', window.scrollY > 30); scrollPending = false; };
window.addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); } }, { passive: true });
updateScroll();
const art = document.querySelector<HTMLElement>('.hero-art');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  art?.addEventListener('pointermove', event => { if (reducedMotion.matches) return; const rect = art.getBoundingClientRect(); art.style.setProperty('--rx', `${-(event.clientY - rect.top - rect.height / 2) / 35}deg`); art.style.setProperty('--ry', `${(event.clientX - rect.left - rect.width / 2) / 35}deg`); });
  art?.addEventListener('pointerleave', () => { art.style.setProperty('--rx', '0deg'); art.style.setProperty('--ry', '0deg'); });
  document.querySelectorAll<HTMLElement>('.magnetic').forEach(el => { el.addEventListener('pointermove', event => { if (reducedMotion.matches) return; const r = el.getBoundingClientRect(); el.style.translate = `${(event.clientX - r.left - r.width / 2) * .06}px ${(event.clientY - r.top - r.height / 2) * .08}px`; }); el.addEventListener('pointerleave', () => { el.style.translate = '0px 0px'; }); });
}

import { initPhotoStory } from './photo-story';
initPhotoStory();
// Subtle tilt for the suspended live-site preview; no effect on touch controls.
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
 const coffee = document.querySelector<HTMLElement>('.coffee-direct-preview');
 coffee?.addEventListener('pointermove', event => {
  if (reducedMotion.matches) return;
  const bounds = coffee.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - .5;
  const y = (event.clientY - bounds.top) / bounds.height - .5;
  coffee.style.setProperty('--coffee-rx', `${2 - y * 5}deg`);
  coffee.style.setProperty('--coffee-ry', `${x * 5}deg`);
 });
 coffee?.addEventListener('pointerleave', () => { coffee.style.setProperty('--coffee-rx', '2deg'); coffee.style.setProperty('--coffee-ry', '-1.5deg'); });
}
// Shared desktop/mobile active section, with an animated desktop highlight.
function initHeaderNavigation() {
 const nav = document.querySelector<HTMLElement>('.desktop-nav');
 if (!nav) return;
 const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
 const sections = links.map(link => document.getElementById(link.hash.slice(1)));
 const mobileLinks = [...document.querySelectorAll<HTMLAnchorElement>('.mobile-nav a[href^="#"]')];
 const marker = document.createElement('span');
 marker.className = 'nav-active-indicator';
 marker.setAttribute('aria-hidden', 'true');
 nav.append(marker);
 let current = -1;
 let pending = false;
 function moveMarker(link?: HTMLAnchorElement) {
  if (!link) { marker.style.opacity = '0'; return; }
  marker.style.width = `${link.offsetWidth}px`;
  marker.style.transform = `translateX(${link.offsetLeft}px)`;
  marker.style.opacity = '1';
 }
 function update() {
  current = -1;
  const line = Math.min(innerHeight * .35, 250);
  sections.forEach((section,index) => { if (section && section.getBoundingClientRect().top <= line) current = index; });
  // Stop carrying a navigation highlight into the contact section.
  const contact = document.getElementById('contact');
  if (contact && contact.getBoundingClientRect().top <= line) current = -1;
  links.forEach((link,index) => { if (index === current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  mobileLinks.forEach(link => {
   const active = current >= 0 && link.hash === links[current]?.hash;
   if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
  moveMarker(links[current]);
  pending = false;
 }
 function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
 links.forEach(link => {
  link.addEventListener('pointerenter', () => moveMarker(link));
  link.addEventListener('focus', () => moveMarker(link));
  link.addEventListener('blur', () => moveMarker(links[current]));
 });
 nav.addEventListener('pointerleave', () => moveMarker(links[current]));
 window.addEventListener('scroll', schedule, { passive:true });
 window.addEventListener('resize', schedule, { passive:true });
 document.fonts.ready.then(schedule);
 update();
}
initHeaderNavigation();

function initMilestoneScroll() {
 const section = document.querySelector<HTMLElement>('#honours');
 const viewport = section?.querySelector<HTMLElement>('.honours-viewport');
 const track = section?.querySelector<HTMLElement>('.honours-grid');
 if (!section || !viewport || !track) return;
 const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
 let travel = 0;
 let current = 0;
 let target = 0;
 let frame = 0;
 const animate = () => {
  const delta = target - current;
  current = Math.abs(delta) < 0.1 ? target : current + delta * 0.14;
  track.style.transform = `translate3d(${-current}px,0,0)`;
  frame = current === target ? 0 : requestAnimationFrame(animate);
 };
 const update = () => {
  if (motion.matches) return;
  const top = window.innerWidth < 700 ? 90 : 110;
  const progress = Math.max(0, Math.min(1, (top - section.getBoundingClientRect().top) / Math.max(1, travel)));
  target = progress * travel;
  if (!frame) frame = requestAnimationFrame(animate);
 };
 const measure = () => {
  const count = window.innerWidth < 700 ? 1.12 : window.innerWidth < 1000 ? 2 : 3;
  const gap = window.innerWidth < 700 ? 14 : 20;
  track.style.setProperty('--milestone-width', `${(viewport.clientWidth - gap * (Math.ceil(count) - 1)) / count}px`);
  section.classList.toggle('honours-scroll', !motion.matches);
  travel = Math.max(0, track.scrollWidth - viewport.clientWidth);
  section.style.height = motion.matches ? '' : `${travel + section.querySelector<HTMLElement>('.honours-sticky')!.offsetHeight + 60}px`;
  if (motion.matches) { cancelAnimationFrame(frame); frame = 0; current = 0; target = 0; track.style.transform = ''; }
  update();
 };
 window.addEventListener('scroll', update, { passive: true });
 window.addEventListener('resize', measure, { passive: true });
 motion.addEventListener('change', measure);
 document.fonts.ready.then(measure);
 measure();
}
initMilestoneScroll();

function initContactTyping() {
 const title = document.querySelector<HTMLElement>('.contact-title');
 const text = title?.querySelector<HTMLElement>('.contact-type-text');
 if (!title || !text || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 const length = Array.from(text.textContent || '').length;
 const observer = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting) return;
  observer.disconnect();
  title.classList.add('is-typing');
  let character = 0;
  text.style.setProperty('--type-hidden', '100%');
  const timer = window.setInterval(() => {
   character++;
   text.style.setProperty('--type-hidden', `${Math.max(0, 100 - character / length * 100)}%`);
   if (character >= length) { clearInterval(timer); title.classList.remove('is-typing'); }
  }, 65);
 }, { threshold: 0.7 });
 observer.observe(title);
}
initContactTyping();
