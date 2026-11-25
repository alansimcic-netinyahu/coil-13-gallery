"use strict";
/* CLIMATE CLASH v2. Card art = Twemoji icons loaded from the internet (jsDelivr). Arena photos = Wikimedia Commons. */
const IMG = {}, twe = e => "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.0/assets/svg/" + [...e].map(c => c.codePointAt(0).toString(16)).filter(c => c !== 'fe0f').join('-') + ".svg";
const pic = e => IMG[e] || (IMG[e] = Object.assign(new Image(), { src: twe(e) }));
const cv = $('arena'), cx = cv.getContext('2d'), W = 360, H = 560, LANES = [90, 270], RIV = 280, MATCH = 180, bgc = document.createElement('canvas'); bgc.width = W; bgc.height = H;
const U = (e, n, c, t, hp, d, sp, r, cd, k, L, i, o = {}) => ({ e, n, c, t, hp, d, sp, r, cd, k, L, i, K: 'u', ...o });
const B = (e, n, c, hp, d, r, cd, L, i, o = {}) => ({ e, n, c, t: 'Building', hp, d, sp: 0, r, cd, k: 1, L, i, K: 'b', aa: 1, ...o });
const S = (e, n, c, t, m, v, rad, L, i, o = {}) => ({ e, n, c, t, K: 's', m, v, rad, L, i, ...o });
const GOOD = [U('🚲', 'Cyclists', 2, 'Ground · Swarm', 60, 9, 70, 20, .7, 2, 'Skeletons', 'Two fast riders. Cheap and quick, but weak to splash.'),
  U('🏃', 'Courier', 3, 'Ground · Fast', 140, 26, 60, 20, 1, 1, 'Bandit', 'Dashes at targets. After a long run the next hit deals double damage.', { chg: 1 }),
  U('🏍️', 'Moped Rider', 4, 'Win condition', 260, 34, 78, 22, 1.1, 1, 'Hog Rider', 'Very fast. Ignores units and attacks only buildings and towers.', { wc: 1 }),
  U('🚆', 'E-Train', 5, 'Win condition', 320, 42, 50, 24, 1.1, 1, 'Battering Ram', 'Charges buildings and towers. First hit after a run deals double damage.', { wc: 1, chg: 1 }),
  U('🛴', 'Scooter Knight', 5, 'Ground · Charge', 250, 45, 46, 24, 1.1, 1, 'Prince', 'Charges. After a long run the next hit deals double damage.', { chg: 1 }),
  U('🌳', 'Old Oak', 3, 'Ground · Tank', 300, 22, 26, 22, 1.1, 1, 'Knight', 'Sturdy tree guardian that soaks up damage.'),
  U('🧊', 'Glacier', 2, 'Ground · Tank', 260, 6, 26, 22, 1, 1, 'Ice Golem', 'Attacks only buildings and towers. Freezes nearby enemies when destroyed.', { wc: 1, dd: 25, ice: 1 }),
  U('🪨', 'Rock Golem', 8, 'Ground · Tank', 700, 35, 20, 24, 1.4, 1, 'Golem', 'Huge tank that targets buildings and towers. Splits into Pebbles when destroyed.', { wc: 1, ds: 'Pebbles', hr: 22 }),
  U('🦣', 'Mammoth', 5, 'Ground · Tank', 500, 30, 24, 24, 1.3, 1, 'Giant', 'Slow giant that attacks only buildings and towers.', { wc: 1, hr: 20 }),
  U('🐜', 'Ant Army', 3, 'Ground · Swarm', 25, 8, 78, 18, .7, 6, 'Skeleton Army', 'Six tiny ants. Great against tanks, weak to splash.'),
  U('🐝', 'Bee Swarm', 3, 'Air · Swarm', 45, 8, 82, 18, .6, 3, 'Minions', 'Three flying bees that hit air and ground.', { fly: 1, aa: 1 }),
  U('🦅', 'Eagle', 4, 'Air · Splash', 180, 22, 60, 22, 1, 1, 'Baby Dragon', 'Flies over the river and hits groups on the ground and in the air.', { fly: 1, aa: 1, sp2: 30 }),
  U('🎈', 'Hot Air Balloon', 5, 'Air · Win condition', 200, 70, 30, 22, 1.8, 1, 'Balloon', 'Floats over the river and hits only buildings and towers, hard.', { fly: 1, wc: 1 }),
  U('🦉', 'Giant Owl', 7, 'Air · Tank', 500, 10, 26, 22, 1, 1, 'Lava Hound', 'Flying tank that targets buildings and towers. Releases Owlets when destroyed.', { fly: 1, wc: 1, ds: 'Owlet', hr: 18 }),
  U('☀️', 'Solar Squad', 4, 'Ground · Ranged', 150, 20, 40, 65, 1, 1, 'Musketeer', 'Long range shooter that hits air and ground.', { aa: 1 }),
  U('🧙', 'Eco Wizard', 5, 'Ground · Ranged', 120, 32, 36, 55, 1.2, 1, 'Wizard', 'Ranged splash damage against groups.', { aa: 1, sp2: 30 }),
  U('🥶', 'Frost Mage', 3, 'Ground · Ranged', 100, 12, 36, 55, 1, 1, 'Ice Wizard', 'Slows every enemy he hits.', { aa: 1, ice: 1 }),
  U('🛡️', 'Rain Guardian', 4, 'Ground · Splash', 330, 28, 38, 22, 1.1, 1, 'Valkyrie', 'Damages all ground units around her.', { sp2: 32 }),
  U('🤖', 'Recycler Bot', 4, 'Ground · Heavy hitter', 270, 90, 40, 22, 1.5, 1, 'Mini P.E.K.K.A', 'Slow attacks but huge damage. Great against tanks.'),
  U('♻️', 'Recyclers', 3, 'Ground · Swarm', 80, 12, 46, 22, .8, 3, 'Goblins', 'Three quick workers.'),
  U('🌱', 'Seedlings', 2, 'Ground · Ranged swarm', 30, 8, 44, 60, .9, 3, 'Spear Goblins', 'Three ranged seedlings that can hit air.', { aa: 1 }),
  U('💧', 'Water Spirit', 1, 'Ground · Spirit', 40, 14, 80, 20, .9, 1, 'Ice Spirit', 'Cheap and quick. Slows its target.', { ice: 1 }),
  B('🌬️', 'Wind Turbine', 4, 220, 24, 100, 1.2, 'Inferno Tower', 'Hits air and ground. Expires after 28 s.'),
  B('🔋', 'Battery Tower', 3, 170, 16, 80, .9, 'Tesla', 'Hits air and ground. Expires after 28 s.'),
  B('🏡', 'Seed Hut', 4, 260, 0, 0, 1, 'Goblin Hut', 'Spawns a Seedling every 5 s. Expires after 28 s.', { sw: 'Seedling' }),
  S('⚡', 'Solar Flare', 4, 'Spell · Damage', 'd', 140, 60, 'Fireball', 'Damages units in an area. Towers take 40%.'),
  S('☄️', 'Meteor', 6, 'Spell · Damage', 'd', 230, 42, 'Rocket', 'Big damage in a small area. Towers take 40%.'),
  S('🌨️', 'Hail Barrage', 3, 'Spell · Damage', 'd', 45, 95, 'Arrows', 'Light damage over a wide area.'),
  S('🔌', 'Short Circuit', 2, 'Spell · Stun', 'd', 40, 50, 'Zap', 'Small damage and stuns enemies for 0.6 s.', { z: .6 }),
  S('🌧️', 'Growth Rain', 3, 'Spell · Heal', 'h', 100, 72, 'Heal Spirit', 'Heals your units in an area.'),
  S('❄️', 'Cold Snap', 4, 'Spell · Freeze', 'f', 3, 66, 'Freeze', 'Freezes enemies in an area for 3 s.')];
