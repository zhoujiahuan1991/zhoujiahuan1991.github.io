(() => {
  const toggle = document.getElementById('apply-toggle');
  const panel = document.getElementById('apply-panel');
  const form = document.getElementById('apply-form');
  if (!toggle || !panel || !form) return;
  toggle.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    toggle.setAttribute('aria-expanded', String(!panel.hidden));
    if (!panel.hidden) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  const cvFile = form.elements.cvFile;
  const cvStatus = document.getElementById('cv-file-status');
  cvFile.addEventListener('change', () => {
    const file = cvFile.files[0];
    cvFile.setCustomValidity('');
    if (file && !/\.(pdf|doc|docx)$/i.test(file.name)) {
      cvFile.setCustomValidity('Please select a PDF or Word document.');
      cvStatus.textContent = 'Unsupported file type. Please select a PDF or Word document.';
    } else {
      cvStatus.textContent = file ? `Selected: ${file.name} · Remember to attach this file to your email.` : '';
    }
    document.getElementById('application-preview').hidden = true;
  });
  const advanced = document.getElementById('apply-advanced');
  const ra = document.getElementById('apply-ra');
  const education = form.elements.education;
  const undergrad = form.elements.undergradUniversity;
  const updateRole = () => {
    const role = form.querySelector('input[name="role"]:checked')?.value;
    advanced.hidden = role === 'RA (Undergraduate)' || !role;
    ra.hidden = role !== 'RA (Undergraduate)';
    education.required = !!role && role !== 'RA (Undergraduate)';
    undergrad.required = role === 'RA (Undergraduate)';
    document.getElementById('application-preview').hidden = true;
  };
  form.querySelectorAll('input[name="role"]').forEach(input => input.addEventListener('change', updateRole));
  const field = (data, name) => String(data.get(name) || '').trim();
  const detail = (label, value) => value ? `${label}: ${value}` : null;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const role = field(data, 'role');
    const name = field(data, 'fullName');
    const lines = [
      'To: jiahuanzhouATpku.edu.cn (replace AT with @ before sending)',
      `Subject: Application for ${role} — ${name} | OV³ Lab`,
      '',
      'Dear Professor Zhou,',
      '',
      `My name is ${name}, and I am writing to apply for the ${role} position at OV³ Lab. I am currently at ${field(data, 'institution')}.`,
      '',
      'My background and interests are as follows:',
      detail('Research interests', field(data, 'interests')),
      detail('Expected start date', field(data, 'startDate')),
      detail('CV file (to be attached separately)', cvFile.files[0]?.name || '')
    ];
    if (role === 'RA (Undergraduate)') lines.push(
      detail('Undergraduate university', field(data, 'undergradUniversity')),
      detail('Major and year', field(data, 'majorYear')),
      detail('Relevant skills or projects', field(data, 'raProjects'))
    );
    else lines.push(
      detail('Education', field(data, 'education')),
      detail('Publications (title, venue, level, full author list)', field(data, 'publications')),
      detail('Honors', field(data, 'honors')),
      detail('Research experience', field(data, 'researchExperience'))
    );
    lines.push(
      detail('Why I would like to join OV³ Lab', field(data, 'motivation')),
      '',
      'Thank you for considering my application. I would be grateful for the opportunity to discuss it further.',
      '',
      'Best regards,',
      name,
      field(data, 'email')
    );
    document.getElementById('application-summary').textContent = lines.filter(line => line !== null).join('\n');
    const preview = document.getElementById('application-preview');
    preview.hidden = false;
    preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  document.getElementById('copy-application').addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(document.getElementById('application-summary').textContent);
      status.textContent = 'Email draft copied. Please paste it into your email app and send it yourself.';
    } catch {
      status.textContent = 'Copy unavailable in this browser. Please select the preview text manually.';
    }
  });
})();
