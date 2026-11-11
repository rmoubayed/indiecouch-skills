// The Dev Hub ("a UI that brings all this together… full visibility"): one local page for a game's health.
//   node devhub/hub.mjs <game folder>          then open http://localhost:7350
// It only reads what the game's scripts and tests write, found through the game's studio.json:
//   Saved/Playtest/tests-*.json   every scenario run (validate, test groups, the nightly's gate)
//   Saved/Nightly/<date>/         summary.json, logs, soak/, audit/ shots from Tools/nightly.ps1
//   Saved/DevHub/linear.json      a Linear snapshot written by the morning triage task (no API key here)
// Evidence files are served read-only from Saved/ and the game's shots folder, so every cell can link to its log,
// JSON or screenshot.
import { createServer } from 'node:http';
import { readFileSync, readdirSync, statSync, existsSync, createReadStream, writeFileSync, appendFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { dirname, resolve, relative, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const GAME = resolve(process.argv[2] || process.env.STUDIO_GAME || process.cwd());
const PORT = Number(process.env.PORT || 7350);
const readJson = (file) => JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, '')); // (PowerShell writes a BOM)
if (!existsSync(resolve(GAME, 'studio.json'))) {
  console.error(`No studio.json in ${GAME}: pass the game folder, e.g. node devhub/hub.mjs "C:/Users/me/Desktop/My Game"`);
  process.exit(1);
}
const CFG = readJson(resolve(GAME, 'studio.json'));
const SAVED = resolve(GAME, 'Saved');
const PLAYTEST = resolve(SAVED, 'Playtest');
const NIGHTLY = resolve(SAVED, 'Nightly');
const SHOTS = resolve(GAME, CFG.shots || 'Art/Gate');
const ROOTS = [SAVED, SHOTS]; // the only folders /files/ may serve

const list = (dir, test) => (existsSync(dir) ? readdirSync(dir).filter(test) : []);
const rel = (abs) => relative(GAME, abs).split(sep).join('/');
const fileUrl = (abs) => (abs && existsSync(abs) ? '/files/' + encodeURI(rel(abs)) : null);
const mtime = (abs) => (existsSync(abs) ? statSync(abs).mtime.toISOString() : null);

/** Every scenario run, oldest first: the JSON plus links to it and its text report. */
function runs() {
  return list(PLAYTEST, (f) => /^tests-\d{8}-\d{6}\.json$/.test(f)).sort().map((f) => {
    const abs = resolve(PLAYTEST, f);
    try {
      const r = readJson(abs);
      // when it ran, from the file name (local time): older runs wrote local time marked as UTC in "started"
      const m = f.match(/^tests-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})/);
      const at = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]).toISOString();
      return { id: f.slice(6, -5), json: fileUrl(abs), txt: fileUrl(abs.replace(/\.json$/, '.txt')), ...r, started: at };
    } catch { return null; }
  }).filter(Boolean);
}

/** The nightly summaries, newest first, with links to everything each one wrote. */
function nightlies() {
  return list(NIGHTLY, (f) => /^\d{4}-\d{2}-\d{2}$/.test(f)).sort().reverse().map((d) => {
    const dir = resolve(NIGHTLY, d), sum = resolve(dir, 'summary.json');
    if (!existsSync(sum)) return { date: d, status: 'missing' };
    const s = readJson(sum);
    const link = (name) => fileUrl(resolve(dir, name));
    (s.steps || []).forEach((st) => { st.href = st.log ? link(st.log.replace(/\/$/, '')) : null; });
    s.links = { summary: link('summary.json'), gate: link('gate.log'), perf: link('perf.log'), invariants: link('invariants.txt'), push: link('push.err') };
    s.audit = list(resolve(dir, 'audit'), (f) => f.endsWith('.png')).sort().map((f) => ({ name: f.slice(0, -4), href: link('audit/' + f) }));
    s.soakShots = list(resolve(dir, 'soak'), (f) => f.endsWith('.png')).sort().map((f) => ({ name: f.slice(0, -4), href: link('soak/' + f) }));
    return s;
  });
}

function today() {
  const all = runs();
  const most = Math.max(0, ...all.map((r) => r.total || 0));
  const full = all.filter((r) => r.total === most && r.finished);
  const lastFull = full[full.length - 1] || null;
  const ok = resolve(SAVED, 'Validate.ok');
  const n = nightlies();
  const lastNight = n.find((x) => x.status !== 'missing') || null;
  const previous = n.filter((x) => x.status !== 'missing')[1] || null;
  // new failures: keys failing in the last nightly that weren't failing in the one before
  const before = new Set((previous?.failures || []).map((f) => f.key));
  const fresh = (lastNight?.failures || []).filter((f) => !before.has(f.key));
  const fps = n.filter((x) => x.metrics && x.metrics.fps).map((x) => ({ date: x.date, fps: Number(x.metrics.fps) })).reverse();
  return {
    game: CFG.game, build: lastFull?.build || null,
    gate: lastFull && { at: lastFull.started, build: lastFull.build, passed: lastFull.passed, failed: lastFull.failed, total: lastFull.total,
      invariants: lastFull.invariants, json: lastFull.json, txt: lastFull.txt, failing: (lastFull.tests || []).filter((t) => t.state !== 'pass') },
    validateOk: mtime(ok),
    nightly: lastNight, newFailures: fresh, fps,
    runsToday: all.filter((r) => (r.started || '').startsWith(new Date().toISOString().slice(0, 10))).length,
  };
}

