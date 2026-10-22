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
    if (/General Intelligence Star of Peking University/i.test(text)) return 'General Intelligence Star of Peking University · 北京大学通智之星';
    if (/Gold Reviewer Award for ICML/i.test(text)) return 'ICML Gold Reviewer Award · ICML 金牌审稿人';
    if (/Jinde Scholarship of Peking University/i.test(text)) return 'Jinde Scholarship of Peking University · 北京大学金德奖学金';
    if (/Peking University Freshman Scholarship/i.test(text)) return 'Peking University Freshman Scholarship · 北京大学新生奖学金';
    if (/Xiaomi First Prize Scholarship of Peking University/i.test(text)) return 'Xiaomi First Prize Scholarship of Peking University · 北京大学小米一等奖学金';
    return text.replace(/\s*\(([^)]+[\u4e00-\u9fff][^)]*)\)/, ' · $1');
  };
  const groups = new Map();
  function add(award, name, year, href) {
    const title = alias(award.replace(/\s+/g, ' ').trim());
    if (!groups.has(title)) groups.set(title, new Map());
    const people = groups.get(title);
    if (!people.has(name)) people.set(name, { years: new Set(), href });
    people.get(name).years.add(year || 'Year not specified');
  }
  const wrap = document.createElement('div');
  wrap.className = 'alumni-table-wrap honors-table-wrap';
  const table = document.createElement('table');
  table.className = 'alumni-table honors-table';
  const head = document.createElement('thead');
  const header = document.createElement('tr');
  ['Award', 'Student', 'Year'].forEach(label => {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = label;
    header.append(cell);
  });
  head.append(header);
  const body = document.createElement('tbody');
  table.append(head, body);
  wrap.append(table);
  target.replaceChildren(wrap);
  const messageRow = message => {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 3;
    cell.textContent = message;
    row.append(cell);
    body.replaceChildren(row);
  };
  messageRow('Collecting awards from member homepages…');
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
    body.replaceChildren();
    ordered.forEach(([award, people]) => {
      [...people.entries()].forEach(([name, record]) => {
        const row = document.createElement('tr');
        const title = document.createElement('td');
        title.textContent = award;
        const student = document.createElement('td');
        const link = document.createElement('a');
        link.href = record.href;
        link.textContent = name;
        student.append(link);
        const years = document.createElement('td');
        years.textContent = [...record.years].join(', ');
        row.append(title, student, years);
        body.append(row);
      });
    });
  }).catch(error => {
    messageRow('The awards list could not load. Please refresh the page.');
    console.error('Honors source loading failed:', error);
  });
})();
