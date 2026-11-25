"use strict";
const $ = id => document.getElementById(id);
const el = (t, c, txt) => { const e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; };

/* ---------- TABS ---------- */
const tabBtns = [...document.querySelectorAll('#tabs button')], panels = [...document.querySelectorAll('.tab')];
function showTab(id) {
  if (!panels.some(p => p.id === id)) id = 'overview';
  panels.forEach(p => p.hidden = p.id !== id);
  tabBtns.forEach(b => { const on = b.dataset.tab === id; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
  if (id === 'curves') drawCurve();
  if (id !== 'game' && game.running) { game.running = false; game.paused = true; }
  if (id === 'game' && game.paused) { game.paused = false; game.running = true; kick(); }
  $('tabs').classList.remove('open'); $('tabs').previousElementSibling.setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
}
tabBtns.forEach(b => b.addEventListener('click', () => { location.hash = b.dataset.tab; }));
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => { location.hash = b.dataset.go; }));
window.addEventListener('hashchange', () => showTab(location.hash.slice(1)));
document.querySelector('.menu-toggle').addEventListener('click', e => { const o = $('tabs').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', o); });

/* ---------- GALLERY ---------- */
for (const p of galleryPhotos) {
  const card = el('article', 'photo-card'); card.dataset.category = p.category;
  const btn = el('button', 'photo-open'); btn.type = 'button'; btn.setAttribute('aria-label', 'Open ' + p.title);
  const img = el('img'); img.src = p.src; img.alt = p.title + ': ' + p.description; img.loading = 'lazy';
  img.addEventListener('error', () => btn.classList.add('broken'));
  btn.append(img); btn.addEventListener('click', () => openPhoto(p));
  const info = el('div', 'info'); info.append(el('span', '', p.author), el('h3', '', p.title), el('p', '', p.description));
  card.append(btn, info); $('photo-grid').append(card);
}
document.querySelectorAll('.filter').forEach(f => f.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(x => { x.classList.toggle('active', x === f); x.setAttribute('aria-pressed', x === f); });
  document.querySelectorAll('.photo-card').forEach(c => c.hidden = f.dataset.filter !== 'all' && c.dataset.category !== f.dataset.filter);
}));
const lb = $('lightbox'); let prevFocus = null;
function openPhoto(p) { prevFocus = document.activeElement; $('lightbox-image').src = p.src; $('lightbox-image').alt = p.title; $('lightbox-caption').textContent = p.title + ' — ' + p.description; lb.hidden = false; $('lightbox-close').focus(); }
function closePhoto() { lb.hidden = true; $('lightbox-image').removeAttribute('src'); if (prevFocus) prevFocus.focus(); }
$('lightbox-close').addEventListener('click', closePhoto); lb.addEventListener('click', e => { if (e.target === lb) closePhoto(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) closePhoto(); });

/* ---------- USEFUL VS WEAK ---------- */
const uses = [
  ['☀️ Solar panels', 'Clean electricity from sunny roofs; low running cost.', 'Only works in daylight, needs storage, and making panels uses energy.'],
  ['🚗 Cars', 'Flexible, door to door, good for rural trips.', 'Petrol and diesel cars emit CO₂ and cause traffic. Electric cars help, but still need batteries and space.'],
  ['🚆 Trains and buses', 'Low emissions per passenger and no parking problems.', 'Need frequent services and good links to the final destination.'],
  ['🚲 Bikes', 'Zero emissions, cheap and healthy.', 'Need safe lanes; rain, heat and hills put people off.'],
  ['🌳 Trees', 'Shade, cooler air, water storage and CO₂ capture.', 'Take years to grow and need water in droughts.'],
  ['🏠 Insulation and heat pumps', 'Use much less energy to heat and cool.', 'High upfront cost, and old buildings are harder to upgrade.']
];
for (const [n, g, b] of uses) { const c = el('article', 'card use'); c.append(el('h3', '', n), el('b', 'good', 'Useful'), el('p', '', g), el('b', 'bad', 'Weak spot'), el('p', '', b)); $('uses').append(c); }

/* ---------- PLEDGES ---------- */
const pledgeList = ['I will walk, cycle or use public transport once a week', 'I will switch off devices and lights I do not use', 'I will repair or reuse before buying new', 'I will avoid wasting food', 'I will plant or protect a tree or green space', 'I will tell a friend about SDG 13'];
function updatePledges() { const n = document.querySelectorAll('#pledges input:checked').length; $('pledge-bar').style.width = n / pledgeList.length * 100 + '%'; $('pledge-text').textContent = n + ' of ' + pledgeList.length + ' pledges' + (n === pledgeList.length ? ' — great work!' : ''); }
pledgeList.forEach(t => { const l = el('label'); const i = el('input'); i.type = 'checkbox'; i.addEventListener('change', updatePledges); l.append(i, t); $('pledges').append(l); });