/** One row per test, one cell per run (newest last), grouped by system. */
function tests() {
  const all = runs().slice(-40);
  const rows = new Map();
  all.forEach((r, i) => (r.tests || []).forEach((t) => {
    if (!rows.has(t.name)) rows.set(t.name, { name: t.name, group: 'misc', cells: Array(all.length).fill(null) });
    const row = rows.get(t.name);
    row.group = t.group || row.group; // the newest run's grouping wins
    row.cells[i] = { state: t.state, seconds: t.seconds, message: t.message };
  }));
  const order = ['core', 'pathing', 'controls', 'ruins', 'economy', 'combat', 'buildings', 'world', 'save', 'misc'];
  const rank = (g) => (order.indexOf(g) >= 0 ? order.indexOf(g) : g.startsWith('gym:') ? 100 : 50); // gyms last
  const sorted = [...rows.values()].sort((a, b) => (rank(a.group) - rank(b.group)) || a.group.localeCompare(b.group) || a.name.localeCompare(b.name));
  return {
    runs: all.map((r) => ({ id: r.id, build: r.build, started: r.started, total: r.total, passed: r.passed, failed: r.failed,
      invariants: r.invariants, finished: r.finished, json: r.json, txt: r.txt })),
    rows: sorted,
  };
}

function linear() {
  const f = resolve(SAVED, 'DevHub', 'linear.json');
  return existsSync(f) ? readJson(f) : { missing: true, project: CFG.linear?.project };
}

// ---------------------------------------------------------------- Mechanics
// The game's tunable numbers (studio.json "tuning", default Config/Tuning.json) on a map of its systems ("systems",
// default Config/Systems.json). A change here goes into Saved/TuningChanges.json, the same file the game's DEV panel
// writes; the game watches it and applies it within half a second, and writes what it runs with to Saved/TuningNow.json.
// Every change is logged to Saved/TuningHistory.jsonl (undo walks it back); presets are Saved/TuningPresets/<name>.json.
const TUNING = resolve(GAME, CFG.tuning || 'Config/Tuning.json');
const SYSTEMS = resolve(GAME, CFG.systems || 'Config/Systems.json');
const CHANGES = resolve(SAVED, 'TuningChanges.json');
const NOW = resolve(SAVED, 'TuningNow.json');
const HISTORY = resolve(SAVED, 'TuningHistory.jsonl');
const PRESETS = resolve(SAVED, 'TuningPresets');

const changes = () => { try { return readJson(CHANGES).values || {}; } catch { return {}; } };
function writeChanges(values) {
  mkdirSync(SAVED, { recursive: true });
  writeFileSync(CHANGES, JSON.stringify({ saved: new Date().toISOString(), source: 'devhub', values }, null, 2));
}
function history(n = 60) {
  if (!existsSync(HISTORY)) return [];
  return readFileSync(HISTORY, 'utf8').split('\n').filter(Boolean).slice(-n).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}
const logChange = (entry) => appendFileSync(HISTORY, JSON.stringify({ at: new Date().toISOString(), ...entry }) + '\n');

function mechanics() {
  const reg = existsSync(TUNING) ? readJson(TUNING) : { tunables: [] };
  const map = existsSync(SYSTEMS) ? readJson(SYSTEMS) : { systems: [], feeds: [] };
  const ch = changes();
  let now = null;
  try { now = readJson(NOW); } catch { /* no game has run yet */ }
  // the game counts as running while it writes TuningNow.json (on each change, and every load)
  const live = now && (Date.now() - new Date(now.at)) < 15000;
  const tunables = reg.tunables.map((t) => ({ ...t, default: t.value, value: ch[t.id] ?? t.value, changed: t.id in ch, inGame: now?.values?.[t.id] }));
  const presets = existsSync(PRESETS) ? readdirSync(PRESETS).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).sort() : [];
  return { systems: map.systems, feeds: map.feeds, tunables, game: now && { at: now.at, hash: now.hash, live }, presets, history: history().reverse() };
}

/** One change: set (a value; the default removes it), reset (one or all), undo (the last change made here), presets, or
 *  make a value the new default in Tuning.json itself (to commit). */
