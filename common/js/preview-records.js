(() => {
  const events = [
    ['多模态大模型AI导演系统与游戏世界模型', '腾讯科技（深圳）有限公司', '', '负责人', '2026.05–2027.04'],
    ['零样本场景物体对象智能识别模型构建与优化', '中国铁道科学研究院集团有限公司', '', '负责人', '2026.02–2026.08'],
    ['视觉提示驱动的XXX敏捷增量学习技术研究', '航天科工集团智能科技研究院有限公司', '', '负责人', '2025.12–2026.05'],
    ['AIGC多粒度持续鉴伪', '北京市公安局人工智能安全研究中心', '', '负责人', '2025.01–2025.12'],
    ['基于高通量电子显微技术的自插层低维铁基材料微结构研究', '国家重点研发计划青年科学家项目', '2024YFA1410000', '课题负责人', '2024.12–2029.11'],
    ['XXX持续识别与自适应分析技术', 'JKW基础加强计划技术领域基金', '', '负责人', '2024.10–2026.04'],
    ['面向城市动态场景的自适应增量分析与可持续感知', '国家自然科学基金面上项目', '62376011', '负责人', '2024.01–2027.12'],
    ['家庭机器人视觉定位模块研发', '四川启睿克科技有限公司', '', '负责人', '2023.11–2024.11'],
    ['端侧超分辨率模型研发', '北京蔚领时代科技有限公司', '', '负责人', '2023.07–2024.01'],
    ['受限样本的视觉模式分析与识别', '国家自然科学基金优秀青年科学基金项目（海外）', '22IAA02468', '负责人', '2023.01–2025.12'],
    ['光学图像复杂场景持续目标识别研究', '华中科技大学', '', '负责人', '2023.07–2024.02'],
    ['大模型应用中的增量学习方法研究', '北京字跳网络技术有限公司', '', '负责人', '2022.12–2023.12'],
    ['复杂环境下XXX动态感知能力增强方法', '多谱信息智能处理技术全国重点实验室', '', '负责人', '2022.12–2024.12'],
    ['面向受限数据的视觉识别方法与研究', '北京大学学科建设项目', '', '负责人', '2022.03–2024.12']
  ];
  const patents = [
    ['一种原型自强化引导的半监督终身目标重识别方法及系统', '实审', 'ZL2025001259', '202610556947.3', '2026-04-24'],
    ['一种免训练的图像伪造定位方法和系统', '实审', 'ZL2025001922', '202611055089.0', '2026-07-16'],
    ['基于视觉文本属性解耦强化的终身行人重识别方法及系统', '实审', 'ZL2025001897', '202610902462.5', '2026-06-23'],
    ['一种基于语义互补的视觉令牌裁剪方法和多模态大语言模型推理方法及装置', '授权', 'ZL2025001888', '202611055966.4', '2026-07-16', '2026-10-20'],
    ['一种基于提示对齐的域增量学习方法及系统', '实审', 'ZL2025000825', '202510843552.7', '2025-06-23'],
    ['一种基于细节精炼的状态空间模型视频语义分割方法', '实审', 'ZL2025001894', '202611055090.3', '2026-07-16'],
    ['基于子分布协同强化的换装终身行人重识别方法及系统', '实审', 'ZL2025001895', '202610556945.4', '2026-04-24'],
    ['一种基于取证线索解耦与自适应聚合的图像篡改定位方法及装置', '初审合格', 'ZL2025001921', '202610879964.0', '2026-06-17'],
    ['一种基于选择性提示的视觉Mamba模型微调的方法', '授权', 'ZL2024001243', '202411591530.8', '2024-11-08', '2026-05-26'],
    ['一种基于点级提示的一体化点云去噪与分析方法', '受理', 'ZL2025001338', '2025114589522', '2025-10-13'],
    ['图文检索模型训练方法、装置、电子设备及存储介质', '受理', 'ZL2024000319', '202410132716.0', '2024-01-30']
  ];
  const inventorsByApplication = {
    '202610556947.3': '周嘉欢；徐昆仑',
    '202611055089.0': '周嘉欢；徐昆仑；梁俊杰；卢志强',
    '202610902462.5': '周嘉欢；徐昆仑；程浩桐',
    '202611055966.4': '周嘉欢；梁俊杰',
    '202510843552.7': '周嘉欢；徐昆仑',
    '202611055090.3': '周嘉欢；祝凯',
    '202610556945.4': '周嘉欢；徐昆仑；马梁育',
    '202610879964.0': '周嘉欢；徐昆仑；姚勇',
    '202411591530.8': '周嘉欢；姚艺峰；刘子宸；彭宇新',
    '2025114589522': '周嘉欢；艾子翔；彭宇新',
    '202410132716.0': '周嘉欢；朱曼瑜；王珣'
  };
  const list = document.querySelector('#records-list');
  if (!list) return;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  };
  const projectsPage = document.body.dataset.page === 'Fundings';
  if (!projectsPage) {
    const isGranted = patent => patent[1] === '授权' || String(patent[1]) === '9';
    const sorted = [...patents].sort((a, b) => b[4].localeCompare(a[4]));
    list.classList.remove('records-table-wrap');
    [['Granted Patents', true], ['Patents Under Examination', false]].forEach(([label, granted]) => {
      const group = make('section', 'patent-status-group', '');
      const heading = make('h2', '', label);
      const wrap = make('div', 'records-table-wrap', '');
      const table = make('table', 'alumni-table records-table patents-table', '');
      const head = make('thead', '', '');
      const header = make('tr', '', '');
      const columns = ['No.', 'Patent Title', 'Certificate No.', 'Application No.', 'Inventors'];
      columns.push(granted ? 'Grant Date' : 'Filing Date');
      columns.forEach(label => {
        const cell = make('th', '', label);
        cell.scope = 'col';
        header.append(cell);
      });
      head.append(header);
      const body = make('tbody', '', '');
      sorted.filter(patent => isGranted(patent) === granted).forEach(([title, status, certificate, application, date, grantDate], index) => {
        const row = make('tr', '', '');
        const values = [index + 1, title, certificate, application, inventorsByApplication[application] || '—', granted ? grantDate || '—' : date];
        const certificates = {
          '202611055966.4': 'common/files/patents/2026110559664-certificate.pdf',
          '202411591530.8': 'common/files/patents/2024115915308-certificate.png'
        };
        values.forEach((value, column) => {
          const cell = make('td', '', value);
          if (column === 1 && granted && certificates[application]) {
            const link = make('a', 'patent-certificate-link', title);
            link.href = certificates[application];
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            cell.replaceChildren(link);
          }
          row.append(cell);
        });
        body.append(row);
      });
      table.append(head, body);
      wrap.append(table);
      group.append(heading, wrap);
      list.append(group);
    });
    return;
  }

  const table = make('table', 'alumni-table records-table', '');
  if (!projectsPage) table.classList.add('patents-table');
  const head = make('thead', '', '');
  const header = make('tr', '', '');
  (projectsPage ? ['No.', 'Organization / Type', 'Project Title', 'Role', 'Start Date', 'End Date'] : ['序号', '案件名称', '证书编号', '申请号', '申请日', '专利状态']).forEach(label => {
    const th = make('th', '', label);
    th.scope = 'col';
    header.append(th);
  });
  head.append(header);
  const body = make('tbody', '', '');
  if (projectsPage) {
    [...events].sort((a, b) => b[4].split('–')[0].localeCompare(a[4].split('–')[0])).forEach(([title, organization, number, role, period], index) => {
      const dates = period.split('–');
      const organizationLabel = /有限公司/.test(organization) ? `校企合作-${organization}` : organization;
      const row = make('tr', '', '');
      const titleCell = make('td', '', title);
      if (number) titleCell.append(' ', make('span', 'project-number', `（编号：${number}）`));
      row.append(make('td', '', index + 1), make('td', '', organizationLabel), titleCell);
      [role, dates[0] || '—', dates[1] || '—'].forEach(value => row.append(make('td', '', value)));
      body.append(row);
    });
  } else {
    [...patents].sort((a, b) => b[4].localeCompare(a[4])).forEach(([title, status, caseNumber, applicationNumber, date], index) => {
      const row = make('tr', '', '');
      const caseStatus = status === '授权' || String(status) === '9' ? '已授权' : '审查中';
      [index + 1, title, caseNumber, applicationNumber, date, caseStatus].forEach(value => row.append(make('td', '', value)));
      body.append(row);
    });
  }
  table.append(head, body);
  list.append(table);
})();
