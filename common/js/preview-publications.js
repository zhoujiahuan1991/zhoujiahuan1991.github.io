(() => {
  const placeholder = document.getElementById('paper-loading');
  window.copyTextAndNotify = async (event, value) => {
    event.preventDefault();
    const unavailable = /unavaliable|unavailable/i.test(value);
    if (!unavailable) {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const field = document.createElement('textarea');
        field.value = value;
        document.body.append(field);
        field.select();
        document.execCommand('copy');
        field.remove();
      }
    }
  };
  fetch('index.html?v=20261023-member-pdfs').then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  }).then(html => {
    const source = new DOMParser().parseFromString(html, 'text/html').querySelector('#paper + section');
    if (!source) throw new Error('Publication source was not found.');
    const kicker = document.createElement('p');
    kicker.className = 'placeholder-kicker';
    kicker.textContent = 'OV³ LAB · PEKING UNIVERSITY';
    source.prepend(kicker);
    placeholder.replaceWith(document.importNode(source, true));
    const script = document.createElement('script');
    script.src = 'common/js/preview-redesign.js?v=20261023-jif2025';
    document.body.append(script);
  }).catch(error => {
    placeholder.querySelector('p').textContent = 'The publications could not load. Please refresh the page.';
    console.error('Publication source loading failed:', error);
  });
})();
