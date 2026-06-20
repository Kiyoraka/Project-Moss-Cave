/* ===== Moss Cave — Admin surface: overview, bookings, POS, settings ===== */
window.MossCave = window.MossCave || {};
(function (M) {
  'use strict';

  var CARD = 'background:#11180e;border:1px solid rgba(155,209,122,.1);border-radius:14px';
  var STEP = 'width:34px;height:34px;border-radius:9px;background:rgba(12,17,11,.6);border:1px solid rgba(155,209,122,.2);color:#cdd8c2;font-size:18px;cursor:pointer';
  var TITLES = { main: 'Overview', bookings: 'Bookings', pos: 'Manual POS Booking', settings: 'Settings' };

  function navItem(active) {
    return 'display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:10px;cursor:pointer;font-size:14.5px;transition:all .2s;' + (active ? 'background:rgba(155,209,122,.12);color:#dbe9cd;' : 'color:#8c9a80;');
  }
  function navIcon(active) {
    return 'width:18px;height:18px;border-radius:5px;flex:none;background:' + (active ? '#9bd17a' : 'rgba(140,154,128,.35)') + ';transition:background .2s';
  }
  function statusStyle(status) {
    var sc = { confirmed: ['#9bd17a', 'rgba(155,209,122,.14)'], 'checked-in': ['#7fb0d9', 'rgba(127,176,217,.14)'], pending: ['#d9a44e', 'rgba(217,164,78,.14)'], completed: ['#8c9a80', 'rgba(140,154,128,.12)'] }[status] || ['#9bd17a', 'rgba(155,209,122,.14)'];
    return "font-family:'Space Mono',monospace;font-size:10.5px;padding:3px 9px;border-radius:5px;color:" + sc[0] + ';background:' + sc[1] + ';text-transform:capitalize;letter-spacing:.3px';
  }
  function fbtn(name) {
    var a = M.state.bookingFilter === name;
    return 'font-family:inherit;font-size:13px;padding:8px 16px;border-radius:9px;cursor:pointer;border:1px solid rgba(155,209,122,' + (a ? 0.4 : 0.12) + ');background:' + (a ? 'rgba(155,209,122,.12)' : 'transparent') + ';color:' + (a ? '#dbe9cd' : '#8c9a80') + ';text-transform:capitalize;transition:all .2s';
  }
  function slotBtn(active) {
    return 'flex:1;font-family:inherit;font-size:12.5px;padding:11px 8px;border-radius:10px;cursor:pointer;transition:all .2s;border:1px solid rgba(155,209,122,' + (active ? 0.45 : 0.14) + ');background:' + (active ? 'rgba(155,209,122,.14)' : 'rgba(12,17,11,.4)') + ';color:' + (active ? '#bfe89a' : '#9aa790') + ';font-weight:' + (active ? 600 : 400);
  }

  function bookingsList() {
    var filt = M.state.bookingFilter;
    return M.buildBookings().filter(function (b) {
      return filt === 'all' ? true : filt === 'today' ? b.off === 0 : b.status === filt;
    }).map(function (b) {
      return Object.assign({}, b, { amountLabel: '$' + b.amount, initials: M.initials(b.name), statusStyle: statusStyle(b.status) });
    });
  }

  // ---------- tabs ----------
  function mainTab() {
    var today = M.dayInfo(2026, 5, 20);
    var mBooked = Math.round(today.booked * 0.55), aBooked = today.booked - Math.round(today.booked * 0.55);
    var all = M.buildBookings();
    var weekRevenue = all.filter(function (b) { return b.off < 7; }).reduce(function (a, b) { return a + b.amount; }, 0);
    var todayCount = all.filter(function (b) { return b.off === 0; }).length;
    var list = bookingsList();
    var week = M.buildWeekStrip();

    var stat = function (cap, body) {
      return '<div style="' + CARD + ';padding:20px"><div style="font-family:\'Space Mono\',monospace;font-size:10.5px;letter-spacing:1px;color:#73815f;text-transform:uppercase;margin-bottom:14px">' + cap + '</div>' + body + '</div>';
    };
    var cards = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:22px">' +
      stat("Today's guests", '<div style="display:flex;align-items:baseline;gap:6px"><span style="font-family:\'Newsreader\',serif;font-size:38px;color:#dbe9cd">' + today.booked + '</span><span style="font-size:15px;color:#73815f">/ ' + today.quota + '</span></div><div style="height:6px;border-radius:4px;background:rgba(255,255,255,.05);overflow:hidden;margin-top:12px"><div style="height:100%;width:' + today.pct + '%;background:linear-gradient(90deg,#5f8a45,#9bd17a);border-radius:6px;transition:width .5s"></div></div>') +
      stat('Occupancy', '<div style="font-family:\'Newsreader\',serif;font-size:38px;color:#bfe89a">' + today.pct + '%</div><div style="font-size:12.5px;color:#73815f;margin-top:8px">' + today.remaining + ' spots remaining</div>') +
      stat('Bookings today', '<div style="font-family:\'Newsreader\',serif;font-size:38px;color:#dbe9cd">' + todayCount + '</div><div style="font-size:12.5px;color:#73815f;margin-top:8px">groups checked in</div>') +
      stat('Revenue / 7d', '<div style="font-family:\'Newsreader\',serif;font-size:38px;color:#dbe9cd">$' + weekRevenue.toLocaleString() + '</div><div style="font-size:12.5px;color:#9bd17a;margin-top:8px">▲ projected</div>') +
      '</div>';

    var chart = '<div style="display:grid;grid-template-columns:1.5fr 1fr;gap:16px;margin-bottom:22px">' +
      '<div style="' + CARD + ';padding:22px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><div style="font-size:15px;color:#dbe9cd">Capacity · next 7 days</div><span style="font-family:\'Space Mono\',monospace;font-size:11px;color:#73815f">% filled</span></div>' +
      '<div style="display:flex;align-items:flex-end;gap:12px;height:140px">' + week.map(function (w) {
        return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;height:100%"><div style="flex:1;width:100%;display:flex;align-items:flex-end"><div style="' + w.barStyle + '"></div></div><div style="font-family:\'Space Mono\',monospace;font-size:11px;color:#73815f">' + w.label + '</div><div style="font-size:12px;color:#9aa790">' + w.day + '</div></div>';
      }).join('') + '</div></div>' +
      '<div style="' + CARD + ';padding:22px"><div style="font-size:15px;color:#dbe9cd;margin-bottom:20px">Today by slot</div>' +
      '<div style="margin-bottom:18px"><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px"><span style="color:#9aa790">Morning · 09:30</span><span style="color:#7fb0d9">' + mBooked + '</span></div><div style="height:8px;border-radius:6px;background:rgba(255,255,255,.05);overflow:hidden"><div style="height:100%;width:' + Math.round(mBooked / today.quota * 100 * 2) + '%;max-width:100%;background:#7fb0d9;border-radius:6px"></div></div></div>' +
      '<div><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px"><span style="color:#9aa790">Afternoon · 14:00</span><span style="color:#bf8fd9">' + aBooked + '</span></div><div style="height:8px;border-radius:6px;background:rgba(255,255,255,.05);overflow:hidden"><div style="height:100%;width:' + Math.round(aBooked / today.quota * 100 * 2) + '%;max-width:100%;background:#bf8fd9;border-radius:6px"></div></div></div>' +
      '<div style="margin-top:24px;padding-top:18px;border-top:1px solid rgba(155,209,122,.08);font-size:13px;color:#73815f;line-height:1.6">Quota auto-resets at midnight. Adjust daily limits in <span data-go-tab="settings" style="color:#9bd17a;cursor:pointer">Settings</span>.</div></div></div>';

    var recent = '<div style="' + CARD + ';padding:22px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><div style="font-size:15px;color:#dbe9cd">Today\'s bookings</div><span data-go-tab="bookings" style="font-size:13px;color:#9bd17a;cursor:pointer">View all →</span></div>' +
      list.slice(0, 5).map(function (b) {
        return '<div style="display:flex;align-items:center;gap:14px;padding:11px 6px;border-bottom:1px solid rgba(155,209,122,.06)"><div style="width:34px;height:34px;border-radius:50%;background:rgba(155,209,122,.1);display:flex;align-items:center;justify-content:center;font-size:12px;color:#9bd17a;font-family:\'Space Mono\',monospace;flex:none">' + b.initials + '</div>' +
          '<div style="flex:1;min-width:0"><div style="font-size:14px;color:#dbe9cd">' + b.name + '</div><div style="font-family:\'Space Mono\',monospace;font-size:11px;color:#73815f">' + b.ref + '</div></div>' +
          '<div style="font-size:13px;color:#9aa790;width:90px">' + b.dateLabel + ' · ' + b.slot + '</div><div style="font-size:13px;color:#9aa790;width:70px">' + b.party + ' guests</div>' +
          '<span style="' + b.statusStyle + '">' + b.status + '</span><div style="font-family:\'Newsreader\',serif;font-size:17px;color:#bfe89a;width:60px;text-align:right">' + b.amountLabel + '</div></div>';
      }).join('') + '</div>';

    return '<div>' + cards + chart + recent + '</div>';
  }

  function bookingsTab() {
    var list = bookingsList();
    var per = 10;
    var pages = Math.max(1, Math.ceil(list.length / per));
    var page = Math.min(Math.max(1, M.state.bookingsPage), pages);
    var pageList = list.slice((page - 1) * per, page * per);
    var cols = 'display:grid;grid-template-columns:90px 1.4fr 1fr .8fr .7fr .9fr .7fr;gap:12px;padding:14px 22px';
    var rows = pageList.map(function (b) {
      return '<div style="' + cols + ';border-bottom:1px solid rgba(155,209,122,.05);align-items:center;font-size:13.5px;color:#cdd8c2">' +
        '<span style="font-family:\'Space Mono\',monospace;font-size:12px;color:#9bd17a">' + b.ref + '</span>' +
        '<span style="display:flex;align-items:center;gap:10px"><span style="width:28px;height:28px;border-radius:50%;background:rgba(155,209,122,.1);display:flex;align-items:center;justify-content:center;font-size:11px;color:#9bd17a;font-family:\'Space Mono\',monospace">' + b.initials + '</span>' + b.name + '</span>' +
        '<span style="color:#9aa790">' + b.dateLabel + ', 2026</span><span style="color:#9aa790">' + b.slot + '</span><span style="color:#9aa790">' + b.party + '</span>' +
        '<span><span style="' + b.statusStyle + '">' + b.status + '</span></span>' +
        '<span style="text-align:right;font-family:\'Newsreader\',serif;font-size:16px;color:#bfe89a">' + b.amountLabel + '</span></div>';
    }).join('');
    return '<div><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px"><div style="display:flex;gap:8px">' +
      ['all', 'today', 'confirmed', 'pending'].map(function (f) { return '<button data-filter="' + f + '" style="' + fbtn(f) + '">' + f + '</button>'; }).join('') +
      '</div><div style="font-family:\'Space Mono\',monospace;font-size:12px;color:#73815f">' + list.length + ' results</div></div>' +
      '<div style="' + CARD + ';overflow:hidden"><div style="' + cols + ';border-bottom:1px solid rgba(155,209,122,.1);font-family:\'Space Mono\',monospace;font-size:10.5px;letter-spacing:1px;color:#5f7a4d;text-transform:uppercase"><span>Ref</span><span>Guest</span><span>Date</span><span>Slot</span><span>Party</span><span>Status</span><span style="text-align:right">Amount</span></div>' +
      rows + '</div>' + pager(page, pages) + '</div>';
  }

  function pager(page, pages) {
    if (pages <= 1) return '';
    var btn = function (dir, label, disabled) {
      return '<button ' + (disabled ? '' : 'data-bnav="' + dir + '" ') + 'style="font-family:inherit;font-size:13px;padding:8px 16px;border-radius:9px;border:1px solid rgba(155,209,122,' + (disabled ? 0.06 : 0.18) + ');background:transparent;color:' + (disabled ? '#4a5640' : '#cdd8c2') + ';cursor:' + (disabled ? 'default' : 'pointer') + '">' + label + '</button>';
    };
    return '<div style="display:flex;align-items:center;justify-content:center;gap:18px;margin-top:18px">' +
      btn(-1, '‹ Prev', page <= 1) +
      '<span style="font-family:\'Space Mono\',monospace;font-size:12.5px;color:#8c9a80">Page ' + page + ' / ' + pages + '</span>' +
      btn(1, 'Next ›', page >= pages) + '</div>';
  }

  function posTab() {
    var s = M.state;
    var posInfo = M.dayInfo.apply(M, M.keyParts(s.posDateKey));
    var posDateLabel = M.MONTHS[posInfo.date.getMonth()].slice(0, 3) + ' ' + posInfo.date.getDate();
    var posOver = posInfo.remaining < s.posParty;
    var total = '$' + (s.posParty * s.pricePerGuest);

    if (s.posDone) {
      return '<div style="max-width:640px"><div style="background:#11180e;border:1px solid rgba(155,209,122,.18);border-radius:16px;padding:48px;text-align:center">' +
        '<div style="width:64px;height:64px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#bfe89a,#5f8a45);display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 20px;box-shadow:0 0 36px rgba(155,209,122,.45)">✓</div>' +
        '<div style="font-family:\'Newsreader\',serif;font-size:28px;margin-bottom:8px">Booking recorded</div>' +
        '<div style="font-size:14.5px;color:#b0bda4;margin-bottom:6px">' + posDateLabel + ' · ' + s.posParty + ' guests · ' + total + '</div>' +
        '<div style="font-size:13px;color:#73815f;margin-bottom:26px">Quota updated. Receipt printed to counter.</div>' +
        '<button id="pos-reset" class="btn-accent" style="font-size:14px;padding:12px 26px">New walk-in booking</button></div></div>';
    }
    var cells = M.buildMonth(s.posYear, s.posMonth, s.posDateKey);
    var calGrid = cells.map(function (d) {
      if (d.blank) return '<div style="' + d.cellStyle + '"></div>';
      return '<div ' + (d.clickable ? 'data-pos-key="' + d.key + '" ' : '') + 'style="' + d.cellStyle + '">' +
        '<div style="font-size:14px;font-weight:500;line-height:1">' + d.day + '</div><div style="' + d.dotStyle + '"></div></div>';
    }).join('');
    var legendDot = function (color, label) { return '<span style="display:flex;align-items:center;gap:7px"><i style="width:8px;height:8px;border-radius:50%;background:' + color + ';display:inline-block"></i>' + label + '</span>'; };
    var calendar = '<div style="background:rgba(12,17,11,.4);border:1px solid rgba(155,209,122,.1);border-radius:14px;padding:18px;margin-bottom:24px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px"><button data-pos-nav="-1" class="cal-nav">‹</button><div style="font-family:\'Newsreader\',serif;font-size:20px">' + M.MONTHS[s.posMonth] + ' ' + s.posYear + '</div><button data-pos-nav="1" class="cal-nav">›</button></div>' +
      '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:8px">' + M.WEEKDAY_LABELS.map(function (w) { return '<div class="wd">' + w + '</div>'; }).join('') + '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px">' + calGrid + '</div>' +
      '<div style="display:flex;gap:18px;margin-top:14px;font-size:12px;color:#8c9a80;font-family:\'Space Mono\',monospace">' + legendDot('#9bd17a', 'open') + legendDot('#d9a44e', 'limited') + legendDot('#7a4a48', 'full') + '</div></div>';
    var btnStyle = 'font-family:inherit;font-size:15px;font-weight:600;padding:15px;border-radius:12px;border:none;cursor:' + (posOver ? 'not-allowed' : 'pointer') + ';width:100%;background:' + (posOver ? 'rgba(120,60,56,.25)' : '#9bd17a') + ';color:' + (posOver ? '#8c6b68' : '#0c110b');
    return '<div style="max-width:640px"><div style="' + CARD + ';border-radius:16px;padding:28px">' +
      '<div style="font-size:13px;color:#9aa790;margin-bottom:10px">Guest name</div>' +
      '<input id="pos-name" value="' + String(s.posName || '').replace(/"/g, '&quot;') + '" placeholder="Walk-in guest" style="width:100%;font-family:inherit;font-size:15px;color:#e7ede0;background:rgba(12,17,11,.6);border:1px solid rgba(155,209,122,.16);border-radius:11px;padding:13px 15px;margin-bottom:24px;outline:none" />' +
      '<div style="font-size:13px;color:#9aa790;margin-bottom:10px">Date</div>' + calendar +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">' +
      '<div><div style="font-size:13px;color:#9aa790;margin-bottom:10px">Slot</div><div style="display:flex;gap:8px"><button data-pos-slot="morning" style="' + slotBtn(s.posSlot === 'morning') + '">Morning</button><button data-pos-slot="afternoon" style="' + slotBtn(s.posSlot === 'afternoon') + '">Afternoon</button></div></div>' +
      '<div><div style="font-size:13px;color:#9aa790;margin-bottom:10px">Party size</div><div style="display:flex;align-items:center;justify-content:space-between;background:rgba(155,209,122,.06);border:1px solid rgba(155,209,122,.14);border-radius:11px;padding:7px 10px"><button data-pos-party="dec" style="width:32px;height:32px;border-radius:8px;background:rgba(12,17,11,.6);border:1px solid rgba(155,209,122,.2);color:#cdd8c2;font-size:18px;cursor:pointer">–</button><span style="font-family:\'Newsreader\',serif;font-size:24px">' + s.posParty + '</span><button data-pos-party="inc" style="width:32px;height:32px;border-radius:8px;background:rgba(12,17,11,.6);border:1px solid rgba(155,209,122,.2);color:#cdd8c2;font-size:18px;cursor:pointer">+</button></div></div></div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px;border-radius:12px;background:rgba(155,209,122,.05);border:1px solid rgba(155,209,122,.1);margin-bottom:20px"><div><div style="font-size:13px;color:#9aa790">' + posDateLabel + ' · ' + posInfo.remaining + '/' + posInfo.quota + ' left</div><div style="font-size:12px;color:#73815f;font-family:\'Space Mono\',monospace">' + s.posParty + ' × ' + total + '</div></div><div style="font-family:\'Newsreader\',serif;font-size:30px;color:#bfe89a">' + total + '</div></div>' +
      '<button id="pos-complete" style="' + btnStyle + '">' + (posOver ? 'Not enough spots' : 'Complete booking') + '</button></div></div>';
  }

  function settingsTab() {
    var s = M.state;
    var row = function (title, sub, dec, span, inc) {
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-top:1px solid rgba(155,209,122,.08)"><div><div style="font-size:15px;color:#dbe9cd">' + title + '</div><div style="font-size:12.5px;color:#73815f">' + sub + '</div></div>' +
        '<div style="display:flex;align-items:center;gap:14px"><button data-set="' + dec + '" style="' + STEP + '">–</button><span style="font-family:\'Newsreader\',serif;font-size:28px;color:#bfe89a;width:' + (inc === 'incPrice' ? 64 : 54) + 'px;text-align:center">' + span + '</span><button data-set="' + inc + '" style="' + STEP + '">+</button></div></div>';
    };
    return '<div style="max-width:720px"><div style="' + CARD + ';border-radius:16px;padding:28px;margin-bottom:18px">' +
      '<div style="font-family:\'Newsreader\',serif;font-size:21px;margin-bottom:4px">Daily quota</div><div style="font-size:13.5px;color:#73815f;margin-bottom:24px">How many guests the cave admits each day. Changes apply instantly to the public booking calendar.</div>' +
      row('Weekday limit', 'Mon – Fri', 'decWeekday', s.weekdayQuota, 'incWeekday') +
      row('Weekend limit', 'Sat – Sun', 'decWeekend', s.weekendQuota, 'incWeekend') +
      row('Price per guest', 'USD, per descent', 'decPrice', '$' + s.pricePerGuest, 'incPrice') +
      '</div><div style="' + CARD + ';border-radius:16px;padding:28px"><div style="font-family:\'Newsreader\',serif;font-size:21px;margin-bottom:20px">Tour slots</div>' +
      '<div style="display:flex;gap:14px"><div style="flex:1;padding:18px;border-radius:12px;background:rgba(127,176,217,.08);border:1px solid rgba(127,176,217,.18)"><div style="font-family:\'Space Mono\',monospace;font-size:11px;color:#7fb0d9;letter-spacing:1px">MORNING</div><div style="font-family:\'Newsreader\',serif;font-size:26px;margin-top:6px">09:30</div></div>' +
      '<div style="flex:1;padding:18px;border-radius:12px;background:rgba(191,143,217,.08);border:1px solid rgba(191,143,217,.18)"><div style="font-family:\'Space Mono\',monospace;font-size:11px;color:#bf8fd9;letter-spacing:1px">AFTERNOON</div><div style="font-family:\'Newsreader\',serif;font-size:26px;margin-top:6px">14:00</div></div></div>' +
      '<button class="btn-accent" style="margin-top:22px;font-size:14px;padding:12px 24px">Save changes</button></div></div>';
  }

  // ---------- setters ----------
  var SET = {
    decWeekday: function (s) { return { weekdayQuota: Math.max(10, s.weekdayQuota - 5) }; },
    incWeekday: function (s) { return { weekdayQuota: Math.min(200, s.weekdayQuota + 5) }; },
    decWeekend: function (s) { return { weekendQuota: Math.max(10, s.weekendQuota - 5) }; },
    incWeekend: function (s) { return { weekendQuota: Math.min(200, s.weekendQuota + 5) }; },
    decPrice: function (s) { return { pricePerGuest: Math.max(2, s.pricePerGuest - 2) }; },
    incPrice: function (s) { return { pricePerGuest: Math.min(200, s.pricePerGuest + 2) }; }
  };

  function body() {
    switch (M.state.adminTab) {
      case 'bookings': return bookingsTab();
      case 'pos': return posTab();
      case 'settings': return settingsTab();
      default: return mainTab();
    }
  }

  function shellHTML() {
    var tab = M.state.adminTab;
    var nav = [['main', 'Main'], ['bookings', 'Bookings'], ['pos', 'Manual POS Booking'], ['settings', 'Settings']].map(function (n) {
      return '<div data-go-tab="' + n[0] + '" style="' + navItem(tab === n[0]) + '"><span style="' + navIcon(tab === n[0]) + '"></span>' + n[1] + '</div>';
    }).join('');
    return '<div style="display:flex;min-height:100vh;background:#0a0f08">' +
      '<aside style="width:248px;flex:none;background:#0d130b;border-right:1px solid rgba(155,209,122,.1);display:flex;flex-direction:column;padding:22px 16px;position:sticky;top:0;height:100vh">' +
      '<div style="display:flex;align-items:center;gap:11px;padding:6px 8px 24px"><div class="logo-dot" style="box-shadow:0 0 16px rgba(155,209,122,.4)"></div><div><div style="font-family:\'Newsreader\',serif;font-size:19px;line-height:1">Nature</div><div style="font-family:\'Space Mono\',monospace;font-size:9.5px;letter-spacing:2px;color:#5f7a4d;text-transform:uppercase">admin</div></div></div>' +
      '<div style="font-family:\'Space Mono\',monospace;font-size:10px;letter-spacing:2px;color:#5f7a4d;text-transform:uppercase;padding:0 8px 10px">Manage</div>' +
      '<nav style="display:flex;flex-direction:column;gap:3px">' + nav + '</nav>' +
      '<div style="margin-top:auto;display:flex;align-items:center;gap:11px;padding:12px 8px;border-top:1px solid rgba(155,209,122,.1)"><div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#3d5a3a,#7fb0d9);flex:none"></div><div style="line-height:1.3"><div style="font-size:13.5px;color:#dbe9cd">Marsh Keeper</div><div style="font-size:11px;color:#73815f">manager</div></div></div></aside>' +
      '<main style="flex:1;min-width:0;display:flex;flex-direction:column">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid rgba(155,209,122,.1);background:rgba(13,19,11,.6);position:sticky;top:0;z-index:50;backdrop-filter:blur(8px)">' +
      '<div><div style="font-family:\'Newsreader\',serif;font-size:24px">' + TITLES[tab] + '</div><div style="font-family:\'Space Mono\',monospace;font-size:11px;color:#73815f;letter-spacing:.5px">Saturday · June 20, 2026</div></div>' +
      '<div style="display:flex;align-items:center;gap:14px"><div style="display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:100px;background:rgba(155,209,122,.06);border:1px solid rgba(155,209,122,.12);font-size:13px;color:#9bd17a"><span style="width:7px;height:7px;border-radius:50%;background:#9bd17a;display:inline-block;animation:glow-pulse 2.5s ease-in-out infinite"></span>Cave open</div>' +
      '<button data-go-tab="pos" class="btn-accent" style="font-size:13.5px;padding:10px 18px">+ New booking</button></div></div>' +
      '<div style="padding:28px 32px;flex:1">' + body() + '</div></main></div>';
  }

  M.admin = {
    render: function () {
      var root = document.getElementById('surface-admin');
      if (!root) return;
      root.innerHTML = shellHTML();

      root.querySelectorAll('[data-go-tab]').forEach(function (el) {
        el.addEventListener('click', function () { M.setState({ adminTab: this.getAttribute('data-go-tab') }); });
      });
      root.querySelectorAll('[data-filter]').forEach(function (el) {
        el.addEventListener('click', function () { M.setState({ bookingFilter: this.getAttribute('data-filter'), bookingsPage: 1, bookingsShown: 10 }); });
      });
      root.querySelectorAll('[data-bnav]').forEach(function (el) {
        el.addEventListener('click', function () { var d = +this.getAttribute('data-bnav'); M.setState(function (s) { return { bookingsPage: s.bookingsPage + d }; }); });
      });
      root.querySelectorAll('[data-set]').forEach(function (el) {
        el.addEventListener('click', function () { M.setState(SET[this.getAttribute('data-set')]); });
      });
      // POS
      root.querySelectorAll('[data-pos-key]').forEach(function (el) {
        el.addEventListener('click', function () { M.setState({ posDateKey: this.getAttribute('data-pos-key'), posDone: false }); });
      });
      root.querySelectorAll('[data-pos-nav]').forEach(function (el) {
        el.addEventListener('click', function () {
          var d = +this.getAttribute('data-pos-nav');
          M.setState(function (s) { var m = s.posMonth + d, y = s.posYear; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } return { posMonth: m, posYear: y }; });
        });
      });
      root.querySelectorAll('[data-pos-slot]').forEach(function (el) {
        el.addEventListener('click', function () { M.setState({ posSlot: this.getAttribute('data-pos-slot') }); });
      });
      var pdec = root.querySelector('[data-pos-party="dec"]');
      var pinc = root.querySelector('[data-pos-party="inc"]');
      if (pdec) pdec.addEventListener('click', function () { M.setState(function (s) { return { posParty: Math.max(1, s.posParty - 1) }; }); });
      if (pinc) pinc.addEventListener('click', function () { M.setState(function (s) { return { posParty: Math.min(8, s.posParty + 1) }; }); });
      var pname = root.querySelector('#pos-name');
      if (pname) pname.addEventListener('input', function () { M.set({ posName: this.value }); });
      var pcomplete = root.querySelector('#pos-complete');
      if (pcomplete) pcomplete.addEventListener('click', function () {
        var info = M.dayInfo.apply(M, M.keyParts(M.state.posDateKey));
        if (info.remaining < M.state.posParty) return;
        M.setState(function (s) {
          var ov = Object.assign({}, s.overrides); ov[s.posDateKey] = (ov[s.posDateKey] || 0) + s.posParty;
          return { overrides: ov, posDone: true };
        });
      });
      var preset = root.querySelector('#pos-reset');
      if (preset) preset.addEventListener('click', function () { M.setState({ posDone: false, posName: '', posParty: 2, posSlot: 'morning' }); });
    }
  };

})(window.MossCave);
