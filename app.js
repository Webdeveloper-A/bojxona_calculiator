const FALLBACK_USD = 12158.59;
const FALLBACK_BHM = 412000;
const HISTORY_KEY = 'bojxona_calc_history_v2';

const bydRates = [
  { min: 0, max: 10000, multiplier: 1, label: '10 000 USDgacha' },
  { min: 10000, max: 20000, multiplier: 1.5, label: '10 000 - 20 000 USD' },
  { min: 20000, max: 40000, multiplier: 2.5, label: '20 000 - 40 000 USD' },
  { min: 40000, max: 60000, multiplier: 4, label: '40 000 - 60 000 USD' },
  { min: 60000, max: 100000, multiplier: 7, label: '60 000 - 100 000 USD' },
  { min: 100000, max: 200000, multiplier: 10, label: '100 000 - 200 000 USD' },
  { min: 200000, max: 500000, multiplier: 15, label: '200 000 - 500 000 USD' },
  { min: 500000, max: 1000000, multiplier: 20, label: '500 000 - 1 000 000 USD' },
  { min: 1000000, max: Infinity, multiplier: 25, label: '1 000 000 USD va undan ortiq' }
];

const serviceDefinitions = [
  {
    key: 'transit',
    title: 'Tranzit / qayta ishlash rejimi',
    note: 'Bir deklaratsiya uchun BHMning 25 foizi.',
    kind: 'simple-multiplier',
    multiplier: 0.25,
    rateLabel: 'BHM 0.25x',
    fields: [
      { key: 'qty', label: 'Deklaratsiyalar soni', type: 'number', min: 1, step: 1, value: 1 }
    ]
  },
  {
    key: 'cashfx',
    title: 'Yuridik shaxs naqd chet el valyutasi',
    note: 'Bir deklaratsiya uchun BHMning 2.5 baravari.',
    kind: 'simple-multiplier',
    multiplier: 2.5,
    rateLabel: 'BHM 2.5x',
    fields: [
      { key: 'qty', label: 'Deklaratsiyalar soni', type: 'number', min: 1, step: 1, value: 1 }
    ]
  },
  {
    key: 'order',
    title: 'Bojxona kirim orderi',
    note: 'Bir order uchun BHMning 25 foizi.',
    kind: 'simple-multiplier',
    multiplier: 0.25,
    rateLabel: 'BHM 0.25x',
    fields: [
      { key: 'qty', label: 'Orderlar soni', type: 'number', min: 1, step: 1, value: 1 }
    ]
  },
  {
    key: 'courier',
    title: "Xalqaro kuryer jo'natmasi",
    note: 'Har 1 kg brutto uchun BHMning 2 foizi. Vazn 1 kg birlikka yaxlitlanadi.',
    kind: 'courier',
    multiplier: 0.02,
    rateLabel: 'BHM 0.02x / kg',
    fields: [
      { key: 'kg', label: 'Brutto vazn (kg)', type: 'number', min: 0.1, step: 0.1, value: 1.2 }
    ]
  },
  {
    key: 'byd-edit',
    title: 'BYDga o\'zgartirish / qo\'shimcha',
    note: 'Bir BYD yoki tuzatish shakli uchun BHMning 25 foizi.',
    kind: 'simple-multiplier',
    multiplier: 0.25,
    rateLabel: 'BHM 0.25x',
    fields: [
      { key: 'qty', label: 'BYD soni', type: 'number', min: 1, step: 1, value: 1 }
    ]
  },
  {
    key: 'after-hours-byd',
    title: "Ish vaqtidan tashqari BYD",
    note: 'Har bir BYD uchun BHMning 25 foizi.',
    kind: 'simple-multiplier',
    multiplier: 0.25,
    rateLabel: 'BHM 0.25x',
    fields: [
      { key: 'qty', label: 'BYD soni', type: 'number', min: 1, step: 1, value: 1 }
    ]
  },
  {
    key: 'inspection-worktime',
    title: 'Ko\'rik / yuk operatsiyasi (ish vaqtida)',
    note: 'Har boshlanmagan bo\'lsa ham to\'liq 1 soat deb olinadi: BHMning 25 foizi.',
    kind: 'hours',
    multiplier: 0.25,
    rateLabel: 'BHM 0.25x / soat',
    fields: [
      { key: 'hours', label: 'Soat', type: 'number', min: 0.1, step: 0.1, value: 1.2 }
    ]
  },
  {
    key: 'inspection-offtime',
    title: 'Ko\'rik / yuk operatsiyasi (ish vaqtidan tashqari)',
    note: 'Dam olish/bayram yoki ish vaqtidan tashqari: BHMning 2 baravari.',
    kind: 'hours',
    multiplier: 2,
    rateLabel: 'BHM 2x / soat',
    fields: [
      { key: 'hours', label: 'Soat', type: 'number', min: 0.1, step: 0.1, value: 1 }
    ]
  },
  {
    key: 'warehouse',
    title: 'Bojxona omborida saqlash',
    note: 'Dastlabki 10 sutka uchun 3%, keyingi sutkalar uchun 4%. Har to\'liq yoki to\'liq bo\'lmagan 1 tonna bo\'yicha.',
    kind: 'warehouse',
    rateLabel: '0.03x / 0.04x',
    fields: [
      { key: 'tons', label: 'Brutto og\'irlik (tonna)', type: 'number', min: 0.1, step: 0.1, value: 1.3 },
      { key: 'days', label: 'Sutkalar soni', type: 'number', min: 1, step: 1, value: 12 }
    ]
  },
  {
    key: 'escort',
    title: 'Bojxona hamrohligida kuzatib borish',
    note: '200 km gacha — BHM 2x, 200 km dan ortiq — BHM 5x. Har avtotransport vositasi uchun.',
    kind: 'escort',
    rateLabel: 'BHM 2x / 5x',
    fields: [
      { key: 'distance', label: 'Masofa (km)', type: 'number', min: 1, step: 1, value: 180 },
      { key: 'vehicles', label: 'Avtotransport vositalari soni', type: 'number', min: 1, step: 1, value: 1 }
    ]
  },
  {
    key: 'preliminary-decision',
    title: 'Tovar bo\'yicha dastlabki qaror',
    note: 'Bir qaror uchun BHMning 75 foizi.',
    kind: 'simple-multiplier',
    multiplier: 0.75,
    rateLabel: 'BHM 0.75x',
    fields: [
      { key: 'qty', label: 'Qarorlar soni', type: 'number', min: 1, step: 1, value: 1 }
    ]
  },
  {
    key: 'temp-storage-individual',
    title: 'Jismoniy shaxs tovarlarini vaqtincha saqlash',
    note: 'Har boshlanadigan 100 kg va har kun uchun: dastlabki 5 kunda 5%, keyingi 10 kunda 7%, qolganida 10%, tez buziladiganlarda 15%.',
    kind: 'temp-storage-individual',
    rateLabel: '0.05x / 0.07x / 0.10x / 0.15x',
    fields: [
      { key: 'weight', label: 'Og\'irlik (kg)', type: 'number', min: 1, step: 1, value: 240 },
      { key: 'days', label: 'Kunlar soni', type: 'number', min: 1, step: 1, value: 6 },
      { key: 'perishable', label: 'Tez buziladigan', type: 'checkbox', value: false }
    ]
  },
  {
    key: 'transit-edit',
    title: 'Tranzit deklaratsiyasiga o\'zgartirish',
    note: 'Bir murojaat uchun BHMning 10 foizi.',
    kind: 'simple-multiplier',
    multiplier: 0.10,
    rateLabel: 'BHM 0.10x',
    fields: [
      { key: 'qty', label: 'Murojaatlar soni', type: 'number', min: 1, step: 1, value: 1 }
    ]
  },
  {
    key: 'ip-registry',
    title: 'Intellektual mulk obyektini reyestrga kiritish',
    note: 'Bir obyekt uchun BHMning 1 baravari.',
    kind: 'simple-multiplier',
    multiplier: 1,
    rateLabel: 'BHM 1x',
    fields: [
      { key: 'qty', label: 'Obyektlar soni', type: 'number', min: 1, step: 1, value: 1 }
    ]
  }
];