/* ---------- CURVES ---------- */
// Values are rounded approximations of published datasets (NASA GISS, NOAA Mauna Loa, IPCC pathways). Check the sources before submitting.
const gameCurve = [], progCurve = [];
const curves = {
  co2: { title: 'CO₂ in the air (ppm)', xl: 'year', note: 'Rounded values from the Mauna Loa observatory record. Source: NOAA / Scripps.', s: [{ n: 'CO₂ ppm', p: [[1960, 317], [1970, 326], [1980, 339], [1990, 354], [2000, 369], [2010, 389], [2020, 414], [2024, 423]] }] },
  temp: { title: 'Global temperature change (°C, vs 1951–1980)', xl: 'year', note: 'Rounded values based on NASA GISS. Source: climate.nasa.gov.', s: [{ n: '°C', p: [[1880, -.17], [1900, -.08], [1920, -.27], [1940, .12], [1960, -.03], [1980, .26], [2000, .42], [2010, .72], [2020, 1.02], [2024, 1.28]] }] },
  path: { title: 'Emissions pathways (index, 2020 = 100)', xl: 'year', note: 'Illustrative only. The 1.5 °C path means roughly halving emissions by 2030 and reaching net zero around 2050 (IPCC).', s: [{ n: '1.5 °C path', p: [[2020, 100], [2030, 57], [2040, 25], [2050, 0]] }, { n: 'Current policies (illustrative)', p: [[2020, 100], [2030, 98], [2040, 95], [2050, 90]] }] },
  game: { title: 'Your Climate Clash match: climate health (%)', xl: 'seconds', note: 'Play a match in the Climate Clash tab. This curve follows how strong the good side is.', s: [{ n: 'Climate health %', p: gameCurve }] },
  prog: { title: 'Your Eco Leaves 🍃 after each match', xl: 'match', note: 'Every match you play adds a point. Win to climb and unlock new arenas.', s: [{ n: 'Eco Leaves', p: progCurve }] }
};
let curKey = 'co2';
for (const k in curves) { const b = el('button', 'filter' + (k === curKey ? ' active' : ''), { co2: 'CO₂', temp: 'Temperature', path: 'Pathways', game: 'My game', prog: 'My progress' }[k]); b.addEventListener('click', () => { curKey = k; document.querySelectorAll('#curve-btns .filter').forEach(x => x.classList.toggle('active', x === b)); $('curve-slider').value = 100; drawCurve(); }); $('curve-btns').append(b); }
const NS = 'http://www.w3.org/2000/svg', sv = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
function interp(p, x) { if (!p.length) return null; if (x <= p[0][0]) return p[0][1]; for (let i = 1; i < p.length; i++) if (x <= p[i][0]) { const [x0, y0] = p[i - 1], [x1, y1] = p[i]; return x1 === x0 ? y1 : y0 + (y1 - y0) * (x - x0) / (x1 - x0); } return p[p.length - 1][1]; }
function drawCurve() {
  const c = curves[curKey], svg = $('chart'); svg.replaceChildren(); $('curve-title').textContent = c.title; $('curve-note').textContent = c.note;
  const all = c.s.flatMap(s => s.p); if (!all.length) { const t = sv('text', { x: 300, y: 150, 'text-anchor': 'middle' }); t.textContent = 'No data yet. Play a match first!'; svg.append(t); $('curve-read').textContent = ''; return; }
  let x0 = Math.min(...all.map(a => a[0])), x1 = Math.max(...all.map(a => a[0])), y0 = Math.min(...all.map(a => a[1])), y1 = Math.max(...all.map(a => a[1]));
  if (curKey === 'game') { y0 = 0; y1 = 100; } if (x1 === x0) x1 = x0 + 1; if (y1 === y0) y1 = y0 + 1;
  const X = v => 50 + (v - x0) / (x1 - x0) * 520, Y = v => 260 - (v - y0) / (y1 - y0) * 230;
  for (let i = 0; i <= 4; i++) { const v = y0 + (y1 - y0) * i / 4, y = Y(v); svg.append(sv('line', { x1: 50, x2: 570, y1: y, y2: y, class: 'ax' })); const t = sv('text', { x: 44, y: y + 4, 'text-anchor': 'end' }); t.textContent = Math.round(v * 10) / 10; svg.append(t); }
  for (let i = 0; i <= 4; i++) { const v = x0 + (x1 - x0) * i / 4, t = sv('text', { x: X(v), y: 282, 'text-anchor': 'middle' }); t.textContent = Math.round(v); svg.append(t); }
  c.s.forEach((s, i) => svg.append(sv('polyline', { points: s.p.map(q => X(q[0]) + ',' + Y(q[1])).join(' '), class: 'l' + i })));
  const sx = x0 + (x1 - x0) * $('curve-slider').value / 100; svg.append(sv('line', { x1: X(sx), x2: X(sx), y1: 30, y2: 260, class: 'mk' }));
  $('curve-read').textContent = ({ year: 'Year ', match: 'Match ' }[c.xl] || 'Second ') + Math.round(sx) + ': ' + c.s.map(s => s.n + ' = ' + (Math.round(interp(s.p, sx) * 10) / 10)).join(' | ');
}
$('curve-slider').addEventListener('input', drawCurve);

