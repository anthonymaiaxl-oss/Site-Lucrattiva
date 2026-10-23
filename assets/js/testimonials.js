(() => {
  'use strict';
  const cfg = window.LUCRATTIVA || {};
  const entries = cfg.testimonials;
  const text = value => typeof value === 'string' ? value.trim() : '';
  const approved = (Array.isArray(entries) ? entries : []).filter(entry =>
    entry && entry.approved === true && text(entry.quote) && text(entry.name)
  );
  const showExamples = approved.length === 0 && cfg.showTestimonialExamples === true;
  const examples = showExamples && Array.isArray(cfg.testimonialExamples)
    ? cfg.testimonialExamples.filter(entry => entry && text(entry.quote) && text(entry.name)) : [];
  const display = approved.length ? approved : examples;
  const create = (tag, className, value) => {
    const el = document.createElement(tag);
    el.className = className;
    if (value !== undefined) el.textContent = value;
    return el;
  };
  document.querySelectorAll('[data-testimonials]').forEach(section => {
    const grid = section.querySelector('[data-testimonials-grid]');
    const empty = section.querySelector('[data-testimonials-empty]');
    const notice = section.querySelector('[data-testimonials-example-notice]');
    if (!grid) return;
    const limit = Number(section.getAttribute('data-testimonials-limit'));
    const visible = limit > 0 ? display.slice(0, limit) : display;
    const cards = visible.map(entry => {
      const card = create('figure', 'testimonial-card');
      if (showExamples) card.append(create('span', 'testimonial-example-badge', 'Depoimento de teste · fictício'));
      const mark = create('span', 'testimonial-mark', '“');
      mark.setAttribute('aria-hidden', 'true');
      const quote = create('blockquote', 'testimonial-quote', text(entry.quote));
      const caption = create('figcaption', 'testimonial-person');
      caption.append(create('strong', 'testimonial-name', text(entry.name)));
      const detail = [text(entry.role), text(entry.company)].filter(Boolean).join(' · ');
      if (detail) caption.append(create('span', 'testimonial-detail', detail));
      card.append(mark, quote, caption);
      return card;
    });
    grid.replaceChildren(...cards);
    grid.hidden = !cards.length;
    if (empty) empty.hidden = !!cards.length;
    if (notice) notice.hidden = !(showExamples && cards.length);
  });
})();
