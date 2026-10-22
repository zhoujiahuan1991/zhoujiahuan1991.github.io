(() => {
  const placeholder = document.getElementById('paper-loading');
  window.copyTextAndNotify = async (event, value) => {
    event.preventDefault();
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
    const notice = document.getElementById('notification');
    if (notice) {
      notice.style.display = 'block';
      setTimeout(() => { notice.style.display = 'none'; }, 3000);
    }
  };
  fetch('index.html').then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  }).then(html => {
    const source = new DOMParser().parseFromString(html, 'text/html').querySelector('#paper + section');
    if (!source) throw new Error('Publication source was not found.');
    placeholder.replaceWith(document.importNode(source, true));
    const script = document.createElement('script');
    script.src = 'common/js/preview-redesign.js?v=20261022f';
    document.body.append(script);
  }).catch(error => {
    placeholder.querySelector('p').textContent = 'The publications could not load. Please refresh the page.';
    console.error('Publication source loading failed:', error);
  });
})();
