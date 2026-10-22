(() => {
  document.body.classList.add('member-page');
  const nav = document.querySelector('.navbar.navbar-default');
  const content = nav?.nextElementSibling;
  if (!nav || !content) return;
  content.classList.add('content');
  const links = [
    ['Home', '../index.html#top'], ['News', '../index.html#news'],
    ['Research', '../index.html#direct'], ['Publications', '../publications.html'],
    ['People', '../research.html#member'],
    ['Patents', '../patents.html'], ['Projects', '../events.html'], ['Demos', '../demos.html'], ['Contact', '../contact.html']
  ];
  const list = nav.querySelector('.navbar-nav');
  list.replaceChildren(...links.map(([label, href]) => {
    const item = document.createElement('li');
    if (label === 'People') item.className = 'active';
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.textContent = label;
    item.append(anchor);
    return item;
  }));
  const brand = (className, href, source, alt) => {
    const anchor = document.createElement('a');
    anchor.className = className;
    anchor.href = href;
    anchor.setAttribute('aria-label', alt);
    const image = document.createElement('img');
    image.className = `${className}-logo`;
    image.src = source;
    image.alt = alt;
    anchor.append(image);
    return anchor;
  };
  nav.prepend(brand('lab-brand', '../research.html#member', '../common/img/ov3-lab-logo.png', 'OV³ Lab · 开放视界实验室'));
  nav.append(brand('site-brand', '../index.html#top', '../common/img/pku-logo.png', '北京大学 · Peking University'));
  const updateCompactNav = () => document.body.classList.toggle('nav-scrolled', window.scrollY > 80);
  window.addEventListener('scroll', updateCompactNav, { passive: true });
  updateCompactNav();

  const categories = [
    [/^Education$/i, 'member-education', 'Education'],
    [/^Awards and Honors$/i, 'member-honors', 'Honors'],
    [/^Research Interests$/i, 'member-research', 'Research'],
    [/^Publications$/i, 'member-publications', 'Publications'],
    [/^Academic Service$/i, 'member-service', 'Service']
  ];
  const sections = [...content.querySelectorAll(':scope > section')];
  const hero = sections[0];
  hero.classList.add('member-hero');
  hero.id = 'member-about';
  sections.slice(1).forEach(section => {
    const heading = section.querySelector('h3');
    const match = categories.find(([pattern]) => pattern.test(heading?.textContent.trim() || ''));
    if (match) section.id = match[1];
  });

  const awardSection = document.getElementById('member-honors');
  const awardList = awardSection?.querySelector('ul');
  if (awardList) {
    const awards = document.createElement('div');
    awards.className = 'member-award-list';
    [...awardList.querySelectorAll('li')].forEach(item => {
      const raw = (item.querySelector(':scope > p')?.textContent || item.firstChild?.textContent || '')
        .replace(/\s+/g, ' ').trim();
      if (!raw) return;
      const date = raw.match(/(?:,\s*|\s+)(20\d{2}(?:\s*[~–-]\s*20\d{2})?)$/);
      const row = document.createElement('div');
      row.className = 'member-award-row';
      const title = document.createElement('strong');
      title.textContent = date ? raw.slice(0, date.index).trim() : raw;
      const year = document.createElement('span');
      year.textContent = date?.[1] || '—';
      row.append(title, year);
      awards.append(row);
    });
    if (awards.children.length) {
      awardList.before(awards);
      awardList.classList.add('member-awards-original');
    }
  }

  const paperSection = document.getElementById('member-publications');
  const paperList = paperSection?.querySelector('ol, ul');
  if (paperList) {
    const paperCardsByTitle = new Map();
    const paperKey = title => title.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
    const journalFactors = {
      TPAMI: { source: 'https://www.bioxbio.com/journal/IEEE-T-PATTERN-ANAL', values: { 2026: ['2025', '20.4'], 2025: ['2025', '20.4'], 2024: ['2024', '18.6'], 2023: ['2023', '20.8'], 2022: ['2022', '23.6'], 2020: ['2020', '16.389'] } },
      TIFS: { source: 'https://www.bioxbio.com/journal/IEEE-T-INF-FOREN-SEC', values: { 2025: ['2025', '8.7'], 2024: ['2024', '8.0'] } },
      IJCV: { source: 'https://www.bioxbio.com/journal/INT-J-COMPUT-VISION', values: { 2024: ['2024', '9.3'] } },
      TIP: { source: 'https://www.bioxbio.com/journal/IEEE-T-IMAGE-PROCESS', values: { 2017: ['2017', '5.071'] } },
      TCSVT: { source: 'https://www.bioxbio.com/journal/IEEE-T-CIRC-SYST-VID', values: { 2023: ['2023', '8.3'] } },
      TOMM: { source: 'https://www.bioxbio.com/journal/ACM-T-MULTIM-COMPUT', values: { 2024: ['2024', '6.0'] } },
      'Nat. Commun': { source: 'https://www.bioxbio.com/journal/NAT-COMMUN', values: { 2024: ['2024', '15.7'] } },
      'Nat. Synth': { source: 'https://journalsimpactfactors.com/journal.php?id=164', values: { 2024: ['2024', '20.0'] } }
    };
    const venuePattern = /(?:ACM\s+MM|NeurIPS|ICML|ICLR|CVPR|ICCV|ECCV|AAAI|AAMAS|IJCAI|ICPR|PRCV|ICIG|ICIC|VCIP|BMVC|ICME|TPAMI|TIFS|TCSVT|TOMM|IJCV|TIP|TMC|ESWA|CN|IVC|KBS|NN|Nat\. Commun|Nat\. Synth)(?:[’']?\d{2,4})?(?:,?\s*(?:Spotlight|Oral|Poster))?/i;
    const otherJournals = /^(?:TMC|ESWA|CN|IVC|KBS|NN)(?:[’']|$)/i;
    const grid = document.createElement('div');
    grid.className = 'member-paper-grid';
    const paperCountsByYear = new Map();
    [...paperList.querySelectorAll('li')].forEach(item => {
      const raw = item.textContent.replace(/\s+/g, ' ').trim();
      if (!raw) return;
      const titleMatch = raw.match(/[“"]([^”"]+)[”"]/);
      const venueText = [...item.querySelectorAll('strong')].map(node => node.textContent.trim())
        .find(text => venuePattern.test(text)) || raw.match(venuePattern)?.[0] || 'Publication';
      const venue = venueText.replace(/[()]/g, '').trim();
      const year = venue.match(/[’'](\d{2,4})/)?.[1];
      const fullYear = year ? (year.length === 2 ? String(2000 + Number(year)) : year) : raw.match(/\b20\d{2}\b/)?.[0];
      const paperYear = fullYear || 'Earlier';
      const yearNumber = (paperCountsByYear.get(paperYear) || 0) + 1;
      paperCountsByYear.set(paperYear, yearNumber);
      const authors = titleMatch ? raw.slice(0, titleMatch.index).replace(/^\s*\([^)]*\)\s*[-–]?\s*/, '').trim().replace(/[,\s]+$/, '') : '';
      const details = titleMatch ? raw.slice(titleMatch.index + titleMatch[0].length).replace(/^\s*,\s*/, '').replace(/\s*\[(?:pdf|bib|doi|code)[^\]]*\]/gi, '').trim() : raw;
      const card = document.createElement('article');
      card.className = 'paper-card member-paper-card';
      const number = document.createElement('span');
      number.className = 'paper-year-number';
      number.textContent = String(yearNumber);
      number.setAttribute('aria-label', `${paperYear} publication number ${yearNumber}`);
      card.append(number);
      const body = document.createElement('div');
      body.className = 'paper-body';
      const meta = document.createElement('div');
      meta.className = 'paper-meta';
      const label = document.createElement('span');
      label.className = 'paper-venue';
      label.textContent = venue;
      meta.append(label);
      const journalKey = Object.keys(journalFactors).find(key => venue.startsWith(key));
      if (journalKey) {
        const journal = journalFactors[journalKey];
        const impact = journal.values[fullYear];
        const badge = document.createElement('a');
        badge.className = `paper-jif${impact ? '' : ' paper-jif--unverified'}`;
        badge.href = journal.source;
        badge.target = '_blank';
        badge.rel = 'noopener noreferrer';
        badge.textContent = impact ? `IF ${impact[1]}` : 'IF 未核实';
        meta.append(badge);
      } else if (otherJournals.test(venue)) {
        const badge = document.createElement('span');
        badge.className = 'paper-jif paper-jif--unverified';
        badge.textContent = 'IF 待核实';
        meta.append(badge);
      }
      body.append(meta);
      if (titleMatch) {
        const title = document.createElement('h4');
        title.className = 'paper-display-title';
        title.textContent = titleMatch[1];
        body.append(title);
      }
      if (authors) {
        const byline = document.createElement('p');
        byline.className = 'paper-authors';
        byline.innerHTML = (item.querySelector('p')?.innerHTML || '').split(/[“"]/, 1)[0].replace(/[,\s]+$/, '');
        body.append(byline);
      }
      if (details) {
        const citation = document.createElement('p');
        citation.className = 'paper-citation';
        citation.textContent = details;
        body.append(citation);
      }
      const footer = document.createElement('div');
      footer.className = 'paper-footer';
      const resources = document.createElement('div');
      resources.className = 'paper-resources';
      [['PDF', /^pdf$/i], ['Bib', /^bib$/i], ['Code', /^code$/i], ['DOI', /^doi(?:\b|:)/i]].forEach(([label]) => {
        const button = document.createElement('span');
        button.className = 'paper-resource paper-resource--disabled';
        button.textContent = label;
        resources.append(button);
      });
      footer.append(resources);
      body.append(footer);
      card.append(body);
      if (titleMatch) paperCardsByTitle.set(paperKey(titleMatch[1]), { resources, source: item });
      grid.append(card);
    });
    if (grid.children.length) {
      paperList.before(grid);
      paperList.classList.add('member-papers-original');
    }
    window.copyTextAndNotify = async (event, value) => {
      event.preventDefault();
      try { await navigator.clipboard.writeText(value); }
      catch { const field = document.createElement('textarea'); field.value = value; document.body.append(field); field.select(); document.execCommand('copy'); field.remove(); }
    };
    fetch('../index.html').then(response => response.text()).then(html => {
      const source = new DOMParser().parseFromString(html, 'text/html');
      const mainPapers = new Map();
      source.querySelectorAll('#paper + section [id="0000"] ol > li').forEach(item => {
        const title = item.textContent.match(/[“"]([^”"]+)[”"]/ )?.[1];
        if (title) mainPapers.set(paperKey(title), item);
      });
      paperCardsByTitle.forEach(({ resources, source: memberItem }, title) => {
        const original = mainPapers.get(title) || memberItem;
        const anchors = [...original.querySelectorAll('a')];
        const base = mainPapers.has(title) ? new URL('../index.html', location.href) : location.href;
        [...resources.children].forEach(button => {
          const label = button.textContent;
          const pattern = label === 'DOI' ? /^doi(?:\b|:)/i : new RegExp(`^${label}$`, 'i');
          const found = anchors.find(anchor => pattern.test(anchor.textContent.trim()) && (anchor.getAttribute('href') || anchor.getAttribute('onclick')));
          if (found) {
            const link = found.cloneNode(true);
            link.className = 'paper-resource';
            link.textContent = label;
            if (link.getAttribute('href') && link.getAttribute('href') !== '#') link.href = new URL(link.getAttribute('href'), base).href;
            button.replaceWith(link);
          } else if (label === 'DOI') {
            const doi = memberItem.textContent.match(/\b10\.\d{4,9}\/[^\s,;]+/i)?.[0]?.replace(/[.)]+$/, '');
            if (doi) {
              const link = document.createElement('a');
              link.className = 'paper-resource';
              link.href = `https://doi.org/${doi}`;
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
              link.textContent = 'DOI';
              button.replaceWith(link);
            }
          }
        });
      });
    }).catch(error => console.error('Member paper links could not be mapped:', error));
  }

  const original = hero.querySelector('.my-auto');
  const portrait = original?.querySelector('img');
  if (original && portrait) {
    const portraitParagraph = portrait.closest('p');
    const frame = document.createElement('div');
    frame.className = 'member-portrait-frame';
    portrait.removeAttribute('align');
    portrait.removeAttribute('hspace');
    portrait.removeAttribute('border');
    portrait.removeAttribute('width');
    portrait.removeAttribute('height');
    frame.append(portrait);
    portraitParagraph?.remove();
    original.querySelectorAll('br').forEach(item => item.remove());
    const biography = [...original.querySelectorAll(':scope > p')].filter(item => item.textContent.trim().length > 110);
    const grid = document.createElement('div');
    grid.className = 'member-hero-grid';
    const copy = document.createElement('div');
    copy.className = 'member-profile-copy';
    while (original.firstChild) copy.append(original.firstChild);
    biography.forEach(item => item.remove());
    const back = document.createElement('a');
    back.className = 'member-back';
    back.href = '../research.html#member';
    back.textContent = '← Back to Lab Members';
    copy.prepend(back);
    const researchSection = document.getElementById('member-research');
    const interestCard = document.createElement('aside');
    const interestList = document.createElement('div');
    interestCard.className = 'member-interests-card';
    interestCard.setAttribute('aria-label', 'Research Interests');
    interestList.className = 'member-interest-list';
    const interests = researchSection ? [...researchSection.querySelectorAll('li')]
      .flatMap(item => item.textContent.split(',').map(value => value.trim()).filter(Boolean)) : [];
    if (interests.length) {
      grid.classList.add('member-hero-grid--interests');
      const heading = document.createElement('h4');
      heading.textContent = 'Research Interests';
      interestCard.append(heading);
      interests.forEach(value => {
        const chip = document.createElement('span');
        chip.className = 'member-interest-chip';
        chip.textContent = value;
        interestList.append(chip);
      });
      interestCard.append(interestList);
      document.getElementById('direct')?.remove();
      interestCard.id = 'direct';
      researchSection.remove();
      grid.append(copy, interestCard, frame);
    } else {
      grid.append(copy, frame);
    }
    original.append(grid);
    if (biography.length) {
      const bio = document.createElement('div');
      bio.className = 'member-bio';
      biography.forEach(item => bio.append(item));
      original.append(bio);
    }
    const name = original.querySelector('h3')?.textContent.trim();
    if (name) document.title = `${name} · OV³ Lab`;
  }

  const subnav = document.createElement('nav');
  subnav.className = 'member-subnav';
  subnav.setAttribute('aria-label', 'Member sections');
  [['About', 'member-about'], ...categories.filter(([, id]) => document.getElementById(id)).map(([, id, label]) => [label, id])].forEach(([label, id]) => {
    const anchor = document.createElement('a');
    anchor.href = `#${id}`;
    anchor.textContent = label;
    subnav.append(anchor);
  });
  nav.after(subnav);
})();
