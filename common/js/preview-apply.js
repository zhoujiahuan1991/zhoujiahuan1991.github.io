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
  const field = (data, name) => String(data.get(name) || '').trim() || 'Not provided';
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const role = field(data, 'role');
    const lines = [
      'Subject: Application Notice — OV³ Lab',
      '',
      `An applicant completed a local preview of the ${role} application form on the OV³ Lab website.`,
      'This is a preview only; no email has been sent.',
      '',
      `Position: ${role}`,
      `Name: ${field(data, 'fullName')}`,
      `Email: ${field(data, 'email')}`,
      `Current institution: ${field(data, 'institution')}`,
      `Expected start date: ${field(data, 'startDate')}`,
      `CV link: ${field(data, 'cvLink')}`,
      `Research interests: ${field(data, 'interests')}`
    ];
    if (role === 'RA (Undergraduate)') lines.push(
      `Undergraduate university: ${field(data, 'undergradUniversity')}`,
      `Major and year: ${field(data, 'majorYear')}`,
      `Relevant skills or projects: ${field(data, 'raProjects')}`
    );
    else lines.push(
      `Education: ${field(data, 'education')}`,
      `Publications (title, venue, level, full authors): ${field(data, 'publications')}`,
      `Honors: ${field(data, 'honors')}`,
      `Research experience: ${field(data, 'researchExperience')}`
    );
    lines.push(`Why OV³ Lab?: ${field(data, 'motivation')}`);
    document.getElementById('application-summary').textContent = lines.join('\n');
    const preview = document.getElementById('application-preview');
    preview.hidden = false;
    preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  document.getElementById('copy-application').addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(document.getElementById('application-summary').textContent);
      status.textContent = 'Copied. No email was sent.';
    } catch {
      status.textContent = 'Copy unavailable in this browser. Please select the preview text manually.';
    }
  });
})();