const scenarioCards = [
  { title: 'Kichik partiya', usd: 8000, summary: '10 000 USDgacha tushadi, BHM 1x.' },
  { title: 'O\'rta partiya', usd: 25000, summary: '20 000 - 40 000 USD oralig\'i, BHM 2.5x.' },
  { title: 'Yirik partiya', usd: 220000, summary: '200 000 - 500 000 USD oralig\'i, BHM 15x.' }
];

const qs = (id) => document.getElementById(id);

const fmt = new Intl.NumberFormat('uz-UZ');
const fmt2 = new Intl.NumberFormat('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (n) => `${fmt.format(Math.round(n))} so'm`;
const money2 = (n) => `${fmt2.format(Number(n) || 0)} so'm`;
const usdStr = (n) => `${fmt2.format(Number(n) || 0)} USD`;

function setHeroUsd(rate, meta = 'CBU bo\'yicha') {
  qs('heroUsd').textContent = money2(rate);
  qs('heroUsdMeta').textContent = meta;
}

function setHeroBhm(bhm) {
  qs('heroBhm').textContent = money(bhm);
}

function findBydBracket(valueUsd) {
  return bydRates.find((item) => valueUsd >= item.min && valueUsd < item.max) || bydRates[bydRates.length - 1];
}

function calcByd() {
  const customsUsd = Number(qs('bydCustomsUsd').value || 0);
  const usdRate = Number(qs('bydUsdRate').value || 0);
  const bhm = Number(qs('bydBhm').value || 0);
  const mode = qs('bydMode').value;
  const regime = qs('bydRegime').value;
  const applyDiscount = qs('applyDiscount').checked && mode === 'preliminary';
  const notes = qs('bydNotes').value.trim();

  setHeroUsd(usdRate, 'Joriy input');
  setHeroBhm(bhm);

  if (regime === 'exempt') {
    const result = {
      type: 'BYD',
      title: 'BYD - imtiyozli rejim',
      total: 0,
      summary: 'Mazkur rejim bo\'yicha yig\'im undirilmaydi.',
      detail: `Rejim: ${qs('bydRegime').selectedOptions[0].text}. ${notes ? `Izoh: ${notes}.` : ''}`
    };
    qs('bydRange').textContent = 'Imtiyozli rejim';
    qs('bydMultiplier').textContent = '0';
    qs('bydTotal').textContent = money(0);
    qs('bydTotalUsd').textContent = usdStr(0);
    qs('bydExplain').textContent = result.detail;
    return result;
  }

  const bracket = findBydBracket(customsUsd);
  const baseFee = bracket.multiplier * bhm;
  const discount = applyDiscount ? baseFee * 0.2 : 0;
  const total = baseFee - discount;
  const totalUsd = usdRate > 0 ? total / usdRate : 0;

  qs('bydRange').textContent = bracket.label;
  qs('bydMultiplier').textContent = `BHM ${bracket.multiplier}x`;
  qs('bydTotal').textContent = money(total);
  qs('bydTotalUsd').textContent = usdStr(totalUsd);
  qs('bydExplain').textContent = `${fmt2.format(customsUsd)} USD qiymat ${bracket.label} intervaliga tushdi. Bazaviy yig'im ${money(baseFee)}. ${applyDiscount ? `Dastlabki deklaratsiyalash uchun ${money(discount)} chegirma qo'llandi.` : 'Chegirma qo\'llanmadi.'} ${notes ? `Izoh: ${notes}.` : ''}`;

  return {
    type: 'BYD',
    title: 'BYD hisob-kitobi',
    total,
    summary: `${bracket.label} → BHM ${bracket.multiplier}x`,
    detail: qs('bydExplain').textContent
  };
}

function roundStarted(value, minimum = 1) {
  return Math.max(minimum, Math.ceil(Number(value) || 0));
}

function roundCourierKg(value) {
  return Math.max(1, Math.round(Number(value) || 0));
}

function getCurrentService() {
  return serviceDefinitions.find((item) => item.key === qs('serviceType').value) || serviceDefinitions[0];
}

function renderServiceOptions() {
  qs('serviceType').innerHTML = serviceDefinitions.map((service) => `<option value="${service.key}">${service.title}</option>`).join('');
}

function renderServiceFields() {
  const service = getCurrentService();
  qs('serviceDynamicFields').innerHTML = service.fields.map((field) => {
    if (field.type === 'checkbox') {
      return `
        <div class="panel-inner">
          <div class="checkbox-row">
            <input id="field-${field.key}" type="checkbox" ${field.value ? 'checked' : ''} />
            <label for="field-${field.key}">${field.label}</label>
          </div>
        </div>
      `;
    }

    return `
      <div>
        <label for="field-${field.key}">${field.label}</label>
        <input id="field-${field.key}" type="${field.type}" min="${field.min ?? ''}" step="${field.step ?? ''}" value="${field.value ?? ''}" />
      </div>
    `;
  }).join('');
}

function readField(key) {
  const el = qs(`field-${key}`);
  if (!el) return null;
  if (el.type === 'checkbox') return el.checked;
  return Number(el.value || 0);
}

function calcService() {
  const service = getCurrentService();
  const bhm = Number(qs('serviceBhm').value || 0);
  let total = 0;
  let normalized = '';
  let formula = service.rateLabel;
  let note = service.note;

  if (service.kind === 'simple-multiplier') {
    const qty = roundStarted(readField('qty'));
    total = service.multiplier * bhm * qty;
    normalized = `${qty}`;
    formula = `BHM × ${service.multiplier} × ${qty}`;
  }

  if (service.kind === 'hours') {
    const hours = roundStarted(readField('hours'));
    total = service.multiplier * bhm * hours;
    normalized = `${hours} soat`;
    formula = `BHM × ${service.multiplier} × ${hours}`;
  }

  if (service.kind === 'courier') {
    const kgRaw = readField('kg');
    const kg = roundCourierKg(kgRaw);
    total = service.multiplier * bhm * kg;
    normalized = `${fmt2.format(kgRaw)} kg → ${kg} kg`;
    formula = `BHM × 0.02 × ${kg}`;
  }

  if (service.kind === 'warehouse') {
    const tonsRaw = readField('tons');
    const days = roundStarted(readField('days'));
    const tons = roundStarted(tonsRaw);
    const firstDays = Math.min(days, 10);
    const nextDays = Math.max(days - 10, 0);
    total = (firstDays * 0.03 * bhm * tons) + (nextDays * 0.04 * bhm * tons);
    normalized = `${fmt2.format(tonsRaw)} t → ${tons} t, ${days} sutka`;
    formula = `(${firstDays} × 0.03 × BHM × ${tons}) + (${nextDays} × 0.04 × BHM × ${tons})`;
  }

  if (service.kind === 'escort') {
    const distance = roundStarted(readField('distance'));
    const vehicles = roundStarted(readField('vehicles'));
    const multiplier = distance <= 200 ? 2 : 5;
    total = multiplier * bhm * vehicles;
    normalized = `${distance} km, ${vehicles} avto`;
    formula = `BHM × ${multiplier} × ${vehicles}`;
    note = distance <= 200 ? '200 km gacha tarif qo\'llandi.' : '200 km dan ortiq tarif qo\'llandi.';
  }

  if (service.kind === 'temp-storage-individual') {
    const weight = roundStarted(readField('weight'));
    const days = roundStarted(readField('days'));
    const perishable = Boolean(readField('perishable'));
    const blocks = Math.ceil(weight / 100);

    if (perishable) {
      total = days * 0.15 * bhm * blocks;
      formula = `${days} × 0.15 × BHM × ${blocks}`;
      note = 'Tez buziladigan tovarlar uchun 15% qo\'llandi.';
    } else {
      const d1 = Math.min(days, 5);
      const d2 = Math.min(Math.max(days - 5, 0), 10);
      const d3 = Math.max(days - 15, 0);
      total = (d1 * 0.05 * bhm * blocks) + (d2 * 0.07 * bhm * blocks) + (d3 * 0.10 * bhm * blocks);
      formula = `(${d1} × 0.05 × BHM × ${blocks}) + (${d2} × 0.07 × BHM × ${blocks}) + (${d3} × 0.10 × BHM × ${blocks})`;
      note = 'Oddiy tovarlar uchun kun oralig\'i bo\'yicha progressiv stavka qo\'llandi.';
    }

    normalized = `${weight} kg → ${blocks} × 100kg blok, ${days} kun`;
  }

  qs('serviceFormula').textContent = formula;
  qs('serviceNormalized').textContent = normalized;
  qs('serviceTotal').textContent = money(total);
  qs('serviceShortNote').textContent = service.title;
  qs('serviceExplain').textContent = `${service.note} ${note}`;

  return {
    type: 'Xizmat',
    title: service.title,
    total,
    summary: normalized,
    detail: `${formula}. ${service.note} ${note}`
  };
}

function buildRateRows() {
  const rows = [];
  bydRates.forEach((item, idx) => {
    rows.push({
      no: idx + 1,
      section: 'BYD',
      name: item.label,
      rate: `BHM ${item.multiplier}x`,
      note: 'Bojxona qiymati intervali bo\'yicha.'
    });
  });

  rows.push(
    { no: 10, section: 'Xizmat', name: 'Tranzit / qayta ishlash', rate: 'BHM 0.25x', note: 'Har deklaratsiya uchun.' },
    { no: 11, section: 'Xizmat', name: 'Naqd chet el valyutasi', rate: 'BHM 2.5x', note: 'Har deklaratsiya uchun.' },
    { no: 12, section: 'Xizmat', name: 'Bojxona kirim orderi', rate: 'BHM 0.25x', note: 'Har order uchun.' },
    { no: 13, section: 'Xizmat', name: 'Xalqaro kuryer', rate: 'BHM 0.02x / kg', note: 'Yaxlitlangan kg bo\'yicha.' },
    { no: 14, section: 'Xizmat', name: 'BYDga o\'zgartirish', rate: 'BHM 0.25x', note: 'Har BYD uchun.' },
    { no: 15, section: 'Xizmat', name: 'Ish vaqtidan tashqari BYD', rate: 'BHM 0.25x', note: 'Har BYD uchun.' },
    { no: 16, section: 'Xizmat', name: 'Ko\'rik / yuk operatsiyasi', rate: 'BHM 0.25x yoki 2x / soat', note: 'Soat yuqoriga yaxlitlanadi.' },
    { no: 17, section: 'Xizmat', name: 'Bojxona omborida saqlash', rate: '3% / 4%', note: '1 tonna va sutka bo\'yicha.' },
    { no: 18, section: 'Xizmat', name: 'Hamrohlikda kuzatib borish', rate: 'BHM 2x yoki 5x', note: 'Masofaga qarab.' },
    { no: 19, section: 'Xizmat', name: 'Dastlabki qaror', rate: 'BHM 0.75x', note: 'Har qaror uchun.' },
    { no: 20, section: 'Xizmat', name: 'Jismoniy shaxs vaqtincha saqlash', rate: '5% / 7% / 10% / 15%', note: '100kg va kun bo\'yicha.' },
    { no: 21, section: 'Xizmat', name: 'Tranzit deklaratsiyasiga o\'zgartirish', rate: 'BHM 0.10x', note: 'Har murojaat uchun.' },
    { no: 22, section: 'Xizmat', name: 'IP obyektini reyestrga kiritish', rate: 'BHM 1x', note: 'Har obyekt uchun.' }
  );

  return rows;
}

function renderRateTable() {
  qs('ratesBody').innerHTML = buildRateRows().map((row) => `
    <tr>
      <td>${row.no}</td>
      <td>${row.section}</td>
      <td>${row.name}</td>
      <td>${row.rate}</td>
      <td>${row.note}</td>
    </tr>
  `).join('');
}

function renderScenarioCards() {
  const bhm = Number(qs('bydBhm').value || FALLBACK_BHM);
  qs('scenarioCards').innerHTML = scenarioCards.map((card) => {
    const bracket = findBydBracket(card.usd);
    const total = bracket.multiplier * bhm;
    return `
      <div class="quick-card">
        <span>Tayyor ssenariy</span>
        <h3>${card.title}</h3>
        <p>${card.summary}</p>
        <strong>${money(total)}</strong>
      </div>
    `;
  }).join('');
}

function drawChart() {
  const canvas = qs('rateChart');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const pad = { top: 24, right: 20, bottom: 70, left: 54 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const max = Math.max(...bydRates.map((item) => item.multiplier));

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#081321';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(148,163,184,0.2)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i += 1) {
    const y = pad.top + (chartH / 5) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
  }

  const barGap = 12;
  const barWidth = (chartW - barGap * (bydRates.length - 1)) / bydRates.length;
  bydRates.forEach((item, idx) => {
    const x = pad.left + idx * (barWidth + barGap);
    const h = (item.multiplier / max) * chartH;
    const y = pad.top + chartH - h;

    const grad = ctx.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0, '#4fc3f7');
    grad.addColorStop(1, '#2bd7a0');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, barWidth, h);

    ctx.fillStyle = '#dbeafe';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(`${item.multiplier}x`, x + 6, y - 8);

    ctx.save();
    ctx.translate(x + 8, height - 10);
    ctx.rotate(-Math.PI / 4);
    ctx.fillStyle = '#95a8c2';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(item.label, 0, 0);
    ctx.restore();
  });

  ctx.fillStyle = '#95a8c2';
  ctx.font = '12px Inter, sans-serif';
  ctx.fillText('BHM ko‘paytmasi', 12, 18);
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function setHistory(items) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
}

function saveHistory(entry) {
  const items = getHistory();
  items.unshift({ ...entry, at: new Date().toLocaleString('uz-UZ') });
  setHistory(items.slice(0, 30));
  renderHistory();
}

function renderHistory() {
  const items = getHistory();
  if (!items.length) {
    qs('historyList').innerHTML = '<div class="history-empty">Hozircha tarix bo\'sh. Kamida bitta hisob-kitobni saqlang.</div>';
    return;
  }

  qs('historyList').innerHTML = items.map((item, idx) => `
    <div class="history-item">
      <h4>${idx + 1}. ${item.title}</h4>
      <div class="history-meta">${item.at} · ${money(item.total)}</div>
      <pre>${item.summary}\n${item.detail}</pre>
    </div>
  `).join('');
}

async function refreshUsdRate() {
  try {
    const res = await fetch('https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/');
    if (!res.ok) throw new Error('CBU response not ok');
    const data = await res.json();
    const item = Array.isArray(data) ? data[0] : null;
    const rate = Number(item?.Rate || FALLBACK_USD);
    const date = item?.Date || 'CBU';
    qs('bydUsdRate').value = rate;
    setHeroUsd(rate, `Yangilandi: ${date}`);
    calcByd();
    return rate;
  } catch (error) {
    qs('bydUsdRate').value = FALLBACK_USD;
    setHeroUsd(FALLBACK_USD, 'Fallback kurs');
    calcByd();
    return FALLBACK_USD;
  }
}

function exportHistoryJson() {
  const blob = new Blob([JSON.stringify(getHistory(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bojxona-kalkulyator-tarix.json';
  a.click();
  URL.revokeObjectURL(url);
}

function initTabs() {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab').forEach((tab) => tab.classList.add('hidden'));
      btn.classList.add('active');
      qs(btn.dataset.tab).classList.remove('hidden');
    });
  });
}

function bindEvents() {
  qs('refreshRatesBtn').addEventListener('click', refreshUsdRate);
  qs('printBtn').addEventListener('click', () => window.print());

  qs('calcBydBtn').addEventListener('click', calcByd);
  qs('saveBydBtn').addEventListener('click', () => saveHistory(calcByd()));
  qs('bydBhm').addEventListener('input', () => {
    const bhm = Number(qs('bydBhm').value || 0);
    qs('serviceBhm').value = bhm;
    setHeroBhm(bhm);
    renderScenarioCards();
  });

  qs('serviceType').addEventListener('change', () => {
    renderServiceFields();
    calcService();
  });
  qs('calcServiceBtn').addEventListener('click', calcService);
  qs('saveServiceBtn').addEventListener('click', () => saveHistory(calcService()));
  qs('exportJsonBtn').addEventListener('click', exportHistoryJson);
  qs('clearHistoryBtn').addEventListener('click', () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  });
}

function init() {
  renderServiceOptions();
  renderServiceFields();
  renderRateTable();
  renderScenarioCards();
  drawChart();
  renderHistory();
  initTabs();
  bindEvents();
  calcByd();
  calcService();
}

init();
