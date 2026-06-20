/*
 * Moss Cave — engine regression test (no dependencies).
 * Loads the real store + availability modules under a tiny browser shim and
 * asserts the deterministic booking engine.
 *
 *   Run:  node tests/engine.test.js
 */
'use strict';
global.window = global;
global.localStorage = {
  _d: {},
  getItem: function (k) { return this._d[k] || null; },
  setItem: function (k, v) { this._d[k] = v; },
  removeItem: function (k) { delete this._d[k]; }
};

var fs = require('fs');
var path = require('path');
var root = path.join(__dirname, '..');
eval(fs.readFileSync(path.join(root, 'js/store.js'), 'utf8'));
eval(fs.readFileSync(path.join(root, 'js/availability.js'), 'utf8'));
var M = window.MossCave;

var pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name); }
}

// FNV-1a seed is deterministic
ok('seed stable + numeric', M.seed('2026-06-20') === M.seed('2026-06-20') && typeof M.seed('x') === 'number');

// June 20 2026 is Saturday -> weekend quota 90, and is "today"
var sat = M.dayInfo(2026, 5, 20);
ok('Sat 20 Jun is today', sat.isToday === true);
ok('weekend quota = 90', sat.quota === 90);
ok('status is open|limited|full', ['open', 'limited', 'full'].indexOf(sat.status) !== -1);
ok('0 <= remaining <= quota', sat.remaining >= 0 && sat.remaining <= sat.quota);

// June 22 2026 is Monday -> weekday quota 60
ok('weekday quota = 60', M.dayInfo(2026, 5, 22).quota === 60);

// Calendar grid for June 2026: Jun 1 is Monday -> 1 leading blank + 30 day cells
var days = M.buildDays();
ok('30 day cells', days.filter(function (d) { return d.show; }).length === 30);
ok('1 leading blank', days.filter(function (d) { return d.blank; }).length === 1);
ok('cells carry status + style', days.filter(function (d) { return d.show; }).every(function (d) { return d.status && d.cellStyle; }));

// Seeded demo booking so phone lookup works on first load
ok('demo (555) 0148 seeded as NC-2048', Array.isArray(M.state.myBookings['5550148']) && M.state.myBookings['5550148'][0].ref === 'NC-2048');

// Overrides raise the booked count for a date
var before = M.dayInfo(2026, 5, 23).booked;
M.state.overrides['2026-06-23'] = 5;
ok('override raises booked', M.dayInfo(2026, 5, 23).booked >= before);

// Price flows into the selected-day total
M.state.pricePerGuest = 48;
ok('selView total = party x price', M.selView('2026-06-23', 3).total === '$144');

// Admin data shapes
ok('buildBookings non-empty', M.buildBookings().length > 0);
ok('posDays = 12 chips', M.posDays().length === 12);
ok('weekStrip = 7 bars', M.buildWeekStrip().length === 7);

// buildMonth (admin POS calendar engine)
var june = M.buildMonth(2026, 5, '2026-06-20');
ok('buildMonth June: 1 blank + 30 cells', june.filter(function (c) { return c.blank; }).length === 1 && june.filter(function (c) { return c.show; }).length === 30);
var selCell = june.filter(function (c) { return c.key === '2026-06-20'; })[0];
ok('buildMonth highlights selectedKey', !!selCell && selCell.selected === true);
var d1 = june.filter(function (c) { return c.show && c.day === 1; })[0];
ok('buildMonth past day non-clickable', !!d1 && d1.clickable === false && d1.status === 'past');
var july = M.buildMonth(2026, 6, null);
ok('buildMonth July: 31 day cells', july.filter(function (c) { return c.show; }).length === 31);
ok('buildMonth July: 3 leading blanks (Jul 1 = Wed)', july.filter(function (c) { return c.blank; }).length === 3);
M.state.year = 2026; M.state.month = 5; M.state.selectedKey = '2026-06-20';
ok('buildDays delegates to buildMonth', JSON.stringify(M.buildDays()) === JSON.stringify(M.buildMonth(2026, 5, '2026-06-20')));

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
