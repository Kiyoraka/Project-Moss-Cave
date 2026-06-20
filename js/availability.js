/* ===== Moss Cave — deterministic availability + calendar engine ===== */
window.MossCave = window.MossCave || {};
(function (M) {
  'use strict';

  var STATUS_DOT = { open: '#9bd17a', limited: '#d9a44e', full: '#a85d59', past: '#3a4632' };

  // FNV-1a hash — gives each date a stable pseudo-random number (same every load).
  M.seed = function (key) {
    var h = 2166136261;
    for (var i = 0; i < key.length; i++) {
      h ^= key.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  };

  M.sameDay = function (a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  M.quotaFor = function (dow) {
    return (dow === 0 || dow === 6) ? M.state.weekendQuota : M.state.weekdayQuota;
  };

  function todayDate() { return new Date(M.TODAY.y, M.TODAY.m, M.TODAY.d); }

  // Everything the UI needs to know about one calendar day.
  M.dayInfo = function (year, month, d) {
    var date = new Date(year, month, d);
    var dow = date.getDay();
    var key = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    var quota = M.quotaFor(dow);
    var s = M.seed(key);
    var booked = Math.floor((s % 1000) / 1000 * quota * 0.95);
    if (dow === 0 || dow === 6) booked = Math.min(quota, booked + Math.floor(quota * 0.15));
    booked = Math.min(quota, booked + (M.state.overrides[key] || 0));
    var today = todayDate();
    var isPast = date < today && !M.sameDay(date, today);
    var remaining = Math.max(0, quota - booked);
    var status = isPast ? 'past' : remaining === 0 ? 'full' : remaining <= Math.ceil(quota * 0.2) ? 'limited' : 'open';
    return {
      date: date, dow: dow, key: key, quota: quota, booked: booked, remaining: remaining,
      status: status, isPast: isPast, isToday: M.sameDay(date, today),
      pct: Math.round(booked / quota * 100)
    };
  };

  // Month grid cells for any year/month, highlighting selectedKey.
  // Shared by the public calendar (landing/mobile) and the admin POS calendar.
  M.buildMonth = function (year, month, selectedKey) {
    var first = new Date(year, month, 1);
    var startDow = first.getDay();
    var dim = new Date(year, month + 1, 0).getDate();
    var cells = [];
    var i;
    for (i = 0; i < startDow; i++) cells.push({ blank: true, show: false, key: 'blank' + i, cellStyle: 'aspect-ratio:1;' });
    var base = 'aspect-ratio:1;border-radius:11px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;position:relative;transition:all .2s;';
    for (var d = 1; d <= dim; d++) {
      var info = M.dayInfo(year, month, d);
      var selected = info.key === selectedKey;
      var clickable = info.status !== 'full' && info.status !== 'past';
      var cellStyle;
      if (info.status === 'past') cellStyle = base + 'color:#3a4632;cursor:default;background:transparent;';
      else if (info.status === 'full') cellStyle = base + 'color:#6e5350;cursor:not-allowed;background:rgba(120,60,56,.08);';
      else if (selected) cellStyle = base + 'color:#0c110b;cursor:pointer;background:#9bd17a;box-shadow:0 0 22px rgba(155,209,122,.5);transform:scale(1.04);';
      else cellStyle = base + 'color:#dbe4d2;cursor:pointer;background:rgba(155,209,122,.05);border:1px solid rgba(155,209,122,.1);';
      var dotStyle = 'width:6px;height:6px;border-radius:50%;background:' + (selected ? '#0c110b' : STATUS_DOT[info.status]) + ';opacity:' + (selected ? 0.7 : 1) + ';';
      cells.push({ blank: false, show: true, day: d, key: info.key, status: info.status, clickable: clickable, selected: selected, cellStyle: cellStyle, dotStyle: dotStyle });
    }
    return cells;
  };

  // Public booking calendar grid for the current state.year/state.month.
  M.buildDays = function () {
    return M.buildMonth(M.state.year, M.state.month, M.state.selectedKey);
  };

  // View-model for the currently selected day (badge, availability bar, total).
  M.selView = function (key, partySize) {
    if (!key) return null;
    var info = M.dayInfo.apply(M, M.keyParts(key));
    var dl = M.MONTHS[info.date.getMonth()] + ' ' + info.date.getDate() + ', ' + info.date.getFullYear();
    var statusMap = {
      open: ['Open', '#9bd17a', 'rgba(155,209,122,.14)'],
      limited: ['Filling fast', '#d9a44e', 'rgba(217,164,78,.14)'],
      full: ['Full', '#a85d59', 'rgba(168,93,89,.16)']
    };
    var st = statusMap[info.status] || statusMap.open;
    var barColor = info.status === 'limited' ? '#d9a44e' : info.status === 'full' ? '#a85d59' : '#9bd17a';
    return {
      info: info, dateLabel: dl, statusText: st[0], remaining: info.remaining, quota: info.quota, pct: info.pct,
      badgeStyle: "font-family:'Space Mono',monospace;font-size:11px;padding:4px 10px;border-radius:6px;color:" + st[1] + ';background:' + st[2] + ';letter-spacing:.5px',
      barStyle: 'height:100%;width:' + info.pct + '%;background:' + barColor + ';border-radius:6px;transition:width .5s',
      total: '$' + (partySize * M.state.pricePerGuest)
    };
  };

  // 14 days of deterministic demo bookings (admin lists + stats).
  M.buildBookings = function () {
    var list = [];
    for (var off = 0; off < 14; off++) {
      var date = new Date(2026, 5, 20 + off);
      var info = M.dayInfo(date.getFullYear(), date.getMonth(), date.getDate());
      var s = M.seed(info.key + 'bk');
      var n = 2 + (s % 4); // 2-5 bookings per day
      for (var i = 0; i < n; i++) {
        var h = M.seed(info.key + i);
        var party = 1 + (h % 6);
        var slot = (h >>> 3) % 2 ? 'Afternoon' : 'Morning';
        var name = M.NAMES[(h >>> 5) % M.NAMES.length];
        var stArr = ['confirmed', 'confirmed', 'confirmed', 'checked-in', 'pending'];
        var status = off === 0 ? stArr[(h >>> 2) % stArr.length] : 'confirmed';
        var ref = 'NC-' + (1000 + (h % 9000));
        list.push({
          ref: ref, name: name, dateObj: date, key: info.key,
          dateLabel: M.MONTHS[date.getMonth()].slice(0, 3) + ' ' + date.getDate(),
          slot: slot, party: party, status: status, amount: party * M.state.pricePerGuest, off: off
        });
      }
    }
    return list;
  };

  // 12 date chips for the POS / manual-booking flow.
  M.posDays = function () {
    var out = [];
    var dows = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    for (var off = 0; off < 12; off++) {
      var date = new Date(2026, 5, 20 + off);
      var info = M.dayInfo(date.getFullYear(), date.getMonth(), date.getDate());
      out.push({
        key: info.key, date: date, dow: dows[date.getDay()], day: date.getDate(),
        mon: M.MONTHS[date.getMonth()].slice(0, 3), status: info.status, remaining: info.remaining, quota: info.quota
      });
    }
    return out;
  };

  // 7-day capacity strip for the admin overview chart.
  M.buildWeekStrip = function () {
    var dows = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    var out = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date(2026, 5, 20 + i);
      var inf = M.dayInfo(d.getFullYear(), d.getMonth(), d.getDate());
      var color = inf.status === 'full' ? '#a85d59' : inf.status === 'limited' ? '#d9a44e' : '#6f9a4f';
      out.push({
        label: dows[d.getDay()], day: d.getDate(), pct: inf.pct, isToday: i === 0,
        barStyle: 'width:100%;border-radius:6px 6px 2px 2px;height:' + Math.max(8, inf.pct) + '%;background:' + color + ';transition:height .4s'
      });
    }
    return out;
  };

})(window.MossCave);
