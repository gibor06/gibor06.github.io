export function initPhotoStory() {
  const story = document.querySelector<HTMLElement>('.photo-story');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (story) {
    const slides = [...story.querySelectorAll<HTMLElement>('.story-slide')];
    const dots = [...story.querySelectorAll<HTMLButtonElement>('.story-dot')];
    const pause = story.querySelector<HTMLButtonElement>('.story-pause');
    let active = 0, timer = 0, visible = true;
    let paused = motion.matches;
    function show(index: number) {
      active = index;
      slides.forEach((slide,i) => { slide.classList.toggle('is-active', i === active); slide.setAttribute('aria-hidden', String(i !== active)); });
      dots.forEach((dot,i) => { dot.classList.toggle('is-active', i === active); dot.setAttribute('aria-pressed', String(i === active)); });
      const counter = story?.querySelector('.story-counter');
      if (counter) counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    }
    function schedule() {
      clearTimeout(timer);
      if (pause) { pause.setAttribute('aria-pressed', String(paused)); pause.setAttribute('aria-label', (paused ? pause.dataset.playLabel : pause.dataset.pauseLabel) || 'Pause'); if (pause.firstElementChild) pause.firstElementChild.textContent = paused ? '▶' : 'Ⅱ'; }
      if (!paused && !motion.matches && visible && !document.hidden && !story?.contains(document.activeElement)) {
        timer = window.setTimeout(() => { show((active + 1) % slides.length); schedule(); }, 2000);
      }
    }
    dots.forEach((dot,i) => dot.addEventListener('click', () => { show(i); schedule(); }));
    pause?.addEventListener('click', () => { paused = !paused; schedule(); });
    story.addEventListener('focusin', schedule);
    story.addEventListener('focusout', () => requestAnimationFrame(schedule));
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', () => { paused = motion.matches; schedule(); });
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }).observe(story);
    schedule();
  }
  const evidenceSection = document.querySelector<HTMLElement>('.evidence-section');
  const evidencePause = document.querySelector<HTMLButtonElement>('.evidence-pause');
  const evidenceLayout = document.querySelector<HTMLButtonElement>('.evidence-layout');
  evidencePause?.addEventListener('click', () => {
    const paused = evidenceSection?.classList.toggle('is-paused') || false;
    evidencePause.setAttribute('aria-pressed', String(paused));
    evidencePause.textContent = (paused ? evidencePause.dataset.playText : evidencePause.dataset.pauseText) || '';
  });
  evidenceLayout?.addEventListener('click', () => {
    const grid = evidenceSection?.classList.toggle('is-grid') || false;
    evidenceLayout.setAttribute('aria-pressed', String(grid));
    evidenceLayout.textContent = (grid ? evidenceLayout.dataset.motionText : evidenceLayout.dataset.gridText) || '';
  });
  if (evidenceSection) {
    new IntersectionObserver(([entry]) => evidenceSection.classList.toggle('is-offscreen', !entry.isIntersecting)).observe(evidenceSection);
    document.addEventListener('visibilitychange', () => evidenceSection.classList.toggle('is-hidden-page', document.hidden));
  }
  const dialog = document.querySelector<HTMLDialogElement>('.evidence-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('.evidence-dialog-caption');
  document.querySelectorAll<HTMLAnchorElement>('[data-evidence]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (image) { image.src = link.href; image.alt = link.dataset.caption || ''; }
    if (caption) caption.textContent = link.dataset.caption || '';
    evidenceSection?.classList.add('is-viewing');
    dialog.showModal();
  }));
  dialog.addEventListener('close', () => evidenceSection?.classList.remove('is-viewing'));
  dialog.querySelector('.evidence-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}
