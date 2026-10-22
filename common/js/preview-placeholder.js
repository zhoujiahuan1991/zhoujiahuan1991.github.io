(() => {
  const current = document.body.dataset.page || '';
  const list = document.querySelector('.navbar-nav');
  if (!list) return;
  const nav = list.closest('.navbar');
  if (nav) {
    const labBrand = document.createElement('a');
    labBrand.className = 'lab-brand';
    labBrand.href = 'research.html#member';
    labBrand.setAttribute('aria-label', 'OV³ Lab · Lab members');
    const labLogo = document.createElement('img');
    labLogo.className = 'lab-brand-logo';
    labLogo.src = 'common/img/ov3-lab-logo.png';
    labLogo.alt = 'OV³ Lab · 开放视界实验室';
    labLogo.width = 2000;
    labLogo.height = 640;
    labBrand.append(labLogo);
    nav.prepend(labBrand);
  }
  const links = [
    ['Home', 'index.html#top'],
    ['News', 'index.html#news'], ['Research', 'index.html#direct'],
    ['Publications', 'publications.html'], ['Members', 'research.html#member'],
    ['Patents', 'patents.html'],
    ['Fundings', 'events.html'], ['Demos', 'demos.html'], ['Contact', 'contact.html']
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
  const updateCompactNav = () => document.body.classList.toggle('nav-scrolled', window.scrollY > 80);
  window.addEventListener('scroll', updateCompactNav, { passive: true });
  updateCompactNav();
})();
