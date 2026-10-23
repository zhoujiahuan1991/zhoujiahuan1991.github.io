(() => {
  const nav = document.querySelector('.navbar.navbar-default');
  const content = nav?.nextElementSibling;
  if (!nav || !content) return;
  document.body.classList.add('lab-page');
  content.classList.add('content');

  const list = nav.querySelector('.navbar-nav');
  const links = [
    ['Home', 'index.html#top'], ['News', 'index.html#news'],
    ['Research', 'index.html#direct'], ['Publications', 'publications.html'],
    ['Members', '#member'], ['Patents', 'patents.html'],
    ['Fundings', 'events.html'], ['Demos', 'demos.html'], ['Contact', 'contact.html']
  ];
  if (list) {
    list.replaceChildren(...links.map(([label, href], index) => {
      const item = document.createElement('li');
      if (label === 'Members') item.className = 'active';
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      item.append(link);
      return item;
    }));
  }

  const labBrand = document.createElement('a');
  labBrand.className = 'lab-brand';
  labBrand.href = '#member';
  labBrand.setAttribute('aria-label', 'OV³ Lab · Lab members');
  const labLogo = document.createElement('img');
  labLogo.className = 'lab-brand-logo';
  labLogo.src = 'common/img/ov3-lab-logo-new.png?v=20261022';
  labLogo.alt = 'OV³ Lab · 开放视界实验室';
  labLogo.width = 2000;
  labLogo.height = 640;
  labBrand.append(labLogo);
  nav.prepend(labBrand);

  const brand = document.createElement('a');
  brand.className = 'site-brand';
  brand.href = 'index.html#top';
  brand.setAttribute('aria-label', 'Peking University · Back to top');
  const logo = document.createElement('img');
  logo.className = 'site-brand-logo';
  logo.src = 'common/img/pku-logo.png';
  logo.alt = '北京大学 · Peking University';
  logo.width = 852;
  logo.height = 240;
  brand.append(logo);
  nav.append(brand);
  const updateCompactNav = () => document.body.classList.toggle('nav-scrolled', window.scrollY > 80);
  window.addEventListener('scroll', updateCompactNav, { passive: true });
  updateCompactNav();

  const intro = document.querySelector('#introduction + section');
  intro?.remove();
  document.getElementById('introduction')?.remove();

  const newsAnchor = document.getElementById('news');
  if (newsAnchor) {
    newsAnchor.nextElementSibling?.remove();
    newsAnchor.remove();
  }

  const memberSection = document.querySelector('#member + section');
  memberSection?.querySelectorAll('.perpic > p').forEach(heading => {
    heading.textContent = heading.textContent.trim().replace(/:\s*$/, '');
  });
  const memberGroups = memberSection && [...memberSection.querySelectorAll('.perpic > p')];
  const phdHeading = memberGroups?.find(item => /^PhD$/i.test(item.textContent.trim()));
  const phdGrid = phdHeading?.nextElementSibling;
  const hanCard = [...(memberSection?.querySelectorAll('.perpic .w18') || [])]
    .find(card => card.querySelector(':scope > p')?.textContent.trim() === 'Han Yang');
  if (hanCard && phdGrid?.classList.contains('part1')) {
    const mark = hanCard.querySelector('.mark');
    if (mark) {
      const role = document.createElement('p');
      role.textContent = 'PhD';
      const period = document.createElement('p');
      period.textContent = '2027';
      mark.append(role, period);
    }
    phdGrid.append(hanCard);
  }

  const alumniOriginal = memberSection?.querySelector('.perpic > table');
  if (alumniOriginal) {
    const table = document.createElement('table');
    table.className = 'alumni-table members-alumni-table';
    const head = document.createElement('thead');
    const header = document.createElement('tr');
    ['No.', 'Name', 'Degree', 'Institution', 'Start time', 'End time'].forEach(label => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = label;
      header.append(th);
    });
    head.append(header);
    const body = document.createElement('tbody');
    body.id = 'member-alumni-rows';
    [...alumniOriginal.querySelectorAll('tr')].forEach(originalRow => {
      let values = [...originalRow.querySelectorAll('td')].map(cell => cell.textContent.trim());
      if (values.length === 5 && values[0] === values[1]) values = [values[0], values[2], values[3], values[4]];
      else if (values.length > 4) values = values.slice(0, 4);
      if (values.length !== 4 || !values[0]) return;
      const times = values[3].split(/\s+[-–~]\s+/);
      values = [values[0], values[1], values[2], times[0] || '—', times[1] || '—'];
      const row = document.createElement('tr');
      const number = document.createElement('td');
      number.textContent = String(body.rows.length + 1);
      row.append(number);
      values.forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.append(cell);
      });
      body.append(row);
    });
    // Center each column's text block while retaining a shared left edge.
    const measure = document.createElement('canvas').getContext('2d');
    measure.font = '15px Arial';
    const rows = [...body.rows];
    for (let column = 1; column < 6; column++) {
      const widest = Math.ceil(Math.max(0, ...rows.map(row => measure.measureText(row.cells[column].textContent).width))) + 2;
      table.style.setProperty(`--alumni-text-${column + 1}`, `${widest}px`);
      rows.forEach(row => {
        const cell = row.cells[column];
        const text = document.createElement('span');
        text.className = 'alumni-cell-text';
        text.textContent = cell.textContent;
        cell.replaceChildren(text);
      });
    }
    table.append(head, body);
    const wrap = document.createElement('div');
    wrap.className = 'alumni-table-wrap';
    wrap.append(table);
    alumniOriginal.replaceWith(wrap);
    if (rows.length > 10) {
      rows.slice(10).forEach(row => { row.hidden = true; });
      const controls = document.createElement('div');
      controls.className = 'alumni-table-controls';
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'alumni-table-toggle';
      toggle.setAttribute('aria-controls', body.id);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Show More';
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') !== 'true';
        rows.slice(10).forEach(row => { row.hidden = !expanded; });
        toggle.setAttribute('aria-expanded', String(expanded));
        toggle.textContent = expanded ? 'Show Less' : 'Show More';
      });
      controls.append(toggle);
      wrap.after(controls);
    }
  }

  const livesAnchor = document.getElementById('Lives');
  if (livesAnchor) {
    const honorsAnchor = document.createElement('p');
    honorsAnchor.id = 'honors';
    const honors = document.createElement('section');
    honors.className = 'honors-panel';
    const heading = document.createElement('h3');
    heading.textContent = 'Honors';
    const record = document.createElement('div');
    record.id = 'honors-record';
    honors.append(heading, record);
    livesAnchor.before(honorsAnchor, honors);
  }

  const newsHighlight = /National Young Scientists Funding Program|Joined Peking University|(?:IEEE\s+)?(?:TPAMI|T-?IFS|TCSVT|TIP|IJCV)|ACM\s+(?:TOMM|MM)(?:[’']?\d{2,4})?|Nature\s+(?:Communications|Synthesis)|(?:NeurIPS|NeurIP|ICCV|CVPR|ECCV|ICLR|ICML|AAAI|IJCAI|BMVC|ICME|ICPR|PRCV|ICIG|VCIP|China3DV)[’']?\d{2,4}/gi;
  document.querySelectorAll('#news + section .news-item').forEach(item => {
    const paragraph = item.querySelector('p');
    if (!paragraph) return;
    const text = paragraph.textContent.replace(/\s+/g, ' ').trim();
    const match = text.match(/^(\d{2}\.\d{2}\.\d{4}|\d{2}\.\d{4}),?\s*/);
    if (!match) return;
    const message = text.slice(match[0].length);
    paragraph.replaceChildren();
    let last = 0;
    for (const important of message.matchAll(newsHighlight)) {
      paragraph.append(document.createTextNode(message.slice(last, important.index)));
      const strong = document.createElement('strong');
      strong.className = 'news-highlight';
      strong.textContent = important[0];
      paragraph.append(strong);
      last = important.index + important[0].length;
    }
    paragraph.append(document.createTextNode(message.slice(last)));
    const date = document.createElement('span');
    date.className = 'news-date';
    date.textContent = match[1];
    item.prepend(date);
  });
  ['show-more', 'show-less'].forEach(id => {
    const control = document.getElementById(id);
    if (!control) return;
    control.setAttribute('role', 'button');
    control.tabIndex = 0;
    control.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); control.click(); }
    });
  });

  document.querySelectorAll('.perpic .w18').forEach(card => {
    const mark = card.querySelector('.mark');
    const visibleName = card.querySelector(':scope > p')?.textContent?.trim() || 'Lab member';
    const photo = card.querySelector('img');
    if (photo) photo.alt = visibleName;
    const time = [...(mark?.querySelectorAll('p') || [])]
      .map(paragraph => paragraph.textContent.trim())
      .find(value => /^\d{4}(?:\s*~\s*(?:Now|\d{4})|\s*\(Future\))?$/i.test(value));
    if (time) {
      const timeLabel = document.createElement('span');
      timeLabel.className = 'member-time';
      timeLabel.textContent = time;
      card.append(timeLabel);
    }
    const originalLink = mark?.querySelector('a[href]');
    if (originalLink) {
      const link = originalLink.cloneNode(true);
      link.className = 'member-link';
      link.textContent = 'Homepage ↗';
      card.append(link);
    }
    if (visibleName === 'Han Yang') {
      const coSupervision = document.createElement('span');
      coSupervision.className = 'member-note';
      coSupervision.textContent = 'Jointly supervised with Prof. Ruqiang Zou';
      card.append(coSupervision);
    }
  });

  const lives = document.querySelector('#Lives + section');
  if (lives) {
    const originals = [...lives.querySelectorAll('.layouter .layout')];
    const photos = originals.map(item => {
      const image = item.querySelector('img');
      const caption = item.querySelector('.layout-number')?.textContent?.trim() || '';
      return image && caption ? { image, caption, year: caption.match(/20\d{2}/)?.[0] || '' } : null;
    }).filter(Boolean);
    if (photos.length) {
      const years = ['All', ...new Set(photos.map(photo => photo.year).filter(Boolean))].sort((a, b) => a === 'All' ? -1 : b === 'All' ? 1 : Number(b) - Number(a));
      const controls = document.createElement('div');
      controls.className = 'lives-timeline';
      const selected = document.createElement('output');
      selected.textContent = 'All years';
      const range = document.createElement('input');
      range.type = 'range';
      range.min = '0';
      range.max = String(years.length - 1);
      range.step = '1';
      range.value = '0';
      range.setAttribute('aria-label', 'Filter lab photos by year');
      const labels = document.createElement('div');
      labels.className = 'lives-timeline-labels';
      years.forEach((year, index) => {
        const label = document.createElement('button');
        label.type = 'button';
        label.textContent = year;
        label.addEventListener('click', () => { range.value = String(index); range.dispatchEvent(new Event('input')); });
        labels.append(label);
      });
      controls.append(selected, range, labels);
      const gallery = document.createElement('div');
      gallery.className = 'lives-gallery';
      photos.forEach(photo => {
        const card = document.createElement('figure');
        card.className = 'lives-photo';
        card.dataset.year = photo.year;
        const image = photo.image.cloneNode(true);
        image.alt = photo.caption;
        image.loading = 'lazy';
        const caption = document.createElement('figcaption');
        caption.textContent = photo.caption;
        card.append(image, caption);
        gallery.append(card);
      });
      range.addEventListener('input', () => {
        const year = years[Number(range.value)];
        selected.textContent = year === 'All' ? 'All years' : year;
        [...gallery.children].forEach(card => { card.hidden = year !== 'All' && card.dataset.year !== year; });
        [...labels.children].forEach((button, index) => { button.classList.toggle('active', index === Number(range.value)); });
      });
      range.dispatchEvent(new Event('input'));
      lives.querySelector('h3')?.after(controls, gallery);
      lives.classList.add('lives-enhanced');
    }
  }
})();