function mechanicsAction(body) {
  const reg = readJson(TUNING);
  const byId = Object.fromEntries(reg.tunables.map((t) => [t.id, t]));
  const ch = changes();
  const setOne = (id, value, why) => {
    const t = byId[id];
    if (!t) throw new Error(`no tunable ${id}`);
    const v = Math.min(t.max, Math.max(t.min, Number(value)));
    const from = ch[id] ?? t.value;
    if (Math.abs(v - t.value) < 1e-6) delete ch[id]; else ch[id] = v;
    logChange({ id, from, to: v, why });
  };
  switch (body.action) {
    case 'set': setOne(body.id, body.value, 'set'); break;
    case 'reset':
      for (const id of body.id ? [body.id] : Object.keys(ch)) { if (byId[id]) setOne(id, byId[id].value, 'reset'); }
      break;
    case 'undo': {
      const last = history(500).reverse().find((h) => h.why !== 'undo' && h.id);
      if (!last) return { ok: false, said: 'Nothing to undo.' };
      setOne(last.id, last.from, 'undo');
      break;
    }
    case 'preset-save': {
      const name = String(body.name || '').replace(/[^\w -]/g, '').trim();
      if (!name) throw new Error('a preset needs a name');
      mkdirSync(PRESETS, { recursive: true });
      writeFileSync(resolve(PRESETS, name + '.json'), JSON.stringify({ saved: new Date().toISOString(), values: ch }, null, 2));
      return { ok: true, said: `Saved "${name}" (${Object.keys(ch).length} changed values).` };
    }
    case 'preset-load': {
      const file = resolve(PRESETS, String(body.name).replace(/[^\w -]/g, '') + '.json');
      const values = readJson(file).values || {};
      for (const id of Object.keys(byId)) setOne(id, values[id] ?? byId[id].value, `preset ${body.name}`);
      break;
    }
    case 'preset-delete': unlinkSync(resolve(PRESETS, String(body.name).replace(/[^\w -]/g, '') + '.json')); return { ok: true };
    case 'make-default': {
      const t = byId[body.id];
      if (!t || !(body.id in ch)) throw new Error(`${body.id} isn't changed`);
      logChange({ id: body.id, from: t.value, to: ch[body.id], why: 'new default' });
      t.value = ch[body.id];
      delete ch[body.id];
      writeFileSync(TUNING, JSON.stringify(reg, null, 2) + '\n');
      break;
    }
    default: throw new Error(`unknown action ${body.action}`);
  }
  writeChanges(ch);
  return { ok: true };
}

/** The Start here page: the game's tools guide (studio.json "toolsGuide", default Tools/tools_guide.json). */
function guide() {
  const f = resolve(GAME, CFG.toolsGuide || 'Tools/tools_guide.json');
  return existsSync(f) ? readJson(f) : { missing: true, cards: [] };
}

const readBody = (req) => new Promise((ok, fail) => {
  let s = '';
  req.on('data', (c) => { s += c; if (s.length > 1e6) req.destroy(); });
  req.on('end', () => { try { ok(JSON.parse(s || '{}')); } catch (e) { fail(e); } });
});

const TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.log': 'text/plain; charset=utf-8', '.csv': 'text/plain; charset=utf-8', '.err': 'text/plain; charset=utf-8' };
function serveFile(res, urlPath) {
  const abs = resolve(GAME, decodeURIComponent(urlPath));
  const allowed = ROOTS.some((r) => abs === r || abs.startsWith(r + sep));
  if (!allowed || !existsSync(abs) || !statSync(abs).isFile()) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': TYPES[extname(abs).toLowerCase()] || 'text/plain; charset=utf-8', 'cache-control': 'no-cache' });
  createReadStream(abs).pipe(res);
}

const json = (res, obj) => { res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-cache' }); res.end(JSON.stringify(obj)); };

createServer((req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/' || url.pathname === '/index.html') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      return res.end(readFileSync(resolve(here, 'index.html'), 'utf8')); // read each time: edit the page, reload
    }
    if (url.pathname === '/api/today') return json(res, today());
    if (url.pathname === '/api/tests') return json(res, tests());
    if (url.pathname === '/api/nightlies') return json(res, nightlies());
    if (url.pathname === '/api/linear') return json(res, linear());
    if (url.pathname === '/api/guide') return json(res, guide());
    if (url.pathname === '/api/mechanics' && req.method === 'GET') return json(res, mechanics());
    if (url.pathname === '/api/mechanics' && req.method === 'POST') {
      return readBody(req).then((b) => json(res, mechanicsAction(b))).catch((e) => { res.writeHead(400, { 'content-type': 'application/json' }); res.end(JSON.stringify({ ok: false, said: String(e.message || e) })); });
    }
    if (url.pathname.startsWith('/files/')) return serveFile(res, url.pathname.slice(7));
    res.writeHead(404); res.end('not found');
  } catch (e) {
    res.writeHead(500, { 'content-type': 'text/plain' }); res.end(String(e.stack || e));
  }
}).listen(PORT, '127.0.0.1', () => console.log(`Dev Hub for ${CFG.game}: http://localhost:${PORT}`));