const BAD = [U('🚗', 'Traffic Jam', 3, 'Ground · Swarm', 90, 14, 55, 20, .8, 2, 'Barbarians', 'Two angry cars.'), U('🔥', 'Wildfire', 3, 'Ground · Fast', 70, 22, 66, 20, .9, 1, 'Bandit', 'Fast fire that dashes at targets.', { chg: 1 }),
  U('🗑️', 'Waste Pile', 3, 'Ground · Tank', 260, 8, 26, 22, 1, 1, 'Knight', 'Slow heap of trash.'), U('🛢️', 'Oil Spill', 3, 'Ground · Ranged', 150, 20, 32, 40, 1, 1, 'Wizard', 'Spits sticky oil at air and ground.', { aa: 1, sp2: 25 }),
  U('🚛', 'Heavy Truck', 5, 'Ground · Tank', 380, 30, 30, 24, 1.2, 1, 'Giant', 'Attacks only buildings and towers.', { wc: 1 }), U('🚜', 'Bulldozer', 4, 'Win condition', 300, 36, 58, 24, 1.1, 1, 'Hog Rider', 'Attacks only buildings and towers.', { wc: 1 }),
  U('🪓', 'Lumberjack', 3, 'Win condition', 120, 26, 84, 20, .9, 1, 'Ram Rider', 'Fast raider that chops buildings and towers.', { wc: 1 }), U('☁️', 'Smog Cloud', 3, 'Air · Ranged', 110, 15, 38, 70, 1, 1, 'Baby Dragon', 'Flying cloud with splash.', { fly: 1, aa: 1, sp2: 25 }),
  U('🦟', 'Mosquitoes', 3, 'Air · Swarm', 40, 8, 84, 18, .6, 3, 'Minion Horde', 'Three flying pests.', { fly: 1, aa: 1 }), U('✈️', 'Cargo Jet', 4, 'Air · Fast', 150, 26, 80, 22, 1, 1, 'Minions', 'Fast flyer, hits only ground.', { fly: 1 }),
  U('🐀', 'Rat Swarm', 3, 'Ground · Swarm', 25, 8, 78, 18, .7, 6, 'Skeleton Army', 'Six rats.'), U('🚧', 'Road Roller', 6, 'Ground · Heavy', 500, 60, 34, 24, 1.4, 1, 'P.E.K.K.A', 'Slow heavy hitter.'),
  U('☣️', 'Toxic Sludge', 3, 'Ground · Slow', 200, 10, 30, 24, 1, 1, 'Ice Golem', 'Slows what it hits.', { ice: 1 }), U('🌋', 'Volcano', 8, 'Ground · Tank', 700, 35, 20, 24, 1.4, 1, 'Golem', 'Targets buildings and towers. Splits when destroyed.', { wc: 1, ds: 'Pebbles', hr: 22 }),
  U('🌪️', 'Tornado Cloud', 5, 'Air · Tank', 420, 20, 28, 22, 1, 1, 'Elixir Golem', 'Flying tank.', { fly: 1, aa: 1 }), B('🏭', 'Factory', 4, 240, 22, 95, 1.2, 'Cannon', 'Shoots nearby units. Expires after 28 s.'),
  B('⛽', 'Gas Station', 4, 260, 0, 0, 1, 'Goblin Hut', 'Spawns a Smog Imp every 5 s.', { sw: 'Smog Imp' }), S('🌡️', 'Heatwave', 3, 'Spell · Damage', 'd', 120, 62, 'Fireball', 'Burns units in an area.'),
  S('🌊', 'Flood', 3, 'Spell · Damage', 'd', 50, 90, 'Arrows', 'Light damage over a wide area.'), S('🌩️', 'Blackout', 2, 'Spell · Stun', 'd', 40, 50, 'Zap', 'Stuns for 0.6 s.', { z: .6 })];
