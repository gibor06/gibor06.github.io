/** Keep the case-study contents aligned with the section being read. */
export function initCaseContents() {
  const navigation = document.querySelector<HTMLElement>('.study-toc nav');
  if (!navigation) return;
  const links = [...navigation.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  const indicator = document.createElement('span');
  indicator.className = 'study-toc-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  navigation.append(indicator);
  let scheduled = false;
  function update() {
    const readingLine = Math.min(innerHeight * .35, 230);
    let active = 0;
    sections.forEach((section, index) => { if (section && section.getBoundingClientRect().top <= readingLine) active = index; });
    links.forEach((link,index) => {
      link.classList.toggle('is-current', index === active);
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const current = links[active];
    if (current) {
      indicator.style.transform = `translateY(${current.offsetTop + 12}px)`;
      indicator.style.height = `${Math.max(20, current.offsetHeight - 24)}px`;
    }
    scheduled = false;
  }
  function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  document.fonts.ready.then(schedule);
  update();
}
initCaseContents();
