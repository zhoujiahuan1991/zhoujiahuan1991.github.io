(() => {

  const gridIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>';
  const listIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 5h16M4 12h16M4 19h16"/></svg>';

  function enhance() {
    const widget = document.querySelector('.publication-widget');
    const section = document.querySelector('#paper + section');
    const years = widget?.querySelector('.year-filters');
    const cards = widget?.querySelector('.paper-cards');
    const sourceItems = section?.querySelectorAll('[id="0000"] ol > li');
    if (!years || !cards || !sourceItems?.length) return false;
    if (years.querySelector('.paper-view-toggle')) return true;

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'paper-view-toggle';
    toggle.setAttribute('aria-pressed', 'false');
    toggle.setAttribute('aria-label', 'Switch to single-column view');
    toggle.title = 'Switch to single-column view';
    toggle.innerHTML = gridIcon;
    toggle.addEventListener('click', () => {
      const single = widget.classList.toggle('is-single-view');
      toggle.setAttribute('aria-pressed', String(single));
      toggle.setAttribute('aria-label', single ? 'Switch to multi-column view' : 'Switch to single-column view');
      toggle.title = single ? 'Switch to multi-column view' : 'Switch to single-column view';
      toggle.innerHTML = single ? listIcon : gridIcon;
    });
    years.append(toggle);
    const controls = widget.querySelector('.publication-controls');
    if (controls) controls.append(years);
    const search = controls?.querySelector('.paper-search');
    if (search && !search.closest('label')) {
      const label = document.createElement('label');
      label.className = 'publication-filter-label publication-search-label';
      label.textContent = 'Search';
      search.replaceWith(label);
      label.append(search);
    }
    {
      const options = [...years.querySelectorAll('.year-filter')];
      const label = document.createElement('label');
      label.className = 'publication-filter-label publication-year-label';
      label.append(document.createTextNode('Year'));
      const select = document.createElement('select');
      select.className = 'paper-topic publication-year-select';
      select.setAttribute('aria-label', 'Publication year');
      options.forEach(button => {
        const option = document.createElement('option');
        option.value = button.dataset.year || button.getAttribute('href');
        option.textContent = button.textContent;
        option.selected = button.classList.contains('active');
        select.append(option);
        button.hidden = true;
        button.style.display = 'none';
      });
      select.addEventListener('change', () => {
        options.find(button => (button.dataset.year || button.getAttribute('href')) === select.value)?.click();
      });
      label.append(select);
      years.insertBefore(label, toggle);
    }


    function decorateCards() {
      cards.querySelectorAll('.paper-card').forEach(card => {
        if (card.querySelector('.paper-full-citation')) return;
        const number = Number(card.querySelector('.paper-year-number')?.textContent);
        const original = sourceItems[number - 1]?.querySelector('p');
        const body = card.querySelector('.paper-body');
        if (!original || !body) return;
        const citation = document.createElement('p');
        citation.className = 'paper-full-citation';
        for (const node of original.childNodes) {
          if (node.nodeName === 'BR') break;
          citation.append(node.cloneNode(true));
        }
        citation.querySelectorAll('.tag-container, .tag').forEach(tag => tag.remove());
        citation.querySelectorAll('b, strong').forEach(name => {
          if (/\bJiahuan\s+Zhou\b|周嘉欢/i.test(name.textContent)) name.classList.add('paper-highlight-author');
        });
        body.append(citation);
      });
    }

    new MutationObserver(decorateCards).observe(cards, { childList: true });
    decorateCards();
    return true;
  }

  if (!enhance()) {
    const waiting = new MutationObserver(() => {
      if (enhance()) waiting.disconnect();
    });
    waiting.observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
  }
})();
