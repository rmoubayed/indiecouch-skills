// Turns a list of Linear issues into the Dev Hub's Linear page data. The hub never talks to Linear itself:
// whoever has the connector (the morning triage task, or a session) saves the project's issues as JSON and runs
//   node devhub/linear_snapshot.mjs <game folder> <issues.json>
// issues.json: an array (or {issues: [...]}) of { id, title, status, labels: [..], projectMilestone: {name} | null, url }.
// Writes <game>/Saved/DevHub/linear.json: counts by state, open counts by area and milestone, the review queue and what's
// in progress.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const [game, file] = process.argv.slice(2);
if (!game || !file) { console.error('usage: node devhub/linear_snapshot.mjs <game folder> <issues.json>'); process.exit(1); }
const cfg = JSON.parse(readFileSync(resolve(game, 'studio.json'), 'utf8').replace(/^﻿/, ''));
let issues = JSON.parse(readFileSync(file, 'utf8').replace(/^﻿/, ''));
issues = Array.isArray(issues) ? issues : issues.issues;

const TYPES = new Set(['Bug', 'Feature', 'Improvement']);
const area = (i) => (i.labels || []).find((l) => !TYPES.has(l)) || 'No area';
const closed = (s) => ['Done', 'Canceled', 'Duplicate', 'Needs Human Attention'].includes(s);
const count = (list, key) => list.reduce((m, i) => { const k = key(i); m[k] = (m[k] || 0) + 1; return m; }, {});
const open = issues.filter((i) => !closed(i.status));
const brief = (i) => ({ id: i.id, title: i.title, url: i.url, area: area(i) });

const out = {
  at: new Date().toISOString(), project: cfg.linear?.project || 'project', total: issues.length,
  byState: count(issues, (i) => i.status),
  byArea: count(open, area),
  byMilestone: count(open, (i) => i.projectMilestone?.name || 'No milestone'),
  review: issues.filter((i) => i.status === 'Needs Human Attention').map(brief),
  inProgress: issues.filter((i) => i.status === 'In Progress').map(brief),
};
mkdirSync(resolve(game, 'Saved', 'DevHub'), { recursive: true });
writeFileSync(resolve(game, 'Saved', 'DevHub', 'linear.json'), JSON.stringify(out, null, 1));
console.log(`linear.json: ${issues.length} issues, ${open.length} open, ${out.review.length} to review`);
