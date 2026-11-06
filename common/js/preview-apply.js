(() => {
  const form = document.getElementById('apply-form');
  if (!form) return;
  const panel = document.getElementById('apply-panel');
  const preview = document.getElementById('application-preview');
  const summary = document.getElementById('application-summary');
  const status = document.getElementById('copy-status');
  let language = new URLSearchParams(location.search).get('lang') === 'zh' ? 'zh' : 'en';
  const roles = { Postdoc: ['Postdoctoral researcher', '博士后'], PhD: ['PhD student', '博士研究生'], Master: ['Master’s student', '硕士研究生'], 'RA (Undergraduate)': ['Research intern', '科研实习生'] };
  function draft() {
    const data = new FormData(form);
    const val = key => String(data.get(key) || '').trim();
    const zh = language === 'zh';
    const name = val('fullName');
    const role = roles[val('role')]?.[zh ? 1 : 0] || '';
    const sections = [];
    const section = (en, cn, value) => { if (value) sections.push(`${zh ? cn : en}\n${value}`); };
    section('Research interests', '研究兴趣', val('interests'));
    section('Expected start date', '预计入组时间', val('startDate'));
    if (val('role') === 'RA (Undergraduate)') {
      section('University', '所在院校', val('undergradUniversity'));
      section('Major & year', '专业与年级', val('majorYear'));
      section('Relevant skills & projects', '相关技能与项目经历', val('raProjects'));
    } else {
      section('Education', '教育背景', val('education'));
      section('Publications', '论文发表', val('publications'));
      section('Honors & awards', '荣誉奖励', val('honors'));
      section('Research experience', '科研经历', val('researchExperience'));
    }
    section('Why OV³ Lab?', '申请动机', val('motivation'));
    const header = zh ? `收件人：jiahuanzhou@pku.edu.cn\n抄送：zangzehua@pku.edu.cn\n主题：OV³ Lab ${role}申请｜${name}` : `To: jiahuanzhou@pku.edu.cn\nCc: zangzehua@pku.edu.cn\nSubject: ${role} application | ${name} | OV³ Lab`;
    const intro = zh ? `周老师您好：\n\n我是${name}，目前就读或就职于${val('institution')}，希望申请 OV³ Lab 的${role}岗位。以下是我的背景与研究兴趣，供您参考。` : `Dear Professor Zhou,\n\nMy name is ${name}, and I am currently at ${val('institution')}. I would like to apply to OV³ Lab as a ${role.toLowerCase()}. Below is an overview of my background and research interests.`;
    const closing = zh ? `感谢您审阅我的申请，期待有机会与您进一步交流。\n\n此致\n敬礼！\n\n${name}\n${val('email')}` : `Thank you for considering my application. I would welcome the opportunity to discuss my interests and experience with you.\n\nBest regards,\n${name}\n${val('email')}`;
    summary.textContent = [header, intro, ...sections, closing].join('\n\n');
  }
  function setLanguage(lang) {
    language = lang;
    document.querySelectorAll('[data-en][data-zh]').forEach(el => { el.textContent = el.dataset[lang]; });
    document.querySelectorAll('[data-language]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.language === lang)));
    status.textContent = '';
    if (!preview.hidden) draft();
  }
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  document.getElementById('apply-toggle').addEventListener('click', event => {
    panel.hidden = !panel.hidden;
    event.currentTarget.setAttribute('aria-expanded', String(!panel.hidden));
  });
  function updateRole() {
    const role = form.querySelector('[name="role"]:checked')?.value;
    const intern = role === 'RA (Undergraduate)';
    document.getElementById('apply-advanced').hidden = !role || intern;
    document.getElementById('apply-ra').hidden = !intern;
    form.elements.education.required = !!role && !intern;
    form.elements.undergradUniversity.required = intern;
    preview.hidden = true;
    status.textContent = '';
  }
  form.querySelectorAll('[name="role"]').forEach(input => input.addEventListener('change', updateRole));
  form.addEventListener('input', () => { if (!preview.hidden) draft(); status.textContent = ''; });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    draft(); preview.hidden = false;
    preview.scrollIntoView({behavior: 'smooth', block: 'start'});
  });
  document.getElementById('copy-application').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summary.textContent);
      status.textContent = language === 'zh' ? '已复制。请粘贴至邮箱，附上简历后发送。' : 'Copied. Paste into your email app and attach your CV before sending.';
    } catch {
      status.textContent = language === 'zh' ? '浏览器无法自动复制，请手动选择并复制草稿。' : 'Please select and copy the draft manually.';
    }
  });
  updateRole(); setLanguage(language);
})();