const HID = [U('🪨', 'Pebbles', 1, 'Ground · Swarm', 90, 12, 34, 20, 1, 3, 'Golemite', ''), U('🐦', 'Owlet', 1, 'Air', 40, 8, 80, 18, .7, 3, 'Lava Pup', '', { fly: 1, aa: 1 }), U('🌱', 'Seedling', 1, 'Ground · Ranged', 30, 8, 44, 60, .9, 1, 'Spear Goblin', '', { aa: 1 }), U('💨', 'Smog Imp', 1, 'Ground', 40, 8, 60, 18, .8, 1, 'Goblin', '')];
const find = n => [...GOOD, ...BAD, ...HID].find(c => c.n === n);
const ARENAS = [{ n: 'Nova Gorica', f: 'Nova Gorica.jpg', c: '#3f6212', te: 'rgba(124,58,237,.55)', tp: 'rgba(22,163,74,.25)' }, { n: 'Soča Valley', f: 'Isonzo vicino Nova Gorica.jpg', c: '#0e7490', te: 'rgba(220,38,38,.5)', tp: 'rgba(6,182,212,.25)' },
  { n: 'Solkan Bridge', f: 'Solkan railway bridge 01.jpg', c: '#92400e', te: 'rgba(194,65,12,.55)', tp: 'rgba(250,204,21,.2)' }, { n: 'Old Town', f: 'Nova Gorica (51589965143).jpg', c: '#1e3a8a', te: 'rgba(190,24,93,.5)', tp: 'rgba(56,189,248,.22)' }];
const EVS = [{ n: 'Calm day', d: 'no special effects', bs: 1, fs: 1, pe: 1, hb: 1 }, { n: 'Heat wave', d: 'bad things move 25% faster', bs: 1.25, fs: 1, pe: 1, hb: 1 }, { n: 'Green day', d: 'your energy refills 30% faster', bs: 1, fs: 1, pe: 1.3, hb: 1 },
  { n: 'Strong wind', d: 'flying units 40% faster', bs: 1, fs: 1.4, pe: 1, hb: 1 }, { n: 'Pollution spike', d: 'bad things have +25% HP', bs: 1, fs: 1, pe: 1, hb: 1.25 }];
