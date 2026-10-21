(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text != null) element.textContent = text;
    return element;
  };
  const normalize = value => (value || '').replace(/\s+/g, ' ').trim();
  // JIF is a journal-level metric for the named year, not a paper-level score.
  // For papers dated 2026, the latest released year is 2025 (2026 JCR).
  // Each source page contains the year-by-year figure used below.
  const journalFactors = {
    TPAMI: { source: 'https://www.bioxbio.com/journal/IEEE-T-PATTERN-ANAL', values: { 2026: ['2025', '20.4'], 2025: ['2025', '20.4'], 2024: ['2024', '18.6'], 2023: ['2023', '20.8'], 2022: ['2022', '23.6'], 2020: ['2020', '16.389'] } },
    'Pattern Recognition': { source: 'https://www.bioxbio.com/journal/PATTERN-RECOGN', values: { 2026: ['2025', '9.1'] } },
    TIFS: { source: 'https://www.bioxbio.com/journal/IEEE-T-INF-FOREN-SEC', values: { 2025: ['2025', '8.7'], 2024: ['2024', '8.0'] } },
    IJCV: { source: 'https://www.bioxbio.com/journal/INT-J-COMPUT-VISION', values: { 2024: ['2024', '9.3'] } },
    'Nat. Commun': { source: 'https://www.bioxbio.com/journal/NAT-COMMUN', values: { 2024: ['2024', '15.7'] } },
    'Nat. Synth': { source: 'https://journalsimpactfactors.com/journal.php?id=164', values: { 2024: ['2024', '20.0'] } },
    TOMM: { source: 'https://www.bioxbio.com/journal/ACM-T-MULTIM-COMPUT', values: { 2024: ['2024', '6.0'] } },
    TCSVT: { source: 'https://www.bioxbio.com/journal/IEEE-T-CIRC-SYST-VID', values: { 2023: ['2023', '8.3'] } },
    TIP: { source: 'https://www.bioxbio.com/journal/IEEE-T-IMAGE-PROCESS', values: { 2017: ['2017', '5.071'] } },
    '计算机科学': { source: 'https://www.jsjkx.com/CN/news/news110.shtml', values: {} }
  };
  const newsHighlight = /National Young Scientists Funding Program|Joined Peking University|(?:IEEE\s+)?(?:TPAMI|T-?IFS|TCSVT|TIP|IJCV)|ACM\s+(?:TOMM|MM)(?:[’']?\d{2,4})?|Nature\s+(?:Communications|Synthesis)|(?:NeurIPS|NeurIP|ICCV|CVPR|ECCV|ICLR|ICML|AAAI|IJCAI|BMVC|ICME|ICPR|PRCV|ICIG|VCIP|China3DV)[’']?\d{2,4}/gi;
  function highlightNews(text) {
    const fragment = document.createDocumentFragment();
    let last = 0;
    for (const match of text.matchAll(newsHighlight)) {
      fragment.append(document.createTextNode(text.slice(last, match.index)));
      fragment.append(make('strong', 'news-highlight', match[0]));
      last = match.index + match[0].length;
    }
    fragment.append(document.createTextNode(text.slice(last)));
    return fragment;
  }

  function enhanceNavigation() {
    const nav = $('.navbar.navbar-default');
    if (!nav) return;
    const labBrand = make('a', 'lab-brand');
    labBrand.href = 'research.html#member';
    labBrand.setAttribute('aria-label', 'OV³ Lab · Lab members');
    const labLogo = make('img', 'lab-brand-logo');
    labLogo.src = 'common/img/ov3-lab-logo.png';
    labLogo.alt = 'OV³ Lab · 开放视界实验室';
    labLogo.width = 2000;
    labLogo.height = 640;
    labBrand.append(labLogo);
    nav.prepend(labBrand);
    const list = $('.navbar-nav', nav);
    const links = [
      ['Home', '#top'], ['About', '#about'], ['News', '#news'],
      ['Research', '#direct'], ['Publications', '#paper'],
      ['People', 'research.html#member'], ['Honors', 'honors.html'],
      ['Patents', 'patents.html'], ['Events', 'events.html'], ['Contact', 'contact.html']
    ];
    if (list) {
      list.replaceChildren(...links.map(([label, href], index) => {
        const item = make('li', index === 0 ? 'active' : '');
        const link = make('a', '', label);
        link.href = href;
        item.append(link);
        return item;
      }));
    }

    const brand = make('a', 'site-brand');
    brand.href = '#top';
    brand.setAttribute('aria-label', 'Peking University · Back to top');
    const logo = make('img', 'site-brand-logo');
    logo.src = 'common/img/pku-logo.png';
    logo.alt = '北京大学 · Peking University';
    logo.width = 852;
    logo.height = 240;
    brand.append(logo);
    nav.append(brand);

    const banner = make('div', 'recruit-banner-wrap');
    banner.id = 'top';
    const link = make('a', 'recruit-banner');
    link.href = 'contact.html';
    [['recruit-status', 'Now Recruiting'], ['recruit-role', 'Postdoc'],
      ['recruit-role', 'PhD'], ['recruit-role', 'RA'],
      ['recruit-contact', 'Contact us ↗']].forEach(([className, label]) => link.append(make('span', className, label)));
    banner.append(link);
    nav.after(banner);
  }

  function enhanceHero() {
    const section = $('#personal + section');
    const old = section && $('.my-auto', section);
    if (!old) return;

    const name = normalize($('h3', old)?.textContent) || 'Jiahuan Zhou';
    const portraitSource = $('img', old)?.getAttribute('src') || 'common/img/zjh.png';
    const biographies = $$('p[align="justify"]', old).map(paragraph => paragraph.cloneNode(true));

    const grid = make('div', 'hero-grid');
    const copy = make('div', 'hero-copy');
    copy.append(make('h1', '', name));
    const credentials = make('div', 'hero-credentials');
    credentials.append(make('p', 'hero-credential hero-award', 'NSFC Excellent Young Scientists Fund Program (Overseas) · 国家自然科学基金优秀青年科学基金项目（海外）'));
    credentials.append(make('p', 'hero-credential', 'Excellent Young Scientists Fund Program (Overseas) 国家级人才计划青年项目（海外）入选者'));
    credentials.append(make('p', 'hero-credential', 'Peking University Boya Young Fellow 北京大学博雅青年学者,'));
    credentials.append(make('p', 'hero-credential', 'Wangxuan Institute of Computer Technology, Peking University.'));
    credentials.append(make('p', 'hero-location', 'Beijing, China'));
    copy.append(credentials);
    const principles = make('div', 'ov-principles');
    [
      ['Open Vision', '开放视觉 · 看见更多', '从封闭类别走向开放环境，从已知数据走向真实世界。'],
      ['Open View', '开放视角 · 理解更多', '突破单一视角、单一模态和单一任务的限制，构建更具泛化能力的智能系统。'],
      ['Open Venture', '开放探索 · 发现更多', '让智能走出已有知识的边界，在未知环境和新科学问题中持续学习与探索。']
    ].forEach(([title, subtitle, description]) => {
      const card = make('div', 'ov-principle');
      card.append(make('h2', '', title),
        make('strong', '', subtitle), make('p', '', description));
      principles.append(card);
    });
    copy.append(principles);

    const actions = make('div', 'hero-actions');
    const research = make('a', '', 'View Research ↗');
    research.href = '#direct';
    const publications = make('a', '', 'View Publications ↗');
    publications.href = '#paper';
    const contact = make('a', '', 'Join Our Team ↗');
    contact.href = 'contact.html';
    actions.append(research, publications, contact);
    copy.append(actions);

    const photoFrame = make('div', 'hero-photo-wrap');
    const photo = make('img', 'hero-photo');
    photo.src = portraitSource;
    photo.alt = 'Portrait of Jiahuan Zhou';
    photo.width = 280;
    photo.height = 350;
    photoFrame.append(photo);
    grid.append(copy, photoFrame);

    const about = make('section', 'about-section');
    about.id = 'about';
    about.append(make('h3', '', 'About Me'));
    const aboutGrid = make('div', 'about-grid');
    const details = make('div', 'bio-details');
    biographies.forEach(paragraph => details.append(paragraph));
    const experience = make('aside', 'experience-card');
    experience.setAttribute('aria-label', 'Education and experience');
    experience.append(make('h4', '', 'Education & Experience'));
    [
      ['Assistant Professor', 'Peking University', 'Wangxuan Institute of Computer Technology', '2022–Present', 'pku-seal.svg'],
      ['Ph.D.', 'Northwestern University', 'Electrical Engineering & Computer Science', '2013–2018', 'northwestern-seal.svg'],
      ['B.E.', 'Tsinghua University', 'Department of Automation', '2009–2013', 'tsinghua-seal.svg']
    ].forEach(([role, institution, field, period, seal]) => {
      const entry = make('div', 'experience-entry');
      const crest = make('img', 'experience-seal');
      crest.src = `common/img/${seal}`;
      crest.alt = `${institution} seal`;
      crest.width = 64;
      crest.height = 64;
      crest.loading = 'lazy';
      const copy = make('div', 'experience-copy');
      copy.append(make('span', 'experience-role', role), make('span', 'experience-period', period),
        make('strong', 'experience-institution', institution), make('span', 'experience-field', field));
      entry.append(crest, copy);
      experience.append(entry);
    });
    aboutGrid.append(details, experience);
    about.append(aboutGrid);

    old.replaceChildren(grid);
    section.classList.add('hero');
    section.id = 'home';
    section.after(about);
  }

  function enhanceNews() {
    const section = $('#news + section');
    if (!section) return;
    const originalList = $('ul', section);
    if (!originalList) return;
    const items = $$('.news-item', originalList);
    const timeline = make('div', 'news-timeline');
    timeline.setAttribute('aria-label', 'Latest news timeline');

    const dated = items.map((item, index) => {
      const paragraph = $('p', item);
      const original = normalize(paragraph?.textContent);
      const fullDate = original.match(/^(\d{2})\.(\d{2})\.(\d{4}),?\s*/);
      const monthDate = original.match(/^(\d{2})\.(\d{4}),?\s*/);
      const match = fullDate || monthDate;
      return match ? {
        day: fullDate ? fullDate[1] : '',
        month: fullDate ? fullDate[2] : monthDate[1],
        year: fullDate ? fullDate[3] : monthDate[2],
        text: original.slice(match[0].length), index
      } : null;
    }).filter(Boolean);
    const yearMap = new Map();
    dated.forEach(entry => {
      if (!yearMap.has(entry.year)) yearMap.set(entry.year, []);
      yearMap.get(entry.year).push(entry);
    });
    const groups = [];
    const rows = [];
    [...yearMap.keys()].sort((a, b) => Number(b) - Number(a)).forEach(year => {
      const group = make('section', 'news-year-group');
      group.setAttribute('aria-label', `${year} news`);
      group.append(make('h4', 'news-year-heading', year));
      const entries = make('div', 'news-year-entries');
      yearMap.get(year).forEach(entry => {
        const row = make('article', 'news-timeline-entry');
        const stamp = make('time', 'news-stamp');
        stamp.dateTime = `${entry.year}-${entry.month}${entry.day ? `-${entry.day}` : ''}`;
        stamp.append(make('span', 'news-stamp-year', entry.year), make('span', 'news-stamp-month', entry.day ? `${entry.month}.${entry.day}` : entry.month));
        const message = make('p', 'news-timeline-text');
        message.append(highlightNews(entry.text));
        row.append(stamp, make('span', 'news-timeline-dot'), message);
        entries.append(row);
        rows.push(row);
      });
      group.append(entries);
      groups.push(group);
      timeline.append(group);
    });

    const initialCount = 24;
    const toggle = make('button', 'news-more', 'View all news ↓');
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    const update = expanded => {
      rows.forEach((row, index) => { row.hidden = !expanded && index >= initialCount; });
      groups.forEach(group => { group.hidden = !$('.news-timeline-entry:not([hidden])', group); });
      toggle.textContent = expanded ? 'Show recent news ↑' : 'View all news ↓';
      toggle.setAttribute('aria-expanded', String(expanded));
    };
    toggle.addEventListener('click', () => update(toggle.getAttribute('aria-expanded') !== 'true'));
    update(false);
    if (rows.length > initialCount) timeline.append(toggle);
    originalList.after(timeline);
    section.classList.add('news-enhanced');
  }

  function readPaper(item, index) {
    const paragraph = $('p', item) || item;
    const raw = normalize(paragraph.textContent);
    const venue = normalize($('i strong', paragraph)?.textContent || $('i', paragraph)?.textContent || 'Publication');
    const titleMatch = raw.match(/["“]([^"”]+)["”]/);
    const title = titleMatch ? normalize(titleMatch[1]) : `Publication ${index + 1}`;
    const shortYear = venue.match(/[’'](\d{2})/);
    const fullYear = raw.match(/\b20\d{2}\b/);
    const year = shortYear ? String(2000 + Number(shortYear[1])) : (fullYear ? fullYear[0] : 'Earlier');
    const topics = [...new Set($$('.tag', paragraph).map(tag => normalize(tag.textContent)).filter(Boolean))];
    const sourceHtml = paragraph.innerHTML;
    const authorMatch = sourceHtml.match(/<\/i>\s*\)\s*-\s*([\s\S]*?)["“]/i);
    const authorsHtml = authorMatch ? authorMatch[1].trim().replace(/,\s*$/, '') : '';
    const details = titleMatch ? normalize(raw.slice(titleMatch.index + titleMatch[0].length).split(/\s*\[/)[0]).replace(/^,\s*/, '') : '';
    const pdf = $$('a', paragraph).find(link => normalize(link.textContent).toLowerCase() === 'pdf' && link.getAttribute('href'));
    const pdfHref = pdf?.getAttribute('href') || '';
    const previewName = pdfHref.startsWith('pub/') ? pdfHref.split('/').pop().replace(/\.pdf$/i, '.webp') : `external-${index}.webp`;
    return { title, venue, year, topics, raw, details, authorsHtml, pdfHref, previewName, original: paragraph.cloneNode(true), index };
  }

  function paperCard(paper) {
    const card = make('article', 'paper-card');
    const body = make('div', 'paper-body');
    const venueRow = make('div', 'paper-meta');
    venueRow.append(make('span', 'paper-venue', paper.venue));
    const journalMatch = paper.venue.match(/^(.*?)[’'](\d{2})(?:,.*)?$/);
    const journal = journalMatch && journalFactors[journalMatch[1]];
    if (journal) {
      const impact = journal.values[paper.year];
      const badge = make('a', `paper-jif${impact ? '' : ' paper-jif--unverified'}`, impact ? `${impact[0]} IF ${impact[1]}` : 'IF 未核实');
      badge.href = journal.source;
      badge.target = '_blank';
      badge.rel = 'noopener noreferrer';
      badge.title = impact ? `${journalMatch[1]} · ${impact[0]} Impact Factor · View source` : 'No verified Impact Factor; click to view the journal source';
      venueRow.append(badge);
    }
    body.append(venueRow);
    if (paper.title !== `Publication ${paper.index + 1}`) {
      body.append(make('h4', 'paper-display-title', paper.title));
    }
    if (paper.authorsHtml) {
      const authors = make('p', 'paper-authors');
      authors.innerHTML = paper.authorsHtml;
      body.append(authors);
    } else {
      const fallback = paper.original.cloneNode(true);
      fallback.classList.add('paper-source');
      body.append(fallback);
    }
    if (paper.details) body.append(make('p', 'paper-citation', paper.details));

    if (paper.pdfHref) {
      const figure = make('figure', 'paper-figure');
      const image = make('img', 'paper-figure-image');
      image.src = encodeURI(`common/img/paper-previews/${paper.previewName}`);
      image.alt = `Figure preview from ${paper.title}`;
      image.loading = 'lazy';
      image.addEventListener('error', () => figure.remove());
      figure.append(image);
      body.append(figure);
    }

    const footer = make('div', 'paper-footer');
    const resources = make('div', 'paper-resources');
    $$('a', paper.original).forEach(originalLink => {
      const link = originalLink.cloneNode(true);
      const label = normalize(link.textContent);
      if (label.toLowerCase() === 'pdf' && !link.getAttribute('href')) {
        resources.append(make('span', 'paper-resource paper-resource--disabled', 'PDF'));
      } else {
        link.className = 'paper-resource';
        if (label.toLowerCase() === 'pdf') link.textContent = 'PDF';
        if (label.toLowerCase() === 'bib') link.textContent = 'Bib';
        resources.append(link);
      }
    });
    footer.append(resources);
    body.append(footer);
    card.append(body);
    return card;
  }

  function enhancePublications() {
    const section = $('#paper + section');
    const allList = $('[id="0000"] ol', section || document);
    if (!section || !allList) return;

    const papers = $$('[id="0000"] ol > li', section).map(readPaper);
    if (!papers.length) return;

    const intro = make('p', 'paper-intro', 'Browse the full publication record. Search by paper, author or venue, and filter by year and research topic. Journal badges show the IF for the paper’s listed year; 2026 papers show the latest released 2025 IF.');
    const tools = make('div', 'paper-tools');
    const search = make('input', 'paper-search');
    search.type = 'search';
    search.placeholder = 'Search title, author, venue…';
    search.setAttribute('aria-label', 'Search publications');
    const topic = make('select', 'paper-topic');
    topic.setAttribute('aria-label', 'Filter publications by topic');
    const allTopic = make('option', '', 'All research topics');
    allTopic.value = 'all';
    topic.append(allTopic);
    [...new Set(papers.flatMap(paper => paper.topics))].sort().forEach(value => {
      const option = make('option', '', value);
      option.value = value;
      topic.append(option);
    });
    tools.append(search, topic);

    const years = make('div', 'year-filters');
    years.setAttribute('role', 'group');
    years.setAttribute('aria-label', 'Publication year');
    const labels = [['all', 'All papers'], ['2026', '2026'], ['2025', '2025'], ['2024', '2024'], ['2023', '2023'], ['earlier', '≤ 2022']];
    let activeYear = 'all';
    labels.forEach(([value, label]) => {
      const button = make('button', `year-filter${value === activeYear ? ' active' : ''}`, label);
      button.type = 'button';
      button.dataset.year = value;
      button.setAttribute('aria-pressed', String(value === activeYear));
      button.addEventListener('click', () => {
        activeYear = value;
        $$('.year-filter', years).forEach(other => {
          const active = other.dataset.year === value;
          other.classList.toggle('active', active);
          other.setAttribute('aria-pressed', String(active));
        });
        visibleLimit = 12;
        render();
      });
      years.append(button);
    });

    const count = make('p', 'paper-count');
    count.setAttribute('aria-live', 'polite');
    const cards = make('div', 'paper-cards');
    const more = make('button', 'paper-more', 'Load more papers ↓');
    more.type = 'button';
    let visibleLimit = 12;
    more.addEventListener('click', () => { visibleLimit += 12; render(); });

    const widget = make('div', 'publication-widget');
    widget.append(intro, tools, years, count, cards, more);
    section.insertBefore(widget, $('.tabs', section));

    function render() {
      const query = normalize(search.value).toLocaleLowerCase();
      const selectedTopic = topic.value;
      const matches = papers.filter(paper => {
        const byYear = activeYear === 'all' || (activeYear === 'earlier' ? Number(paper.year) <= 2022 || paper.year === 'Earlier' : paper.year === activeYear);
        const byTopic = selectedTopic === 'all' || paper.topics.includes(selectedTopic);
        const haystack = `${paper.raw} ${paper.topics.join(' ')}`.toLocaleLowerCase();
        return byYear && byTopic && (!query || haystack.includes(query));
      });
      const shown = matches.slice(0, visibleLimit);
      const fragment = document.createDocumentFragment();
      shown.forEach(paper => fragment.append(paperCard(paper)));
      if (!matches.length) fragment.append(make('div', 'paper-empty', 'No papers match these filters. Try another keyword or year.'));
      cards.replaceChildren(fragment);
      count.textContent = `${shown.length} of ${matches.length} papers shown · ${papers.length} total`;
      more.hidden = shown.length >= matches.length;
    }

    search.addEventListener('input', () => { visibleLimit = 12; render(); });
    topic.addEventListener('change', () => { visibleLimit = 12; render(); });
    render();
    document.documentElement.classList.add('preview-enhanced');
  }

  function enhanceServices() {
    const section = $('#services + section');
    const table = $('table', section || document);
    if (!section || !table) return;
    const groups = make('div', 'service-groups');
    let entries = null;
    $$('tr', table).forEach(row => {
      const heading = $('th', row);
      if (heading) {
        const group = make('section', 'service-group');
        group.append(make('h4', '', normalize(heading.textContent)));
        entries = make('div', 'service-entries');
        group.append(entries);
        groups.append(group);
        return;
      }
      if (!entries) return;
      const cells = $$('td', row);
      if (!cells.length) return;
      const entry = make('div', 'service-entry');
      const description = make('div', 'service-description');
      [...cells[0].childNodes].forEach(node => description.append(node.cloneNode(true)));
      const walker = document.createTreeWalker(description, NodeFilter.SHOW_TEXT);
      const acronymPattern = /\((?:IEEE\s+)?(?:[A-Z][A-Z0-9-]{1,12}|NeurIPS|China3DV)\)/g;
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      textNodes.forEach(node => {
        const text = node.textContent;
        if (!acronymPattern.test(text)) return;
        acronymPattern.lastIndex = 0;
        const fragment = document.createDocumentFragment();
        let last = 0;
        for (const match of text.matchAll(acronymPattern)) {
          fragment.append(document.createTextNode(text.slice(last, match.index)));
          fragment.append(make('strong', 'service-acronym', match[0]));
          last = match.index + match[0].length;
        }
        fragment.append(document.createTextNode(text.slice(last)));
        node.replaceWith(fragment);
      });
      entry.append(description);
      if (cells[1] && normalize(cells[1].textContent)) {
        const year = make('div', 'service-year');
        [...cells[1].childNodes].forEach(node => year.append(node.cloneNode(true)));
        entry.append(year);
      }
      entries.append(entry);
    });
    if (groups.children.length) {
      table.classList.add('service-original');
      table.before(groups);
    }
  }

  enhanceNavigation();
  enhanceHero();
  enhanceNews();
  enhancePublications();
  enhanceServices();
})();
