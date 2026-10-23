(() => {
  document.body.classList.add('member-page');
  const nav = document.querySelector('.navbar.navbar-default');
  const content = nav?.nextElementSibling;
  if (!nav || !content) return;
  content.classList.add('content');
  const links = [
    ['Home', '../index.html#top'], ['News', '../index.html#news'],
    ['Research', '../index.html#direct'], ['Publications', '../publications.html'],
    ['Members', '../research.html#member'],
    ['Patents', '../patents.html'], ['Fundings', '../events.html'], ['Demos', '../demos.html'], ['Contact', '../contact.html']
  ];
  const list = nav.querySelector('.navbar-nav');
  list.replaceChildren(...links.map(([label, href]) => {
    const item = document.createElement('li');
    if (label === 'Members') item.className = 'active';
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
  nav.prepend(brand('lab-brand', '../research.html#member', '../common/img/ov3-lab-logo-new.png?v=20261022', 'OV³ Lab · 开放视界实验室'));
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

  // Keep the members' original schools and dates, but display them in the
  // same seal / degree / period hierarchy as the principal investigator.
  const memberId = location.pathname.split('/').pop().replace(/EN\.html$/i, '');
  const education = {
    azx: [
      ['Ph.D. candidate', 'Peking University', 'Intelligent Science and Technology · School of Intelligence', '2025–2030 (expected)', 'pku-seal.svg'],
      ['B.Eng.', 'Zhejiang University', 'Software Engineering · College of Computer Science and Technology', '2021–2025', 'education-logos/zhejiang.svg']
    ],
    hyc: [
      ['Undergraduate studies', 'Peking University', 'Data Science · College of Mathematics', '2025–Present', 'pku-seal.svg'],
      ['Bachelor’s degree', 'Jilin University', 'Information and Computing Science · College of Mathematics', '2020–2024', 'education-logos/jilin.png']
    ],
    ljj: [
      ['Ph.D. candidate', 'Peking University', 'Intelligence Science and Technology', '2024–Present', 'pku-seal.svg'],
      ['Master’s studies', 'Nanjing Normal University', 'Electrical and Automation Engineering', '2021–2024', 'education-logos/nanjing-normal.png'],
      ['Bachelor’s studies', 'Tianjin University of Technology', 'Electrical and Electronic Engineering', '2017–2021', 'education-logos/tianjin-technology.png']
    ],
    lzc: [
      ['Master’s candidate', 'Peking University', 'Computer Application Technology · Wangxuan Institute', '2022–Present', 'pku-seal.svg'],
      ['B.Eng.', 'Xi’an Jiaotong University', 'Computer Science and Technology', '2018–2022', 'education-logos/xian-jiaotong.png']
    ],
    xkl: [
      ['Ph.D. candidate', 'Peking University', 'Computer Science and Engineering · Wangxuan Institute', 'Sep. 2023–Present', 'pku-seal.svg'],
      ['Master’s studies', 'Huazhong University of Science and Technology', 'Control Science and Engineering · School of Artificial Intelligence and Automation', 'Sep. 2020–Jul. 2023', 'partners/hust-seal.webp'],
      ['Bachelor’s studies', 'Huazhong University of Science and Technology', 'Automation · School of Artificial Intelligence and Automation', 'Sep. 2016–Jul. 2020', 'partners/hust-seal.webp']
    ],
    zk: [
      ['Master’s candidate', 'Peking University', 'Wangxuan Institute of Computer Technology · School of Computer Science', '2026–Present', 'pku-seal.svg'],
      ['Bachelor’s studies', 'Renmin University of China', 'Turing Class · School of Information', '2022–2026', 'education-logos/renmin.svg']
    ],
    zyq: [
      ['Ph.D. candidate', 'Peking University', 'Computer Science and Technology · Wangxuan Institute', '2026–Present', 'pku-seal.svg'],
      ['Bachelor’s studies', 'Peking University', 'Data Science and Big Data Technology · Yuanpei College', '2022–2026', 'pku-seal.svg'],
      ['Dual-degree studies', 'Peking University', 'Economics · National School of Development', '2023–2026', 'pku-seal.svg']
    ],
    zzh: [
      ['Postdoctoral Researcher', 'Peking University', 'Wangxuan Institute of Computer Technology', '2026–Present', 'pku-seal.svg'],
      ['Ph.D.', 'University of Chinese Academy of Sciences', 'Institute of Software · Space Integrated Information Systems', 'Sep. 2020–Jun. 2026', 'education-logos/ucas.png'],
      ['B.Eng.', 'Beijing Jiaotong University', 'Computer Science and Technology', 'Sep. 2015–Jun. 2019', 'education-logos/beijing-jiaotong.png']
    ]
  };
  const educationSection = document.getElementById('member-education');
  if (educationSection && education[memberId]) {
    const list = document.createElement('div');
    list.className = 'member-education-list';
    education[memberId].forEach(([degree, school, field, period, seal]) => {
      const row = document.createElement('div');
      row.className = 'experience-entry';
      const image = document.createElement('img');
      image.className = 'experience-seal';
      if (seal === 'partners/hust-seal.webp') image.classList.add('experience-seal--hust');
      image.src = `../common/img/${seal}`;
      image.alt = `${school} logo`;
      image.loading = 'lazy';
      const copy = document.createElement('div');
      copy.className = 'experience-copy';
      [['span', 'experience-role', degree], ['span', 'experience-period', period],
        ['strong', 'experience-institution', school], ['span', 'experience-field', field]].forEach(([tag, className, value]) => {
        const node = document.createElement(tag);
        node.className = className;
        node.textContent = value;
        copy.append(node);
      });
      row.append(image, copy);
      list.append(row);
    });
    educationSection.querySelector('ul')?.replaceWith(list);
  }

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
      IJCV: { source: 'https://link.springer.com/journal/11263', values: { 2025: ['2025', '10.3'], 2024: ['2024', '9.3'] } },
      NN: { source: 'https://www.bioxbio.com/journal/NEURAL-NETWORKS', values: { 2025: ['2025', '7.2'] } },
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
    [...paperList.querySelectorAll('li')].forEach(item => {
      const raw = item.textContent.replace(/\s+/g, ' ').trim();
      if (!raw) return;
      const titleMatch = raw.match(/[“"]([^”"]+)[”"]/);
      const venueText = [...item.querySelectorAll('strong')].map(node => node.textContent.trim())
        .find(text => venuePattern.test(text)) || raw.match(venuePattern)?.[0] || 'Publication';
      const venue = venueText.replace(/[()]/g, '').trim();
      const year = venue.match(/[’'](\d{2,4})/)?.[1];
      const fullYear = year ? (year.length === 2 ? String(2000 + Number(year)) : year) : raw.match(/\b20\d{2}\b/)?.[0];
      const paperNumber = grid.childElementCount + 1;
      const authors = titleMatch ? raw.slice(0, titleMatch.index).replace(/^\s*\([^)]*\)\s*[-–]?\s*/, '').trim().replace(/[,\s]+$/, '') : '';
      const details = titleMatch ? raw.slice(titleMatch.index + titleMatch[0].length).replace(/^\s*,\s*/, '').replace(/\s*\[(?:pdf|bib|doi|code)[^\]]*\]/gi, '').trim() : raw;
      const card = document.createElement('article');
      card.className = 'paper-card member-paper-card';
      const number = document.createElement('span');
      number.className = 'paper-year-number';
      number.textContent = String(paperNumber);
      number.setAttribute('aria-label', `Member publication number ${paperNumber}`);
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
        badge.textContent = impact ? `IF ${Number(impact[1]).toFixed(1)}` : 'IF 未核实';
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
      const unavailable = /unavaliable|unavailable/i.test(value);
      if (!unavailable) {
        try { await navigator.clipboard.writeText(value); }
        catch {
          const field = document.createElement('textarea');
          field.value = value;
          document.body.append(field);
          field.select();
          document.execCommand('copy');
          field.remove();
        }
      }
    };
    fetch('../index.html').then(response => response.text()).then(html => {
      const source = new DOMParser().parseFromString(html, 'text/html');
      const mainPapers = new Map();
      source.querySelectorAll('#paper + section [id="0000"] ol > li').forEach(item => {
        const title = item.textContent.match(/[“"]([^”"]+)[”"]/ )?.[1];
        if (title) mainPapers.set(paperKey(title), item);
      });
      paperCardsByTitle.forEach(({ resources, source: memberItem }, title) => {
        // Member-specific resources take priority; the lab record fills any gaps.
        const anchors = [
          ...[...memberItem.querySelectorAll('a')].map(anchor => ({ anchor, base: location.href })),
          ...[...(mainPapers.get(title)?.querySelectorAll('a') || [])]
            .map(anchor => ({ anchor, base: new URL('../index.html', location.href) }))
        ];
        [...resources.children].forEach(button => {
          const label = button.textContent;
          const pattern = label === 'DOI' ? /^doi(?:\b|:)/i : new RegExp(`^${label}$`, 'i');
          const found = anchors.find(({ anchor }) => {
            const text = anchor.textContent.trim().replace(/^\[|\]$/g, '');
            return pattern.test(text) && (anchor.getAttribute('href') || anchor.getAttribute('onclick'));
          });
          if (found) {
            const link = found.anchor.cloneNode(true);
            link.className = 'paper-resource';
            link.textContent = label;
            if (link.getAttribute('href') && link.getAttribute('href') !== '#') link.href = new URL(link.getAttribute('href'), found.base).href;
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

  const serviceSection = document.getElementById('member-service');
  if (serviceSection) {
    const logos = {
      ICML: 'icml.svg', NeurIPS: 'neurips-provided.png', CVPR: 'cvpr.svg',
      ECCV: 'eccv.svg', ICLR: 'iclr.svg', AAAI: 'aaai-provided.png',
      ICCV: 'iccv.svg', 'ACM MM': 'acm-mm.svg', ICME: 'icme.png',
      TPAMI: 'tpami.png', TIP: 'tip-cover.jpg', TMM: 'tmm.png',
      PRL: 'prl.jpg', KBS: 'kbs.jpg'
    };
    const fullNames = {
      ICML: 'International Conference on Machine Learning',
      CVPR: 'IEEE Conference on Computer Vision and Pattern Recognition',
      NeurIPS: 'Conference on Neural Information Processing Systems',
      ICME: 'IEEE International Conference on Multimedia & Expo',
      AAAI: 'AAAI Conference on Artificial Intelligence',
      KBS: 'Knowledge-Based Systems'
    };
    const groups = document.createElement('div');
    groups.className = 'member-service-groups';
    const addGroup = (role, records) => {
      if (!records.length) return;
      const group = document.createElement('section');
      group.className = 'member-service-group';
      const title = document.createElement('h4');
      title.textContent = role;
      const cards = document.createElement('div');
      cards.className = 'member-service-cards';
      records.forEach(({ name, acronym, year = '' }) => {
        const card = document.createElement('article');
        const journal = ['TPAMI', 'TIP', 'TMM', 'PRL', 'KBS'].includes(acronym);
        card.className = `service-entry member-service-card${journal ? ' member-service-card--journal' : ''}`;
        const art = document.createElement('div');
        art.className = 'service-mark';
        if (logos[acronym]) {
          const image = document.createElement('img');
          image.className = journal ? 'service-cover' : 'service-logo';
          image.src = `../common/img/${journal ? 'journal-covers' : 'service-logos'}/${logos[acronym]}`;
          image.alt = journal ? `${acronym} ${['TPAMI', 'TMM'].includes(acronym) ? 'journal artwork' : 'journal cover'}` : acronym === 'ACM MM' ? 'ACM publisher logo' : `${acronym} conference logo`;
          image.loading = journal ? 'eager' : 'lazy';
          art.append(image);
        } else {
          const fallback = document.createElement('span');
          fallback.className = 'service-wordmark';
          fallback.textContent = acronym;
          art.append(fallback);
        }
        const description = document.createElement('div');
        description.className = 'service-description';
        const match = name.match(/\((?:IEEE\s+)?(?:ACM MM|NeurIPS|[A-Z][A-Z0-9-]{1,12})\)/i);
        if (match) {
          description.append(document.createTextNode(name.slice(0, match.index + 1)));
          const red = document.createElement('strong');
          red.className = 'member-service-acronym';
          red.textContent = `${match[0].slice(1, -1)}${year ? ` ${year}` : ''}`;
          description.append(red, document.createTextNode(`)${name.slice(match.index + match[0].length)}`));
        } else {
          description.append(document.createTextNode(`${name} (`));
          const red = document.createElement('strong');
          red.className = 'member-service-acronym';
          red.textContent = `${acronym}${year ? ` ${year}` : ''}`;
          description.append(red, document.createTextNode(')'));
        }
        card.append(art, description);
        cards.append(card);
      });
      group.append(title, cards);
      groups.append(group);
    };
    if (memberId === 'zzh') {
      addGroup('Conference Reviewer', [
        { name: fullNames.ICML, acronym: 'ICML', year: '2026' },
        { name: fullNames.CVPR, acronym: 'CVPR', year: '2026' },
        { name: fullNames['NeurIPS'], acronym: 'NeurIPS', year: '2026' },
        { name: fullNames.ICME, acronym: 'ICME', year: '2025–2026' }
      ]);
      addGroup('Journal Reviewer', [{ name: fullNames.KBS, acronym: 'KBS' }]);
      addGroup('Program Committee Member', [{ name: fullNames.AAAI, acronym: 'AAAI', year: '2026' }]);
    } else {
      let role = '';
      [...serviceSection.children].forEach(node => {
        if (node.tagName === 'B') role = node.textContent.trim().replace(/:$/, '');
        if (node.tagName !== 'UL') return;
        const records = [...node.querySelectorAll('li')].map(item => {
          const name = item.textContent.replace(/\s+/g, ' ').trim();
          const acronym = name.match(/\((?:IEEE\s+)?(ACM MM|NeurIPS|[A-Z][A-Z0-9-]{1,12})\)/i)?.[1];
          return acronym ? { name, acronym } : null;
        }).filter(Boolean);
        addGroup(role || 'Conference Reviewer', records);
      });
    }
    if (groups.children.length) {
      serviceSection.replaceChildren(serviceSection.querySelector('h3'), groups);
    } else {
      serviceSection.hidden = true;
    }
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
    interestList.tabIndex = 0;
    interestList.setAttribute('aria-label', 'Scroll through research interests');
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

})();
