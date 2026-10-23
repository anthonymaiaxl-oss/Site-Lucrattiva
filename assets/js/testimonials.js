(() => {
  'use strict';
  const entries = window.LUCRATTIVA?.testimonials;
  const text = value => typeof value === 'string' ? value.trim() : '';
  const approved = (Array.isArray(entries) ? entries : []).filter(entry =>
    entry && entry.approved === true && text(entry.quote) && text(entry.name)
  );
  const create = (tag, className, value) => {
    const el = document.createElement(tag);
    el.className = className;
    if (value !== undefined) el.textContent = value;
    return el;
  };
  document.querySelectorAll('[data-testimonials]').forEach(section => {
    const grid = section.querySelector('[data-testimonials-grid]');
    const empty = section.querySelector('[data-testimonials-empty]');
    if (!grid) return;
    const limit = Number(section.getAttribute('data-testimonials-limit'));
    const visible = limit > 0 ? approved.slice(0, limit) : approved;
    const cards = visible.map(entry => {
      const card = create('figure', 'testimonial-card');
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
  });
})();