const game = { running: false }; let units = [], towers = [], fx = [], P = [], shake = 0, endT = 0, winFx = false, playing = false, looping = false, tt = 0, tLeft = MATCH, sampleT = 0, elix = 5, eE = 4, ai = 2, aiT = 3, hand = [], q = [0], sel = -1, ev = EVS[0], eDeck = [], crowns = { p: 0, e: 0 }, lastT = 0, mt = 0, ot = false, clock = 0, hb = false;
let deck; try { deck = JSON.parse(localStorage.getItem('ccDeck2')); } catch { }
if (!Array.isArray(deck) || deck.length !== 8 || deck.some(i => !GOOD[i])) deck = ['Cyclists', 'Courier', 'Moped Rider', 'Solar Squad', 'Bee Swarm', 'Wind Turbine', 'Solar Flare', 'Growth Rain'].map(n => GOOD.findIndex(c => c.n === n));
const saveDeck = () => { try { localStorage.setItem('ccDeck2', JSON.stringify(deck)); } catch { } };
const shuf = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]), dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/* ---- deck + hand UI ---- */
function cardBtn(c) { const b = el('button', 't-' + c.t.split(/[ ·]/)[0]); b.type = 'button'; const i = new Image(); i.src = twe(c.e); i.alt = ''; b.append(el('i', 'cc', c.c), i, el('b', '', c.n), el('small', '', c.t)); b.addEventListener('click', () => showInfo(c)); b.addEventListener('mouseenter', () => showInfo(c)); return b; }
function showInfo(c) { const sp = c.sp < 30 ? 'Slow' : c.sp < 50 ? 'Medium' : c.sp < 70 ? 'Fast' : 'Very fast', r = $('cinfo'); r.replaceChildren(); const rows = c.K === 's' ? ['Radius ' + c.rad, c.m === 'd' ? 'Damage ' + c.v + (c.z ? ' + stun ' + c.z + ' s' : '') + ' (towers take 40%)' : c.m === 'h' ? 'Heals ' + c.v : 'Freezes ' + c.v + ' s'] : ['❤ HP ' + c.hp, '⚔ Damage ' + c.d, '⏱ Hit every ' + c.cd + ' s', c.K === 'b' ? 'Lifetime 28 s' : '👣 ' + sp, '🎯 Range ' + (c.r <= 26 ? 'melee' : c.r), '👥 x' + c.k, 'Targets: ' + (c.wc ? 'buildings only' : c.aa ? 'air & ground' : 'ground only') + (c.fly ? ' · flies' : '')]; r.append(el('b', '', c.e + ' ' + c.n + ' · ⚡' + c.c + ' · ' + c.t), el('p', '', rows.join(' · ')), el('p', '', c.i), el('small', '', 'Inspired by: ' + c.L)); }
function renderDeck() { const g = $('deckgrid'); g.replaceChildren(); GOOD.forEach((c, i) => { const b = cardBtn(c); if (deck.includes(i)) b.classList.add('in'); b.addEventListener('click', () => { const k = deck.indexOf(i); if (k >= 0) deck.splice(k, 1); else if (deck.length < 8) deck.push(i); saveDeck(); renderDeck(); }); g.append(b); }); $('deckcount').textContent = deck.length + '/8 · average ⚡' + (deck.length ? (deck.reduce((s, i) => s + GOOD[i].c, 0) / deck.length).toFixed(1) : 0); }
function renderHand() { const h = $('hand'); h.replaceChildren(); hand.forEach((gi, s) => { const b = cardBtn(GOOD[gi]); if (s === sel) b.classList.add('sel'); b.dataset.slot = s; b.addEventListener('click', () => { sel = sel === s ? -1 : s; renderHand(); }); h.append(b); }); const n = $('nextc'); n.replaceChildren(); const i = new Image(); i.src = twe(GOOD[q[0]].e); n.append(i); }
$('gdeckbtn').addEventListener('click', () => { $('deckbox').hidden = !$('deckbox').hidden; });
$('grand').addEventListener('click', () => { deck = shuf(GOOD.map((_, i) => i)).slice(0, 8); saveDeck(); renderDeck(); });

/* ---- background (real photo + tints) ---- */
function buildBg(a) {
  const b = bgc.getContext('2d'), im = new Image();
  const paint = ok => {
    b.clearRect(0, 0, W, H); if (ok) { const s = Math.max(W / im.width, H / im.height); b.drawImage(im, (W - im.width * s) / 2, (H - im.height * s) / 2, im.width * s, im.height * s); } else { b.fillStyle = a.c; b.fillRect(0, 0, W, H); }
    let g = b.createLinearGradient(0, 0, 0, 280); g.addColorStop(0, a.te); g.addColorStop(1, 'rgba(30,10,40,.3)'); b.fillStyle = g; b.fillRect(0, 0, W, 280);
    g = b.createLinearGradient(0, 292, 0, H); g.addColorStop(0, 'rgba(134,239,172,.3)'); g.addColorStop(1, a.tp); b.fillStyle = g; b.fillRect(0, 292, W, H - 292);
    b.strokeStyle = '#ffffff33'; b.lineWidth = 20; b.setLineDash([10, 10]); for (const x of LANES) { b.beginPath(); b.moveTo(x, 60); b.lineTo(x, 500); b.stroke(); } b.setLineDash([]);
    g = b.createLinearGradient(0, 266, 0, 294); g.addColorStop(0, '#22d3ee'); g.addColorStop(1, '#2563eb'); b.fillStyle = g; b.globalAlpha = .88; b.fillRect(0, 266, W, 28); b.globalAlpha = 1;
    b.strokeStyle = '#ffffff66'; b.lineWidth = 2; for (let x = 10; x < W; x += 40) { b.beginPath(); b.moveTo(x, 274); b.quadraticCurveTo(x + 10, 270, x + 20, 274); b.stroke(); }
    for (const x of LANES) { b.fillStyle = '#92400e'; b.fillRect(x - 25, 262, 50, 36); b.fillStyle = '#fbbf24'; for (let y = 264; y < 298; y += 6) b.fillRect(x - 24, y, 48, 4); }
    g = b.createRadialGradient(W / 2, H / 2, 150, W / 2, H / 2, 380); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.45)'); b.fillStyle = g; b.fillRect(0, 0, W, H);
  };
  paint(false); im.onload = () => { paint(true); if (!playing) draw(); }; im.src = WC(a.f);
}

