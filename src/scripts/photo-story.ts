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
  // Native focus scrolling may leave a partly visible card clipped at the edge.
  document.querySelectorAll<HTMLElement>('.evidence-lane, .google-certificate-lane').forEach(lane => {
    const track = lane.firstElementChild as HTMLElement | null;
    const group = track?.firstElementChild as HTMLElement | null;
    if (!track || !group) return;
    const copy = group.cloneNode(true) as HTMLElement;
    copy.classList.add('document-lane-copy');
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('a').forEach(link => link.tabIndex = -1);
    copy.querySelectorAll('img').forEach(image => image.alt = '');
    track.append(copy);
    let hovered = false, visible = false;
    const direction = lane.id === 'certificate-lane' ? -1 : 1;
    let frame = 0, last = 0, position = 0;
    const canRun = () => !hovered && visible && !motion.matches && !document.hidden && !lane.contains(document.activeElement) && !document.querySelector('.evidence-dialog[open]');
    const animate = (time: number) => {
      frame = 0;
      if (!canRun()) { last = 0; return; }
      if (!last) position = lane.scrollLeft;
      const elapsed = last ? Math.min(time - last, 50) : 0;
      last = time;
      const cycle = copy.offsetLeft - group.offsetLeft;
      if (cycle <= 0) return;
      position = ((position + direction * elapsed * .065) % cycle + cycle) % cycle;
      lane.scrollLeft = position;
      frame = requestAnimationFrame(animate);
    };
    const schedule = () => {
      if (canRun()) { if (!frame) { last = 0; frame = requestAnimationFrame(animate); } }
      else { cancelAnimationFrame(frame); frame = 0; last = 0; }
    };
    lane.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') { hovered = true; schedule(); } });
    lane.addEventListener('pointerup', event => { if (event.pointerType === 'touch') { hovered = false; schedule(); } });
    lane.addEventListener('pointercancel', () => { hovered = false; schedule(); });
    lane.addEventListener('focusin', schedule);
    lane.addEventListener('focusout', () => requestAnimationFrame(schedule));
    document.addEventListener('visibilitychange', schedule);
    document.querySelector('.evidence-dialog')?.addEventListener('close', schedule);
    motion.addEventListener('change', schedule);
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }).observe(lane);
    schedule();
    lane.addEventListener('focusin', event => {
      const card = event.target;
      if (!(card instanceof HTMLElement) || !card.matches('.evidence-card, .google-certificate')) return;
      const bounds = lane.getBoundingClientRect();
      const rect = card.getBoundingClientRect();
      const padding = 8;
      if (rect.left < bounds.left + padding) lane.scrollLeft += rect.left - bounds.left - padding;
      else if (rect.right > bounds.right - padding) lane.scrollLeft += rect.right - bounds.right + padding;
    });
  });
  const dialog = document.querySelector<HTMLDialogElement>('.evidence-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('.evidence-dialog-caption');
  document.querySelectorAll<HTMLAnchorElement>('[data-evidence]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (image) { image.src = link.href; image.alt = link.dataset.caption || ''; }
    if (caption) caption.textContent = link.dataset.caption || '';
    dialog.showModal();
  }));
  dialog.querySelector('.evidence-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}
