(() => {
  const target = document.getElementById('honors-record');
  if (!target) return;
  const members = [
    ['Kunlun Xu', 'xklEN.html'],
    ['Junjie Liang', 'ljjEN.html'], ['Zixiang Ai', 'azxEN.html'],
    ['Yanqin Zhang', 'zyqEN.html'], ['Zichen Liu', 'lzcEN.html']
  ];
  const duringPKU = {
    xklEN: () => true,
    ljjEN: award => /Hongcai Scholarship of Peking University/i.test(award),
    azxEN: award => /Jinde Scholarship of Peking University|Peking University Merit Student/i.test(award),
    zyqEN: award => /Peking University Freshman Scholarship/i.test(award),
    lzcEN: award => /Peking University/i.test(award)
  };
  const alias = text => {
    if (/China National Scholarship/i.test(text)) return 'China National Scholarship · 国家奖学金';
    if (/Academic Innovation Award of Peking University/i.test(text)) return 'Academic Innovation Award of Peking University · 北京大学学术创新奖';
    if (/Peking University Merit Student|Merit Student of Peking University/i.test(text)) return 'Peking University Merit Student · 北京大学三好学生';
    if (/Hongcai Scholarship of Peking University/i.test(text)) return 'Hongcai Scholarship of Peking University · 北京大学闳材奖学金';
    if (/Excellent Student of Wangxuan Institute/i.test(text)) return 'Excellent Student of Wangxuan Institute of Computer Technology · 王选计算机研究所优秀学生';
    if (/Academic Star Nomination Award/i.test(text)) return 'Academic Star Nomination Award · 北京大学智能学院学术智星提名奖';
    return text;
  };
  const groups = new Map();
  function add(award, name, year, href) {
    const title = alias(award.replace(/\s+/g, ' ').trim());
    if (!groups.has(title)) groups.set(title, new Map());
    const people = groups.get(title);
    if (!people.has(name)) people.set(name, { years: new Set(), href });
    people.get(name).years.add(year || 'Year not specified');
  }
  target.textContent = 'Collecting awards from member homepages…';
  Promise.all(members.map(async ([name, file]) => {
    const response = await fetch(`student_pages/${file}`);
    if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
    const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
    const heading = [...doc.querySelectorAll('h3')].find(item => /Awards and Honors/i.test(item.textContent));
    if (!heading) return;
    const rawAwards = [...heading.closest('section').querySelectorAll('li')]
      .map(item => item.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean);
    rawAwards.filter(duringPKU[file.replace(/\.html$/, '')]).forEach(raw => {
      const date = raw.match(/(?:,\s*|\s+)(20\d{2}(?:\s*[~–-]\s*20\d{2})?)$/);
      const award = date ? raw.slice(0, date.index).trim() : raw;
      add(award, name, date?.[1] || '', `student_pages/${file}#member-honors`);
    });
  })).then(() => {
    const ordered = [...groups.entries()].sort(([a, peopleA], [b, peopleB]) => {
      if (a.startsWith('China National Scholarship')) return -1;
      if (b.startsWith('China National Scholarship')) return 1;
      return peopleB.size - peopleA.size || a.localeCompare(b);
    });
    target.replaceChildren();
    const list = document.createElement('div');
    list.className = 'honors-list';
    ordered.forEach(([award, people]) => {
      const row = document.createElement('article');
      row.className = 'honor-row';
      const title = document.createElement('h2');
      title.textContent = award;
      const recipients = document.createElement('div');
      recipients.className = 'honor-recipients';
      [...people.entries()].forEach(([name, record]) => {
        const item = document.createElement('div');
        item.className = 'honor-recipient';
        const link = document.createElement('a');
        link.href = record.href;
        link.textContent = name;
        const years = document.createElement('span');
        years.textContent = [...record.years].join(', ');
        item.append(link, years);
        recipients.append(item);
      });
      row.append(title, recipients);
      list.append(row);
    });
    target.append(list);
  }).catch(error => {
    target.textContent = 'The awards list could not load. Please refresh the page.';
    console.error('Honors source loading failed:', error);
  });
})();