/* ---- effects ---- */
const ring = (x, y, m, c, l) => fx.push({ k: 'r', x, y, m, c, l, l0: l });
function boom(x, y) { const cs = ['#f97316', '#facc15', '#ef4444', '#fde68a', '#a8a29e']; for (let i = 0; i < 46; i++) { const a = Math.random() * 6.28, s = 40 + Math.random() * 190; P.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 40, l: .6 + Math.random() * .7, m: 1.3, g: 160, c: cs[i % 5], s: 3 + Math.random() * 5 }); } ring(x, y, 100, '#facc15', .55); }
function puff(x, y, c) { for (let i = 0; i < 8; i++) { const a = Math.random() * 6.28, s = 20 + Math.random() * 60; P.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, l: .4, m: .4, g: 0, c, s: 3 }); } }
function confetti(n) { const cs = ['#facc15', '#22d3ee', '#f43f5e', '#a3e635', '#c084fc', '#fb923c']; for (let i = 0; i < n; i++) P.push({ x: Math.random() * W, y: -8, vx: (Math.random() - .5) * 50, vy: 70 + Math.random() * 110, l: 3.5, m: 3.5, g: 0, c: cs[i % 6], s: 4 + Math.random() * 4, sq: 1 }); }
function fxStep(dt) { for (const p of P) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.g * dt; p.l -= dt; } P = P.filter(p => p.l > 0); for (const f of fx) f.l -= dt; fx = fx.filter(f => f.l > 0); shake = Math.max(0, shake - dt * 1.4); }

