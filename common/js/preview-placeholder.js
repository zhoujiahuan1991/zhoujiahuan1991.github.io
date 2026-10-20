(() => {
  const current = document.body.dataset.page || '';
  const list = document.querySelector('.navbar-nav');
  if (!list) return;
  const links = [
    ['Home', 'index.html#top'], ['About', 'index.html#about'],
    ['News', 'index.html#news'], ['Research', 'index.html#direct'],
    ['Publications', 'index.html#paper'], ['People', 'research.html#member'],
    ['Teaching', 'teaching.html'], ['Patents', 'patents.html'],
    ['Demos', 'demos.html'], ['Contact', 'contact.html']
  ];
  links.forEach(([label, href]) => {
    const item = document.createElement('li');
    if (label === current) item.className = 'active';
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    if (label === current) link.setAttribute('aria-current', 'page');
    item.append(link);
    list.append(item);
  });
})();
