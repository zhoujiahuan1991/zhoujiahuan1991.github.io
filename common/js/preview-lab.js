(() => {
  const nav = document.querySelector('.navbar.navbar-default');
  const content = nav?.nextElementSibling;
  if (!nav || !content) return;
  document.body.classList.add('lab-page');
  content.classList.add('content');

  const list = nav.querySelector('.navbar-nav');
  const links = [
    ['Home', 'index.html#top'], ['About', 'index.html#about'], ['News', 'index.html#news'],
    ['Research', 'index.html#direct'], ['Publications', 'publications.html'],
    ['People', '#member'], ['Patents', 'patents.html'],
    ['Events', 'events.html'], ['Demos', 'demos.html'], ['Contact', 'contact.html']
  ];
  if (list) {
    list.replaceChildren(...links.map(([label, href], index) => {
      const item = document.createElement('li');
      if (index === 5) item.className = 'active';
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
  labLogo.src = 'common/img/ov3-lab-logo.png';
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

  const intro = document.querySelector('#introduction + section');
  if (intro) {
    intro.classList.add('lab-hero');
    intro.innerHTML = '<div class="lab-hero-content"><p class="lab-hero-kicker">WANGXUAN INSTITUTE · PEKING UNIVERSITY</p><h1>OV³ Lab</h1><p class="lab-hero-motto">See Beyond. Think Across. Discover What\'s Next.</p><p class="lab-hero-description">We explore computer vision, multi-modal learning and AI4Science, with an interest in intelligence that can learn and adapt in open environments.</p><div class="lab-hero-actions"><a href="#member">Meet our people ↗</a><a href="publications.html">Explore publications</a><a href="contact.html">Join the lab</a></div></div>';
  }

  const newsAnchor = document.getElementById('news');
  if (newsAnchor) {
    newsAnchor.nextElementSibling?.remove();
    newsAnchor.remove();
  }

  const memberSection = document.querySelector('#member + section');
  const memberGroups = memberSection && [...memberSection.querySelectorAll('.perpic > p')];
  const phdHeading = memberGroups?.find(item => /^PhD:/i.test(item.textContent.trim()));
  const phdGrid = phdHeading?.nextElementSibling;
  const hanCard = [...(memberSection?.querySelectorAll('.perpic .w18') || [])]
    .find(card => card.querySelector(':scope > p')?.textContent.trim() === 'Han Yang');
  if (hanCard && phdGrid?.classList.contains('part1')) {
    const mark = hanCard.querySelector('.mark');
    if (mark) {
      const role = document.createElement('p');
      role.textContent = 'PhD';
      const period = document.createElement('p');
      period.textContent = '2027(Future)';
      mark.append(role, period);
    }
    phdGrid.append(hanCard);
  }

  const alumniOriginal = memberSection?.querySelector('.perpic > table');
  if (alumniOriginal) {
    const table = document.createElement('table');
    table.className = 'alumni-table';
    const head = document.createElement('thead');
    const header = document.createElement('tr');
    ['Name', 'Type', 'Institution', 'Period'].forEach(label => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = label;
      header.append(th);
    });
    head.append(header);
    const body = document.createElement('tbody');
    [...alumniOriginal.querySelectorAll('tr')].forEach(originalRow => {
      let values = [...originalRow.querySelectorAll('td')].map(cell => cell.textContent.trim());
      if (values.length === 5 && values[0] === values[1]) values = [values[0], values[2], values[3], values[4]];
      else if (values.length > 4) values = values.slice(0, 4);
      if (values.length !== 4 || !values[0]) return;
      const row = document.createElement('tr');
      values.forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.append(cell);
      });
      body.append(row);
    });
    table.append(head, body);
    const wrap = document.createElement('div');
    wrap.className = 'alumni-table-wrap';
    wrap.append(table);
    alumniOriginal.replaceWith(wrap);
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
      .find(value => /^\d{4}\s*(?:~\s*(?:Now|\d{4})|\(Future\))$/i.test(value));
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
      const rings = document.createElement('div');
      rings.className = 'lives-rings';
      const groups = [
        { label: '2026', photos: photos.filter(photo => photo.year === '2026') },
        { label: '2025', photos: photos.filter(photo => photo.year === '2025') },
        { label: '2024 & Earlier', photos: photos.filter(photo => Number(photo.year) <= 2024) }
      ];
      groups.forEach((group, groupIndex) => {
        if (!group.photos.length) return;
        const ring = document.createElement('section');
        ring.className = 'lives-ring';
        const heading = document.createElement('h4');
        heading.className = 'lives-ring-heading';
        heading.textContent = group.label;
        const stage = document.createElement('div');
        stage.className = 'lives-stage';
        stage.setAttribute('role', 'region');
        stage.setAttribute('aria-label', `${group.label} lab photos, slowly rotating`);
        stage.style.setProperty('--ring-index', groupIndex);
        const centre = document.createElement('div');
        centre.className = 'lives-centre';
        centre.setAttribute('aria-hidden', 'true');
        centre.textContent = group.label;
        const orbit = document.createElement('div');
        orbit.className = 'lives-orbit';
        group.photos.forEach((photo, index) => {
          const card = document.createElement('article');
          card.className = 'lives-orbit-card';
          const angle = index * 360 / group.photos.length;
          card.style.setProperty('--angle', `${angle}deg`);
          card.style.setProperty('--counter-angle', `${-angle}deg`);
          const image = photo.image.cloneNode(true);
          image.alt = photo.caption;
          const caption = document.createElement('p');
          caption.textContent = photo.caption;
          card.append(image, caption);
          orbit.append(card);
        });
        [...orbit.children].forEach(card => {
          const repeat = card.cloneNode(true);
          repeat.classList.add('lives-orbit-card--duplicate');
          repeat.setAttribute('aria-hidden', 'true');
          repeat.querySelector('img')?.setAttribute('alt', '');
          orbit.append(repeat);
        });
        stage.append(centre, orbit);
        ring.append(heading, stage);
        rings.append(ring);
      });
      lives.querySelector('h3')?.after(rings);
      lives.classList.add('lives-enhanced');
    }
  }
})();