/* ---- game logic ---- */
const nT = (side, x, y, king) => ({ side, x, y, hp: king ? 700 : 450, mhp: king ? 700 : 450, king, act: !king, tw: 1, t: 0, fl: 0 });
const sum = s => towers.filter(t => t.side === s).reduce((a, t) => a + Math.max(0, t.hp), 0), health = () => Math.round(sum('p') / (sum('p') + sum('e') || 1) * 100);
function startGame() {
  if (deck.length !== 8) { alert('Pick exactly 8 cards in your deck first.'); return; }
  const a = ARENAS[Math.floor(Math.random() * ARENAS.length)]; buildBg(a); ev = EVS[Math.floor(Math.random() * EVS.length)]; $('gev').textContent = '🏞️ ' + a.n + ' · ⚡ ' + ev.n + ': ' + ev.d;
  units = []; fx = []; P = []; shake = 0; endT = 0; winFx = false; sel = -1; tLeft = MATCH; sampleT = 0; ot = false; clock = 0; elix = 5; eE = 4; ai = 2.6 + Math.random() * .6; aiT = 3; crowns = { p: 0, e: 0 }; eDeck = shuf(BAD).slice(0, 8);
  gameCurve.length = 0; gameCurve.push([0, 50]); towers = [nT('p', 90, 450), nT('p', 270, 450), nT('p', 180, 510, 1), nT('e', 90, 110), nT('e', 270, 110), nT('e', 180, 50, 1)];
  const o = shuf(deck); hand = o.slice(0, 4); q = o.slice(4); clearTimeout(mt); $('gmsg').hidden = true; $('gstart').textContent = 'Restart match'; renderHand(); playing = true; game.running = true; game.paused = false; kick();
}
function kick() { if (!looping) { looping = true; lastT = performance.now(); requestAnimationFrame(loop); } }
function spawn(side, c, x, y) { ring(x, y, 26, side === 'p' ? '#22d3ee' : '#f43f5e', .4); for (let i = 0; i < c.k; i++) { const hp = c.hp * (side === 'e' ? ev.hb : 1), bld = c.K === 'b'; units.push({ ...c, side, hp, mhp: hp, t: 0, bld, x: x + (i - (c.k - 1) / 2) * 22, y, ph: Math.random() * 6, fz: 0, sl: 0, run: 0, hr: c.hr || (bld ? 20 : hp >= 250 ? 17 : c.k > 1 ? 9 : 12) }); } }
function cast(side, c, x, y) {
  const f = side === 'p' ? 'e' : 'p', col = c.m === 'd' ? '#f97316' : c.m === 'h' ? '#4ade80' : '#38bdf8'; ring(x, y, c.rad, col, .6);
  for (let i = 0; i < 22; i++) { const a = Math.random() * 6.28, s = Math.random() * c.rad; P.push({ x: x + Math.cos(a) * s, y: y + Math.sin(a) * s, vx: 0, vy: -30, l: .6, m: .6, g: 0, c: col, s: 4 }); }
  for (const u of units) { if (dist(u, { x, y }) > c.rad) continue; if (c.m === 'd' && u.side === f) u.hp -= c.v; if (c.m === 'h' && u.side === side) u.hp = Math.min(u.mhp, u.hp + c.v); if (c.m === 'f' && u.side === f) u.fz = c.v; }
  if (c.m === 'd') for (const t of towers) if (t.side === f && !t.dead && dist(t, { x, y }) < c.rad + 14) { t.hp -= c.v * .4; t.fl = .12; if (t.king) t.act = true; if (t.hp <= 0) breakTower(t); }
}
function breakTower(t) { t.dead = 1; t.hp = 0; const w = t.side === 'p' ? 'e' : 'p'; crowns[w]++; boom(t.x, t.y); shake = .7; fx.push({ k: 't', x: t.x, y: t.y - 30, s: '👑 +1', l: 1.4 }); if (t.king || ot) endGame(w); else towers.find(o => o.side === t.side && o.king).act = true; }
function hit(a, to, d) { if (a.chg && a.run >= 80) { d *= 2; a.run = 0; } if (a.sp2 && !to.tw) for (const o of units) if (o !== to && o.side === to.side && !o.fly === !to.fly && dist(o, to) < a.sp2) o.hp -= d; if (a.ice && !to.tw) to.sl = 1.5; to.hp -= d; fx.push({ k: 'l', a, b: to, l: .1, c: a.side === 'p' ? '#22d3ee' : '#fb7185' }); if (to.tw) { to.fl = .12; if (to.king) to.act = true; if (to.hp <= 0 && !to.dead) breakTower(to); } }
function pick(u) {
  const f = u.side === 'p' ? 'e' : 'p'; let b = null, bd = u.bld ? u.r : u.wc ? 400 : 85;
  for (const o of units) if (o.side === f && o.hp > 0 && (u.wc ? o.bld : (!o.fly || u.aa))) { const d = dist(u, o); if (d < bd) { bd = d; b = o; } }
  if (b || u.bld) return b; const ts = towers.filter(t => t.side === f && !t.dead), pr = ts.filter(t => !t.king);
  return (pr.length ? pr : ts).sort((a, c) => Math.abs(a.x - u.x) - Math.abs(c.x - u.x))[0];
}
function move(u, tg, dt) {
  let wx = tg.x, wy = tg.y;
  if (!u.fly) { const bx = LANES.reduce((a, b) => Math.abs(b - u.x) < Math.abs(a - u.x) ? b : a); if ((u.y - RIV) * (wy - RIV) < 0 && Math.abs(u.x - bx) > 8) { wx = bx; wy = RIV + (u.y < RIV ? -26 : 26); } if (Math.abs(u.y - RIV) < 24) u.x += (bx - u.x) * Math.min(1, dt * 8); }
  const dx = wx - u.x, dy = wy - u.y, dd = Math.hypot(dx, dy) || 1, s = .7 * u.sp * (u.side === 'e' ? ev.bs : 1) * (u.fly ? ev.fs : 1) * (u.sl > 0 ? .5 : 1) * (u.chg && u.run >= 80 ? 1.8 : 1); if (u.chg) u.run += s * dt; u.x += dx / dd * s * dt; u.y += dy / dd * s * dt; u.ph += dt * s * .12;
}
function enemyPlay() {
  aiT = .8 + Math.random() * 2; const ok = eDeck.filter(c => c.c <= eE); if (!ok.length) return; const c = ok[Math.floor(Math.random() * ok.length)];
  if (c.K === 's') { let b = null, n = 1; for (const u of units) if (u.side === 'p') { const k = units.filter(o => o.side === 'p' && dist(o, u) < c.rad).length; if (k > n) { n = k; b = u; } } if (!b) return; eE -= c.c; cast('e', c, b.x, b.y); return; }
  eE -= c.c; spawn('e', c, LANES[Math.random() < .5 ? 0 : 1] + (Math.random() - .5) * 40, c.K === 'b' ? 190 : 130);
}
function update(dt) {
  tLeft -= dt; clock += dt; const m = ot ? 3 : tLeft <= 60 ? 2 : 1; elix = Math.min(10, elix + dt * m * ev.pe / 2.8); eE = Math.min(10, eE + dt * m / ai); aiT -= dt; if (aiT <= 0) enemyPlay();
  for (const u of units) { if (u.hp <= 0) continue; if (u.fz > 0) { u.fz -= dt; continue; } u.t -= dt; u.sl -= dt; if (u.bld) u.hp -= u.mhp / 28 * dt; if (u.sw) { u.sT = (u.sT ?? 3) - dt; if (u.sT <= 0) { u.sT = 5; spawn(u.side, find(u.sw), u.x, u.y + (u.side === 'p' ? -30 : 30)); } } const tg = pick(u); if (!tg) continue; if (dist(u, tg) <= u.r + (tg.tw ? 20 : 10)) { if (u.t <= 0) { hit(u, tg, u.d); u.t = u.cd; } } else if (u.sp) move(u, tg, dt); }
  for (const t of towers) { if (t.dead) continue; t.fl -= dt; t.t -= dt; if (!t.act || t.t > 0) continue; const f = t.side === 'p' ? 'e' : 'p'; let b = null, bd = t.king ? 150 : 135; for (const o of units) if (o.side === f && o.hp > 0) { const d = dist(t, o); if (d < bd) { bd = d; b = o; } } if (b) { hit(t, b, t.king ? 24 : 20); t.t = 1; } }
  for (const u of units) if (u.hp <= 0 && !u.gone) { u.gone = 1; puff(u.x, u.y, u.side === 'p' ? '#22d3ee' : '#f43f5e'); if (u.dd) { ring(u.x, u.y, 50, '#38bdf8', .4); for (const o of units) if (o.side !== u.side && o.hp > 0 && dist(o, u) < 50) { o.hp -= u.dd; if (u.ice) o.sl = 2; } } if (u.ds) spawn(u.side, find(u.ds), u.x, u.y); }
  units = units.filter(u => u.hp > 0);
  for (let i = 0; i < units.length; i++) for (let j = i + 1; j < units.length; j++) { const a = units[i], b = units[j]; if (!a.fly !== !b.fly) continue; const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy), m = a.hr + b.hr; if (d < m && d > .1) { const p = (m - d) / 2 / d; if (!a.bld) { a.x += dx * p; a.y += dy * p; } if (!b.bld) { b.x -= dx * p; b.y -= dy * p; } } }
  fxStep(dt);
  sampleT += dt; if (sampleT >= 2) { sampleT = 0; gameCurve.push([Math.round(clock), health()]); } if (tLeft <= 0) { if (!ot && crowns.p === crowns.e) { ot = true; tLeft = 120; shake = .3; fx.push({ k: 't', x: 180, y: 280, s: 'OVERTIME!', l: 2 }); } else endGame(null); }
}
function endGame(w) {
  if (!playing) return; playing = false; if (!w) w = crowns.p > crowns.e ? 'p' : crowns.e > crowns.p ? 'e' : sum('p') > sum('e') ? 'p' : sum('e') > sum('p') ? 'e' : 'd'; gameCurve.push([Math.round(clock), health()]);
  const m = $('gmsg'); m.replaceChildren(); m.className = 'gmsg' + (w === 'p' ? ' win' : ''); m.append(el('div', 'crown', w === 'p' ? '👑' : w === 'e' ? '💀' : '🤝'), el('h3', '', w === 'p' ? 'VICTORY!' : w === 'e' ? 'Bad things win' : 'Draw'),
    el('p', '', 'Crowns ' + crowns.p + ' – ' + crowns.e + ' · Climate health ' + health() + '%'), el('p', '', w === 'p' ? 'Clean choices beat pollution. In real life every action counts too.' : 'Change your deck or try another arena!'));
  const b = el('button', 'btn btn-light', 'Play again'); b.addEventListener('click', startGame); m.append(b); mt = setTimeout(() => { m.hidden = false; }, 900);
  if (w === 'p') { winFx = true; endT = 4.5; confetti(140); } else endT = 1.2;
}
cv.addEventListener('pointerdown', e => {
  if (!playing || sel < 0) return; const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width, y = (e.clientY - r.top) * H / r.height, c = GOOD[hand[sel]]; if (c.c > elix) return;
  if (c.K === 's') cast('p', c, x, y); else { if (y < 300) return; spawn('p', c, Math.max(20, Math.min(W - 20, x)), Math.min(H - 60, y)); }
  elix -= c.c; q.push(hand[sel]); hand[sel] = q.shift(); sel = -1; renderHand();
});

/* ---- drawing ---- */
function sprite(e, x, y, s) { const i = pic(e); if (i.complete && i.naturalWidth) cx.drawImage(i, x - s / 2, y - s / 2, s, s); else { cx.font = s * .85 + 'px serif'; cx.fillStyle = '#000'; cx.fillText(e, x, y); } }
function bar(x, y, w, v, m, col) { cx.fillStyle = '#0006'; cx.fillRect(x - w / 2, y, w, 5); cx.fillStyle = col; cx.fillRect(x - w / 2, y, w * Math.max(0, v / m), 5); }
function drawT(t) {
  const r = t.king ? 27 : 22; if (t.dead) { sprite('🪨', t.x, t.y + 4, 38); return; }
  const g = cx.createLinearGradient(t.x, t.y - r, t.x, t.y + r), p = t.side === 'p'; g.addColorStop(0, p ? '#4ade80' : '#fb7185'); g.addColorStop(1, p ? '#15803d' : '#7f1d1d');
  cx.fillStyle = g; cx.beginPath(); cx.roundRect(t.x - r, t.y - r, 2 * r, 2 * r, 10); cx.fill(); cx.strokeStyle = t.fl > 0 ? '#fff' : '#fde047'; cx.lineWidth = 3; cx.stroke();
  sprite('🏰', t.x, t.y + 2, r * 1.5); if (hb) { cx.lineWidth = 1.5; cx.strokeStyle = '#facc15'; cx.beginPath(); cx.arc(t.x, t.y, r, 0, 7); cx.stroke(); cx.strokeStyle = '#ffffff88'; cx.setLineDash([5, 5]); cx.beginPath(); cx.arc(t.x, t.y, t.king ? 150 : 135, 0, 7); cx.stroke(); cx.setLineDash([]); } if (t.king) sprite(t.act ? '👑' : '💤', t.x, t.y - r - 6, 22); bar(t.x, t.y - r - (t.king ? 24 : 12), 46, t.hp, t.mhp, '#facc15');
}
function drawU(u) {
  const fl = u.fly, bob = fl ? -16 - Math.sin(tt * 6 + u.ph) * 3 : -Math.abs(Math.sin(u.ph)) * 3, s = u.bld || u.mhp > 200 ? 42 : 34;
  cx.fillStyle = '#0005'; cx.beginPath(); cx.ellipse(u.x, u.y + 12, fl ? 9 : 13, fl ? 3.5 : 5, 0, 0, 7); cx.fill();
  cx.strokeStyle = u.side === 'p' ? '#22d3ee' : '#fb7185'; cx.lineWidth = 3; cx.beginPath(); cx.ellipse(u.x, u.y + 12, fl ? 9 : 14, fl ? 3.5 : 6, 0, 0, 7); cx.stroke();
  sprite(u.e, u.x, u.y + bob, s); if (hb) { cx.lineWidth = 1.5; cx.strokeStyle = '#facc15'; cx.beginPath(); cx.arc(u.x, u.y, u.hr, 0, 7); cx.stroke(); cx.strokeStyle = '#ffffffaa'; cx.setLineDash([4, 4]); cx.beginPath(); cx.arc(u.x, u.y, u.r, 0, 7); cx.stroke(); cx.setLineDash([]); } if (u.fz > 0) { cx.fillStyle = '#7dd3fc88'; cx.beginPath(); cx.arc(u.x, u.y + bob, s / 2, 0, 7); cx.fill(); } bar(u.x, u.y + bob - s / 2 - 6, 28, u.hp, u.mhp, u.side === 'p' ? '#22c55e' : '#ef4444');
}
function draw() {
  cx.save(); if (shake > 0) cx.translate((Math.random() - .5) * shake * 16, (Math.random() - .5) * shake * 16); cx.drawImage(bgc, 0, 0); cx.textAlign = 'center'; cx.textBaseline = 'middle';
  if (sel >= 0 && playing && GOOD[hand[sel]].K !== 's') { cx.fillStyle = '#22d3ee26'; cx.fillRect(0, 300, W, 260); }
  towers.forEach(drawT); [...units].sort((a, b) => a.y - b.y).forEach(drawU);
  for (const f of fx) {
    if (f.k === 'l') { cx.strokeStyle = f.c; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(f.a.x, f.a.y); cx.lineTo(f.b.x, f.b.y); cx.stroke(); }
    else if (f.k === 'r') { const k = 1 - f.l / f.l0; cx.globalAlpha = 1 - k; cx.strokeStyle = f.c; cx.fillStyle = f.c + '44'; cx.lineWidth = 4; cx.beginPath(); cx.arc(f.x, f.y, f.m * k, 0, 7); cx.fill(); cx.stroke(); cx.globalAlpha = 1; }
    else { cx.font = '800 20px sans-serif'; cx.lineWidth = 4; cx.strokeStyle = '#000'; cx.fillStyle = '#facc15'; const y = f.y - (1.4 - f.l) * 30; cx.strokeText(f.s, f.x, y); cx.fillText(f.s, f.x, y); }
  }
  for (const p of P) { cx.globalAlpha = Math.min(1, p.l / p.m * 1.5); cx.fillStyle = p.c; if (p.sq) cx.fillRect(p.x, p.y, p.s, p.s * .6); else { cx.beginPath(); cx.arc(p.x, p.y, p.s * (p.l / p.m * .7 + .3), 0, 7); cx.fill(); } }
  cx.globalAlpha = 1; if (!towers.length) { cx.fillStyle = '#fff'; cx.font = '800 22px sans-serif'; cx.strokeStyle = '#000'; cx.lineWidth = 4; cx.strokeText('Press “Start match”', W / 2, 410); cx.fillText('Press “Start match”', W / 2, 410); } cx.restore();
}
function hud() { $('elix-n').textContent = Math.floor(elix); $('elix-bar').style.width = elix * 10 + '%'; $('ghealth').textContent = health() + '%'; $('gcrowns').textContent = crowns.p + ' – ' + crowns.e; $('gx2').hidden = !(ot || tLeft <= 60); $('gx2').textContent = ot ? '3× ENERGY!' : '2× ENERGY!'; const s = Math.max(0, Math.ceil(tLeft)); $('gtime').textContent = (ot ? 'OT ' : '') + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); document.querySelectorAll('#hand button').forEach(b => b.classList.toggle('off', GOOD[hand[+b.dataset.slot]].c > elix)); }
function loop(now) {
  if (!game.running) { looping = false; return; } const dt = Math.min(.05, (now - lastT) / 1000); lastT = now; tt += dt;
  if (playing) update(dt); else { endT -= dt; fxStep(dt); if (winFx && endT > 0) confetti(2); } draw(); if (playing) hud();
  if (playing || endT > 0 || P.length) requestAnimationFrame(loop); else { looping = false; game.running = false; }
}
$('gstart').addEventListener('click', startGame); $('ghb').addEventListener('change', e => { hb = e.target.checked; if (!playing) draw(); }); renderDeck(); buildBg(ARENAS[0]); draw(); showTab(location.hash.slice(1));
