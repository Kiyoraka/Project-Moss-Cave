/* ===== Moss Cave — Mobile surface: phone frame, guest app + admin app ===== */
window.MossCave = window.MossCave || {};
(function (M) {
  'use strict';

  function escAttr(v) { return String(v || '').replace(/"/g, '&quot;'); }
  var DL_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0c110b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 v12"></path><path d="M7 11 l5 5 l5 -5"></path><path d="M5 20 h14"></path></svg>';

  function slotBtn(active) {
    return 'flex:1;font-family:inherit;font-size:12.5px;padding:11px 8px;border-radius:10px;cursor:pointer;transition:all .2s;border:1px solid rgba(155,209,122,' + (active ? 0.45 : 0.14) + ');background:' + (active ? 'rgba(155,209,122,.14)' : 'rgba(12,17,11,.4)') + ';color:' + (active ? '#bfe89a' : '#9aa790') + ';font-weight:' + (active ? 600 : 400);
  }
  function gate() {
    var s = M.state;
    var sel = s.selectedKey ? M.dayInfo.apply(M, M.keyParts(s.selectedKey)) : null;
    var full = sel && sel.remaining < s.partySize;
    var needPhone = !(s.guestPhone && s.guestPhone.replace(/\D/g, '').length >= 6);
    var disabled = full || needPhone;
    return {
      disabled: disabled,
      label: full ? 'Not enough spots' : needPhone ? 'Enter phone to confirm' : 'Confirm reservation',
      style: 'width:100%;font-family:inherit;font-size:15px;font-weight:600;padding:14px;border-radius:12px;border:none;cursor:' + (disabled ? 'not-allowed' : 'pointer') + ';background:' + (disabled ? 'rgba(155,209,122,.2)' : '#9bd17a') + ';color:' + (disabled ? '#6f8a58' : '#0c110b')
    };
  }
  function confirmBooking() {
    var key = M.state.selectedKey; if (!key) return;
    var info = M.dayInfo.apply(M, M.keyParts(key));
    var ref = 'NC-' + (1000 + Math.floor(Math.random() * 8999));
    var dateLabel = M.MONTHS[info.date.getMonth()] + ' ' + info.date.getDate() + ', ' + info.date.getFullYear();
    var slot = M.state.slot === 'morning' ? 'Morning · 09:30' : 'Afternoon · 14:00';
    var digits = (M.state.guestPhone || '').replace(/\D/g, '');
    var rec = { ref: ref, dateKey: key, dateLabel: dateLabel, slot: slot, party: M.state.partySize, amount: M.state.partySize * M.state.pricePerGuest, name: M.state.guestName || 'Guest', phone: M.state.guestPhone || '—', status: 'Confirmed' };
    M.setState(function (s) {
      var mb = Object.assign({}, s.myBookings);
      if (digits) mb[digits] = (mb[digits] || []).concat([rec]);
      var ov = Object.assign({}, s.overrides); ov[key] = (ov[key] || 0) + s.partySize;
      return { overrides: ov, bookingStep: 2, lastBooking: rec, myBookings: mb };
    });
  }
  function findTrack() {
    var digits = (M.state.trackPhone || '').replace(/\D/g, '');
    var res = digits.length >= 4 ? (M.state.myBookings[digits] || []) : [];
    M.setState({ trackResults: res, trackSearched: true });
  }
  function statusStyle(status) {
    var sc = { confirmed: ['#9bd17a', 'rgba(155,209,122,.14)'], 'checked-in': ['#7fb0d9', 'rgba(127,176,217,.14)'], pending: ['#d9a44e', 'rgba(217,164,78,.14)'], completed: ['#8c9a80', 'rgba(140,154,128,.12)'] }[status] || ['#9bd17a', 'rgba(155,209,122,.14)'];
    return "font-family:'Space Mono',monospace;font-size:10px;padding:3px 8px;border-radius:5px;color:" + sc[0] + ';background:' + sc[1] + ';text-transform:capitalize';
  }
  function bookingsList() {
    var filt = M.state.bookingFilter;
    return M.buildBookings().filter(function (b) { return filt === 'all' ? true : filt === 'today' ? b.off === 0 : b.status === filt; })
      .map(function (b) { return Object.assign({}, b, { amountLabel: '$' + b.amount, initials: M.initials(b.name), statusStyle: statusStyle(b.status) }); });
  }
  function fbtn(name) {
    var a = M.state.bookingFilter === name;
    return 'flex:none;font-family:inherit;font-size:12.5px;padding:7px 14px;border-radius:9px;cursor:pointer;border:1px solid rgba(155,209,122,' + (a ? 0.4 : 0.12) + ');background:' + (a ? 'rgba(155,209,122,.12)' : 'transparent') + ';color:' + (a ? '#dbe9cd' : '#8c9a80') + ';text-transform:capitalize';
  }

  // ---------- guest screens ----------
  function guestHome() {
    var today = M.dayInfo(2026, 5, 20);
    return '<div style="padding:8px 18px 26px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 2px 16px"><div style="display:flex;align-items:center;gap:9px"><div class="logo-dot" style="width:26px;height:26px;box-shadow:none"></div><span style="font-family:\'Newsreader\',serif;font-size:19px">Nature</span></div><div style="width:34px;height:34px;border-radius:50%;background:rgba(155,209,122,.08);border:1px solid rgba(155,209,122,.14)"></div></div>' +
      '<div style="position:relative;height:340px;border-radius:24px;overflow:hidden;background:radial-gradient(80% 70% at 50% 30%,#2a3c22,#0d140a);border:1px solid rgba(155,209,122,.14)">' +
      '<div style="position:absolute;inset:0;background:repeating-linear-gradient(125deg,#16201230,#16201230 12px,#1c281830 12px,#1c281830 24px)"></div>' +
      '<div style="position:absolute;inset:0;background:radial-gradient(50% 40% at 30% 70%,rgba(155,209,122,.22),transparent 70%);animation:glow-pulse 5s ease-in-out infinite"></div>' +
      '<div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(8,11,7,.85))"></div>' +
      '<div style="position:absolute;left:20px;right:20px;bottom:22px"><div style="font-family:\'Space Mono\',monospace;font-size:10px;letter-spacing:2px;color:#9bd17a;text-transform:uppercase;margin-bottom:8px">An underground sanctuary</div><div style="font-family:\'Newsreader\',serif;font-size:34px;line-height:1;margin-bottom:6px">Where moss meets <em style="font-style:italic;color:#bfe89a">stone</em></div></div>' +
      '<div style="position:absolute;left:20px;top:20px;display:flex;align-items:center;gap:6px;padding:6px 11px;border-radius:100px;background:rgba(12,17,11,.6);backdrop-filter:blur(6px);font-size:11px;color:#9bd17a"><span style="width:6px;height:6px;border-radius:50%;background:#9bd17a;display:inline-block"></span>Open today</div></div>' +
      '<button data-mtab="book" style="width:100%;font-family:inherit;font-size:15px;color:#0c110b;background:#9bd17a;border:none;padding:16px;border-radius:16px;cursor:pointer;font-weight:600;margin-top:16px;box-shadow:0 0 26px rgba(155,209,122,.3)">Book your descent</button>' +
      '<div style="display:flex;gap:10px;margin-top:16px">' +
      '<div style="flex:1;background:#11180e;border:1px solid rgba(155,209,122,.1);border-radius:16px;padding:16px"><div style="font-family:\'Newsreader\',serif;font-size:26px;color:#bfe89a">11°</div><div style="font-size:11px;color:#73815f;font-family:\'Space Mono\',monospace">temp</div></div>' +
      '<div style="flex:1;background:#11180e;border:1px solid rgba(155,209,122,.1);border-radius:16px;padding:16px"><div style="font-family:\'Newsreader\',serif;font-size:26px;color:#bfe89a">90<span style="font-size:15px">m</span></div><div style="font-size:11px;color:#73815f;font-family:\'Space Mono\',monospace">tour</div></div>' +
      '<div style="flex:1;background:#11180e;border:1px solid rgba(155,209,122,.1);border-radius:16px;padding:16px"><div style="font-family:\'Newsreader\',serif;font-size:26px;color:#bfe89a">' + today.remaining + '</div><div style="font-size:11px;color:#73815f;font-family:\'Space Mono\',monospace">left</div></div></div>' +
      '<div style="margin-top:18px;font-size:13.5px;color:#8c9a80;line-height:1.6;padding:0 2px">Descend into a living cave of glowing moss, still water and cool air. A slow, quiet escape — limited by nature.</div></div>';
  }

  function guestBook() {
    var s = M.state;
    var days = M.buildDays().slice(0, 42);
    var grid = days.map(function (d) {
      if (!d.show) return '<div style="' + d.cellStyle + '"></div>';
      return '<div ' + (d.clickable ? 'data-key="' + d.key + '" ' : '') + 'style="' + d.cellStyle + '"><div style="font-size:13px;font-weight:500;line-height:1">' + d.day + '</div><div style="' + d.dotStyle + '"></div></div>';
    }).join('');

    var panel = '';
    if (s.selectedKey && s.bookingStep === 1) {
      var sel = M.selView(s.selectedKey, s.partySize);
      var g = gate();
      panel = '<div style="margin-top:18px;background:#11180e;border:1px solid rgba(155,209,122,.12);border-radius:18px;padding:18px">' +
        '<div style="font-family:\'Newsreader\',serif;font-size:20px">' + sel.dateLabel + '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;margin:6px 0 16px"><span style="' + sel.badgeStyle + '">' + sel.statusText + '</span><span style="font-size:12px;color:#8c9a80;font-family:\'Space Mono\',monospace">' + sel.remaining + ' left</span></div>' +
        '<div style="display:flex;gap:7px;margin-bottom:14px"><button data-slot="morning" style="' + slotBtn(s.slot === 'morning') + '">Morning</button><button data-slot="afternoon" style="' + slotBtn(s.slot === 'afternoon') + '">Afternoon</button></div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;background:rgba(155,209,122,.06);border:1px solid rgba(155,209,122,.14);border-radius:12px;padding:9px 12px;margin-bottom:16px"><button data-party="dec" style="width:34px;height:34px;border-radius:9px;background:rgba(12,17,11,.6);border:1px solid rgba(155,209,122,.2);color:#cdd8c2;font-size:18px;cursor:pointer">–</button><div style="text-align:center"><span style="font-family:\'Newsreader\',serif;font-size:24px">' + s.partySize + '</span> <span style="font-size:11px;color:#73815f">guests</span></div><button data-party="inc" style="width:34px;height:34px;border-radius:9px;background:rgba(12,17,11,.6);border:1px solid rgba(155,209,122,.2);color:#cdd8c2;font-size:18px;cursor:pointer">+</button></div>' +
        '<input id="m-name" value="' + escAttr(s.guestName) + '" placeholder="Name (optional)" style="width:100%;font-family:inherit;font-size:14px;color:#e7ede0;background:rgba(12,17,11,.6);border:1px solid rgba(155,209,122,.16);border-radius:10px;padding:11px 13px;margin-bottom:8px;outline:none" />' +
        '<input id="m-phone" value="' + escAttr(s.guestPhone) + '" placeholder="Phone number" style="width:100%;font-family:inherit;font-size:14px;color:#e7ede0;background:rgba(12,17,11,.6);border:1px solid rgba(155,209,122,.16);border-radius:10px;padding:11px 13px;margin-bottom:14px;outline:none" />' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px"><span style="color:#8c9a80;font-size:13px">' + s.partySize + ' × $' + s.pricePerGuest + '</span><span id="m-total" style="font-family:\'Newsreader\',serif;font-size:22px;color:#bfe89a">' + sel.total + '</span></div>' +
        '<button id="m-confirm" style="' + g.style + '">' + g.label + '</button></div>';
    } else if (s.selectedKey && s.bookingStep === 2) {
      var sel2 = M.selView(s.selectedKey, s.partySize);
      var slotLabel = s.slot === 'morning' ? 'Morning · 09:30' : 'Afternoon · 14:00';
      panel = '<div style="margin-top:18px;background:#11180e;border:1px solid rgba(155,209,122,.18);border-radius:18px;padding:28px;text-align:center">' +
        '<div style="width:56px;height:56px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#bfe89a,#5f8a45);display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 16px;box-shadow:0 0 30px rgba(155,209,122,.45)">✓</div>' +
        '<div style="font-family:\'Newsreader\',serif;font-size:22px;margin-bottom:6px">You\'re booked in</div>' +
        '<div style="font-size:13px;color:#b0bda4;margin-bottom:4px">' + sel2.dateLabel + ' · ' + slotLabel + ' · ' + s.partySize + ' guests</div>' +
        '<div style="font-family:\'Space Mono\',monospace;font-size:11px;color:#9bd17a;letter-spacing:1px;margin-bottom:18px">Ref ' + (s.lastBooking ? s.lastBooking.ref : '') + '</div>' +
        '<button id="m-dl" style="width:100%;font-family:inherit;font-size:13.5px;color:#0c110b;background:#9bd17a;border:none;padding:12px;border-radius:11px;cursor:pointer;font-weight:600;margin-bottom:9px;display:flex;align-items:center;justify-content:center;gap:7px">' + DL_SVG + 'Download receipt (PDF)</button>' +
        '<button id="m-again" style="font-family:inherit;font-size:13px;color:#9bd17a;background:transparent;border:1px solid rgba(155,209,122,.3);padding:10px 20px;border-radius:100px;cursor:pointer">Book another day</button></div>';
    } else {
      panel = '<div style="margin-top:18px;text-align:center;color:#73815f;font-size:13px;padding:20px">Tap an available day to reserve your descent.</div>';
    }

    return '<div style="padding:8px 18px 26px">' +
      '<div style="font-family:\'Newsreader\',serif;font-size:26px;padding:8px 2px 4px">Reserve a day</div>' +
      '<div style="font-size:13px;color:#73815f;margin-bottom:18px">' + M.MONTHS[s.month] + ' ' + s.year + '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-bottom:6px">' + M.WEEKDAY_LABELS.map(function (w) { return '<div style="text-align:center;font-family:\'Space Mono\',monospace;font-size:9px;color:#73815f;text-transform:uppercase">' + w + '</div>'; }).join('') + '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px">' + grid + '</div>' + panel + '</div>';
  }

  function guestGallery() {
    return '<div style="padding:8px 18px 26px"><div style="font-family:\'Newsreader\',serif;font-size:26px;padding:8px 2px 16px">The gallery</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' + (M.GALLERY || []).map(function (g, i) {
        return '<div style="position:relative;height:160px;border-radius:16px;overflow:hidden;background:repeating-linear-gradient(125deg,#16201230,#16201230 12px,#1c281830 12px,#1c281830 24px),radial-gradient(70% 60% at ' + (30 + i * 8) + '% 40%,#26371f,#0e150b);border:1px solid rgba(155,209,122,.1)"><div style="position:absolute;left:12px;bottom:10px;font-family:\'Space Mono\',monospace;font-size:9.5px;color:rgba(199,210,188,.72)">' + g.label + '</div></div>';
      }).join('') + '</div></div>';
  }

  function guestTrack() {
    var s = M.state;
    var body;
    if (s.trackSearched && s.trackResults && s.trackResults.length > 0) {
      body = '<div style="display:flex;flex-direction:column;gap:12px">' + s.trackResults.map(function (b, i) {
        return '<div style="background:linear-gradient(135deg,#16210f,#11180e);border:1px solid rgba(155,209,122,.16);border-radius:18px;padding:18px">' +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px"><div><div style="font-family:\'Newsreader\',serif;font-size:21px;line-height:1.1">' + b.dateLabel + '</div><div style="font-size:13px;color:#9aa790;margin-top:2px">' + b.slot + '</div></div><span style="font-family:\'Space Mono\',monospace;font-size:10px;padding:4px 9px;border-radius:6px;color:#9bd17a;background:rgba(155,209,122,.14)">' + b.status + '</span></div>' +
          '<div style="display:flex;justify-content:space-between;padding:12px 0;border-top:1px solid rgba(155,209,122,.1);border-bottom:1px solid rgba(155,209,122,.1);margin-bottom:14px"><div><div style="font-family:\'Space Mono\',monospace;font-size:9.5px;color:#73815f;text-transform:uppercase;letter-spacing:1px">Guest</div><div style="font-size:13.5px;color:#dbe9cd;margin-top:3px">' + b.name + '</div></div><div><div style="font-family:\'Space Mono\',monospace;font-size:9.5px;color:#73815f;text-transform:uppercase;letter-spacing:1px">Party</div><div style="font-size:13.5px;color:#dbe9cd;margin-top:3px">' + b.party + '</div></div><div><div style="font-family:\'Space Mono\',monospace;font-size:9.5px;color:#73815f;text-transform:uppercase;letter-spacing:1px">Ref</div><div style="font-size:12.5px;color:#9bd17a;margin-top:3px;font-family:\'Space Mono\',monospace">' + b.ref + '</div></div><div style="text-align:right"><div style="font-family:\'Space Mono\',monospace;font-size:9.5px;color:#73815f;text-transform:uppercase;letter-spacing:1px">Paid</div><div style="font-family:\'Newsreader\',serif;font-size:20px;color:#bfe89a">$' + b.amount + '</div></div></div>' +
          '<button class="m-dl-receipt" data-i="' + i + '" style="width:100%;font-family:inherit;font-size:13.5px;font-weight:600;color:#0c110b;background:#9bd17a;border:none;padding:12px;border-radius:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px">' + DL_SVG + 'Download receipt (PDF)</button></div>';
      }).join('') + '</div>';
    } else if (s.trackSearched) {
      body = '<div style="text-align:center;padding:24px 14px;color:#9aa790"><div style="width:46px;height:46px;border-radius:50%;border:1px dashed rgba(155,209,122,.3);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:18px">🌫</div><div style="font-size:14.5px;color:#cdd8c2;margin-bottom:4px">No booking found</div><div style="font-size:12.5px;max-width:240px;margin:0 auto">Double-check the number, or try the demo (555) 0148.</div></div>';
    } else {
      body = '<div style="background:#11180e;border:1px dashed rgba(155,209,122,.18);border-radius:16px;padding:26px 18px;text-align:center"><div style="width:46px;height:46px;border-radius:50%;background:rgba(155,209,122,.06);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;animation:float-slow 6s ease-in-out infinite">🌿</div><div style="font-size:13.5px;color:#9aa790;margin-bottom:8px;line-height:1.6">Enter the number you booked with to see your descent and download your receipt.</div><div style="font-family:\'Space Mono\',monospace;font-size:12px;color:#73815f">demo · <span style="color:#9bd17a">(555) 0148</span></div></div>';
    }
    return '<div style="padding:8px 18px 26px"><div style="font-family:\'Newsreader\',serif;font-size:26px;padding:8px 2px 4px">Track booking</div>' +
      '<div style="font-size:13px;color:#73815f;margin-bottom:18px">No account needed — find your reservation by phone.</div>' +
      '<div style="display:flex;gap:9px;margin-bottom:18px"><input id="m-track-phone" value="' + escAttr(s.trackPhone) + '" placeholder="Phone number" style="flex:1;font-family:inherit;font-size:15px;color:#e7ede0;background:rgba(12,17,11,.6);border:1px solid rgba(155,209,122,.16);border-radius:12px;padding:13px 14px;outline:none" /><button id="m-track-find" style="font-family:inherit;font-size:14.5px;font-weight:600;color:#0c110b;background:#9bd17a;border:none;padding:0 22px;border-radius:12px;cursor:pointer">Find</button></div>' +
      body + '</div>';
  }

  // ---------- admin screens (mobile) ----------
  function adminMain() {
    var today = M.dayInfo(2026, 5, 20);
    var all = M.buildBookings();
    var weekRevenue = all.filter(function (b) { return b.off < 7; }).reduce(function (a, b) { return a + b.amount; }, 0);
    var todayCount = all.filter(function (b) { return b.off === 0; }).length;
    var week = M.buildWeekStrip();
    var list = bookingsList();
    var tile = function (cap, body) { return '<div style="background:#11180e;border:1px solid rgba(155,209,122,.1);border-radius:16px;padding:16px"><div style="font-family:\'Space Mono\',monospace;font-size:9.5px;letter-spacing:1px;color:#73815f;text-transform:uppercase;margin-bottom:10px">' + cap + '</div>' + body + '</div>'; };
    return '<div style="padding:8px 18px 26px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 2px 16px"><div><div style="font-family:\'Newsreader\',serif;font-size:24px;line-height:1">Overview</div><div style="font-family:\'Space Mono\',monospace;font-size:10px;color:#73815f">Sat · Jun 20</div></div><div style="display:flex;align-items:center;gap:7px;padding:7px 12px;border-radius:100px;background:rgba(155,209,122,.06);border:1px solid rgba(155,209,122,.12);font-size:12px;color:#9bd17a"><span style="width:6px;height:6px;border-radius:50%;background:#9bd17a;display:inline-block"></span>Open</div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">' +
      tile("Today's guests", '<div style="display:flex;align-items:baseline;gap:5px"><span style="font-family:\'Newsreader\',serif;font-size:30px;color:#dbe9cd">' + today.booked + '</span><span style="font-size:13px;color:#73815f">/ ' + today.quota + '</span></div><div style="height:5px;border-radius:4px;background:rgba(255,255,255,.05);overflow:hidden;margin-top:10px"><div style="height:100%;width:' + today.pct + '%;background:linear-gradient(90deg,#5f8a45,#9bd17a);border-radius:6px"></div></div>') +
      tile('Occupancy', '<div style="font-family:\'Newsreader\',serif;font-size:30px;color:#bfe89a">' + today.pct + '%</div><div style="font-size:11px;color:#73815f;margin-top:6px">' + today.remaining + ' left</div>') +
      tile('Bookings', '<div style="font-family:\'Newsreader\',serif;font-size:30px;color:#dbe9cd">' + todayCount + '</div><div style="font-size:11px;color:#73815f;margin-top:6px">groups today</div>') +
      tile('Revenue 7d', '<div style="font-family:\'Newsreader\',serif;font-size:28px;color:#dbe9cd">$' + weekRevenue.toLocaleString() + '</div><div style="font-size:11px;color:#9bd17a;margin-top:6px">▲ projected</div>') +
      '</div>' +
      '<div style="background:#11180e;border:1px solid rgba(155,209,122,.1);border-radius:16px;padding:18px;margin-bottom:12px"><div style="font-size:14px;color:#dbe9cd;margin-bottom:14px">Capacity · 7 days</div><div style="display:flex;align-items:flex-end;gap:8px;height:90px">' +
      week.map(function (w) { return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%"><div style="flex:1;width:100%;display:flex;align-items:flex-end"><div style="' + w.barStyle + '"></div></div><div style="font-family:\'Space Mono\',monospace;font-size:9px;color:#73815f">' + w.label + '</div></div>'; }).join('') + '</div></div>' +
      '<div style="background:#11180e;border:1px solid rgba(155,209,122,.1);border-radius:16px;padding:16px"><div style="font-size:14px;color:#dbe9cd;margin-bottom:10px">Today\'s bookings</div>' +
      list.slice(0, 4).map(function (b) { return '<div style="display:flex;align-items:center;gap:11px;padding:10px 2px;border-bottom:1px solid rgba(155,209,122,.06)"><div style="width:30px;height:30px;border-radius:50%;background:rgba(155,209,122,.1);display:flex;align-items:center;justify-content:center;font-size:10px;color:#9bd17a;font-family:\'Space Mono\',monospace;flex:none">' + b.initials + '</div><div style="flex:1;min-width:0"><div style="font-size:13.5px;color:#dbe9cd">' + b.name + '</div><div style="font-family:\'Space Mono\',monospace;font-size:10px;color:#73815f">' + b.slot + ' · ' + b.party + '</div></div><div style="font-family:\'Newsreader\',serif;font-size:16px;color:#bfe89a">' + b.amountLabel + '</div></div>'; }).join('') +
      '</div></div>';
  }

  function adminBookings() {
    var list = bookingsList();
    return '<div style="padding:8px 18px 26px"><div style="font-family:\'Newsreader\',serif;font-size:24px;padding:8px 2px 14px">Bookings</div>' +
      '<div style="display:flex;gap:7px;margin-bottom:16px;overflow-x:auto;padding-bottom:4px">' + ['all', 'today', 'confirmed', 'pending'].map(function (f) { return '<button data-filter="' + f + '" style="' + fbtn(f) + '">' + f + '</button>'; }).join('') + '</div>' +
      '<div style="display:flex;flex-direction:column;gap:10px">' + list.map(function (b) {
        return '<div style="background:#11180e;border:1px solid rgba(155,209,122,.1);border-radius:14px;padding:14px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><div style="display:flex;align-items:center;gap:10px"><div style="width:30px;height:30px;border-radius:50%;background:rgba(155,209,122,.1);display:flex;align-items:center;justify-content:center;font-size:10px;color:#9bd17a;font-family:\'Space Mono\',monospace">' + b.initials + '</div><div><div style="font-size:14px;color:#dbe9cd">' + b.name + '</div><div style="font-family:\'Space Mono\',monospace;font-size:10px;color:#9bd17a">' + b.ref + '</div></div></div><span style="' + b.statusStyle + '">' + b.status + '</span></div><div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid rgba(155,209,122,.06)"><span style="font-size:12.5px;color:#9aa790">' + b.dateLabel + ' · ' + b.slot + ' · ' + b.party + '</span><span style="font-family:\'Newsreader\',serif;font-size:17px;color:#bfe89a">' + b.amountLabel + '</span></div></div>';
      }).join('') + '</div></div>';
  }

  function adminPos() {
    var s = M.state;
    var pos = M.posDays();
    var posSel = pos.filter(function (p) { return p.key === s.posDateKey; })[0] || pos[0];
    var posInfo = M.dayInfo.apply(M, M.keyParts(s.posDateKey));
    var posOver = posInfo.remaining < s.posParty;
    var total = '$' + (s.posParty * s.pricePerGuest);
    var head = '<div style="font-family:\'Newsreader\',serif;font-size:24px;padding:8px 2px 4px">Manual booking</div><div style="font-size:12.5px;color:#73815f;margin-bottom:18px">Walk-in at the counter</div>';
    if (s.posDone) {
      return '<div style="padding:8px 18px 26px">' + head + '<div style="background:#11180e;border:1px solid rgba(155,209,122,.18);border-radius:18px;padding:32px 20px;text-align:center"><div style="width:56px;height:56px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#bfe89a,#5f8a45);display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 16px;box-shadow:0 0 30px rgba(155,209,122,.45)">✓</div><div style="font-family:\'Newsreader\',serif;font-size:22px;margin-bottom:6px">Booking recorded</div><div style="font-size:13px;color:#b0bda4;margin-bottom:20px">' + posSel.mon + ' ' + posSel.day + ' · ' + s.posParty + ' guests · ' + total + '</div><button id="m-pos-reset" style="font-family:inherit;font-size:13.5px;color:#0c110b;background:#9bd17a;border:none;padding:12px 24px;border-radius:100px;cursor:pointer;font-weight:600">New walk-in</button></div></div>';
    }
    var chips = pos.map(function (p) {
      var active = p.key === s.posDateKey, dis = p.status === 'full';
      var dot = active ? '#0c110b' : { open: '#9bd17a', limited: '#d9a44e', full: '#a85d59', past: '#3a4632' }[p.status];
      var cs = 'flex:none;width:60px;padding:10px 0;border-radius:12px;text-align:center;cursor:' + (dis ? 'not-allowed' : 'pointer') + ';border:1px solid ' + (active ? '#9bd17a' : 'rgba(155,209,122,.12)') + ';background:' + (active ? '#9bd17a' : dis ? 'rgba(120,60,56,.08)' : 'rgba(155,209,122,.04)') + ';color:' + (active ? '#0c110b' : dis ? '#6e5350' : '#cdd8c2') + ';opacity:' + (dis ? 0.6 : 1);
      return '<div ' + (dis ? '' : 'data-pos-key="' + p.key + '" ') + 'style="' + cs + '"><div style="font-family:\'Space Mono\',monospace;font-size:9px;opacity:.7">' + p.dow + '</div><div style="font-family:\'Newsreader\',serif;font-size:18px;line-height:1.2">' + p.day + '</div><div style="width:5px;height:5px;border-radius:50%;background:' + dot + ';margin:3px auto 0"></div></div>';
    }).join('');
    var btn = 'width:100%;font-family:inherit;font-size:15px;font-weight:600;padding:14px;border-radius:12px;border:none;cursor:' + (posOver ? 'not-allowed' : 'pointer') + ';background:' + (posOver ? 'rgba(120,60,56,.25)' : '#9bd17a') + ';color:' + (posOver ? '#8c6b68' : '#0c110b');
    return '<div style="padding:8px 18px 26px">' + head +
      '<div style="font-size:13px;color:#9aa790;margin-bottom:9px">Guest name</div><input id="m-pos-name" value="' + escAttr(s.posName) + '" placeholder="Walk-in guest" style="width:100%;font-family:inherit;font-size:14px;color:#e7ede0;background:rgba(12,17,11,.6);border:1px solid rgba(155,209,122,.16);border-radius:11px;padding:12px 14px;margin-bottom:18px;outline:none" />' +
      '<div style="font-size:13px;color:#9aa790;margin-bottom:9px">Date</div><div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:18px">' + chips + '</div>' +
      '<div style="font-size:13px;color:#9aa790;margin-bottom:9px">Slot</div><div style="display:flex;gap:8px;margin-bottom:18px"><button data-pos-slot="morning" style="' + slotBtn(s.posSlot === 'morning') + '">Morning</button><button data-pos-slot="afternoon" style="' + slotBtn(s.posSlot === 'afternoon') + '">Afternoon</button></div>' +
      '<div style="font-size:13px;color:#9aa790;margin-bottom:9px">Party size</div><div style="display:flex;align-items:center;justify-content:space-between;background:rgba(155,209,122,.06);border:1px solid rgba(155,209,122,.14);border-radius:11px;padding:8px 12px;margin-bottom:18px"><button data-pos-party="dec" style="width:34px;height:34px;border-radius:8px;background:rgba(12,17,11,.6);border:1px solid rgba(155,209,122,.2);color:#cdd8c2;font-size:18px;cursor:pointer">–</button><span style="font-family:\'Newsreader\',serif;font-size:24px">' + s.posParty + '</span><button data-pos-party="inc" style="width:34px;height:34px;border-radius:8px;background:rgba(12,17,11,.6);border:1px solid rgba(155,209,122,.2);color:#cdd8c2;font-size:18px;cursor:pointer">+</button></div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px;border-radius:12px;background:rgba(155,209,122,.05);border:1px solid rgba(155,209,122,.1);margin-bottom:16px"><div style="font-size:12.5px;color:#9aa790">' + posSel.mon + ' ' + posSel.day + ' · ' + posInfo.remaining + '/' + posInfo.quota + ' left</div><div style="font-family:\'Newsreader\',serif;font-size:24px;color:#bfe89a">' + total + '</div></div>' +
      '<button id="m-pos-complete" style="' + btn + '">' + (posOver ? 'Not enough spots' : 'Complete booking') + '</button></div>';
  }

  function adminSettings() {
    var s = M.state;
    var STEP = 'width:32px;height:32px;border-radius:8px;background:rgba(12,17,11,.6);border:1px solid rgba(155,209,122,.2);color:#cdd8c2;font-size:17px;cursor:pointer';
    var row = function (title, sub, dec, val, inc, top) {
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0' + (top ? ';border-top:1px solid rgba(155,209,122,.08)' : '') + '"><div><div style="font-size:14px;color:#dbe9cd">' + title + '</div><div style="font-size:11.5px;color:#73815f">' + sub + '</div></div><div style="display:flex;align-items:center;gap:11px"><button data-set="' + dec + '" style="' + STEP + '">–</button><span style="font-family:\'Newsreader\',serif;font-size:24px;color:#bfe89a;width:' + (inc === 'incPrice' ? 52 : 42) + 'px;text-align:center">' + val + '</span><button data-set="' + inc + '" style="' + STEP + '">+</button></div></div>';
    };
    return '<div style="padding:8px 18px 26px"><div style="font-family:\'Newsreader\',serif;font-size:24px;padding:8px 2px 4px">Settings</div><div style="font-size:12.5px;color:#73815f;margin-bottom:18px">Daily quota &amp; pricing</div>' +
      '<div style="background:#11180e;border:1px solid rgba(155,209,122,.1);border-radius:16px;padding:18px">' +
      row('Weekday limit', 'Mon – Fri', 'decWeekday', s.weekdayQuota, 'incWeekday', false) +
      row('Weekend limit', 'Sat – Sun', 'decWeekend', s.weekendQuota, 'incWeekend', true) +
      row('Price / guest', 'USD', 'decPrice', '$' + s.pricePerGuest, 'incPrice', true) +
      '</div><div style="font-size:11.5px;color:#73815f;margin-top:14px;font-family:\'Space Mono\',monospace;line-height:1.6;padding:0 2px">Changes apply instantly to the public booking calendar.</div></div>';
  }

  var SET = {
    decWeekday: function (s) { return { weekdayQuota: Math.max(10, s.weekdayQuota - 5) }; },
    incWeekday: function (s) { return { weekdayQuota: Math.min(200, s.weekdayQuota + 5) }; },
    decWeekend: function (s) { return { weekendQuota: Math.max(10, s.weekendQuota - 5) }; },
    incWeekend: function (s) { return { weekendQuota: Math.min(200, s.weekendQuota + 5) }; },
    decPrice: function (s) { return { pricePerGuest: Math.max(2, s.pricePerGuest - 2) }; },
    incPrice: function (s) { return { pricePerGuest: Math.min(200, s.pricePerGuest + 2) }; }
  };

  // ---------- navs ----------
  function navIcon(name, active) {
    var stroke = active ? '#9bd17a' : '#5f7a4d';
    var paths = {
      home: '<path d="M4 11 L12 4 L20 11"></path><rect x="6" y="11" width="12" height="9" rx="1.5"></rect>',
      book: '<rect x="4" y="5" width="16" height="16" rx="2.5"></rect><line x1="4" y1="9" x2="20" y2="9"></line><line x1="8" y1="3" x2="8" y2="6"></line><line x1="16" y1="3" x2="16" y2="6"></line>',
      gallery: '<rect x="4" y="5" width="16" height="14" rx="2.5"></rect><circle cx="9" cy="10" r="1.4"></circle><path d="M5 17 L10 13 L14 16 L18 12 L20 14"></path>',
      profile: '<circle cx="10.5" cy="10.5" r="6.5"></circle><line x1="15.5" y1="15.5" x2="20" y2="20"></line>',
      main: '<rect x="4" y="4" width="7" height="7" rx="1.5"></rect><rect x="13" y="4" width="7" height="7" rx="1.5"></rect><rect x="4" y="13" width="7" height="7" rx="1.5"></rect><rect x="13" y="13" width="7" height="7" rx="1.5"></rect>',
      bookings: '<line x1="8" y1="6" x2="20" y2="6"></line><line x1="8" y1="12" x2="20" y2="12"></line><line x1="8" y1="18" x2="20" y2="18"></line><circle cx="4" cy="6" r="1.1"></circle><circle cx="4" cy="12" r="1.1"></circle><circle cx="4" cy="18" r="1.1"></circle>',
      pos: '<circle cx="12" cy="12" r="8.5"></circle><line x1="12" y1="8.5" x2="12" y2="15.5"></line><line x1="8.5" y1="12" x2="15.5" y2="12"></line>',
      settings: '<line x1="4" y1="8" x2="20" y2="8"></line><circle cx="15" cy="8" r="2.4" fill="#0c110b"></circle><line x1="4" y1="16" x2="20" y2="16"></line><circle cx="9" cy="16" r="2.4" fill="#0c110b"></circle>'
    };
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="' + stroke + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + paths[name] + '</svg>';
  }
  function navCell(attr, key, active, icon, label) {
    var st = 'flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;color:' + (active ? '#9bd17a' : '#5f7a4d');
    return '<div data-' + attr + '="' + key + '" style="' + st + '">' + navIcon(icon, active) + '<span style="font-size:10px">' + label + '</span></div>';
  }
  function bottomNav() {
    var wrap = 'display:flex;padding:12px 14px 24px;border-top:1px solid rgba(155,209,122,.1);background:rgba(8,11,7,.85);backdrop-filter:blur(10px)';
    if (M.state.mobileApp === 'guest') {
      var t = M.state.mobileTab;
      return '<div style="' + wrap + '">' + navCell('mtab', 'home', t === 'home', 'home', 'Home') + navCell('mtab', 'book', t === 'book', 'book', 'Book') + navCell('mtab', 'gallery', t === 'gallery', 'gallery', 'Gallery') + navCell('mtab', 'profile', t === 'profile', 'profile', 'Track') + '</div>';
    }
    var a = M.state.mAdminTab;
    return '<div style="' + wrap + '">' + navCell('matab', 'main', a === 'main', 'main', 'Main') + navCell('matab', 'bookings', a === 'bookings', 'bookings', 'Bookings') + navCell('matab', 'pos', a === 'pos', 'pos', 'POS') + navCell('matab', 'settings', a === 'settings', 'settings', 'Settings') + '</div>';
  }

  function screen() {
    if (M.state.mobileApp === 'guest') {
      switch (M.state.mobileTab) {
        case 'book': return guestBook();
        case 'gallery': return guestGallery();
        case 'profile': return guestTrack();
        default: return guestHome();
      }
    }
    switch (M.state.mAdminTab) {
      case 'bookings': return adminBookings();
      case 'pos': return adminPos();
      case 'settings': return adminSettings();
      default: return adminMain();
    }
  }

  function appToggle(active) {
    return 'flex:1;font-family:inherit;font-size:13px;padding:9px 0;border-radius:100px;border:none;cursor:pointer;' + (active ? 'background:#9bd17a;color:#0c110b;font-weight:600;' : 'background:transparent;color:#8c9a80;');
  }

  function shellHTML() {
    var guest = M.state.mobileApp === 'guest';
    return '<div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;position:relative;background:radial-gradient(80% 60% at 50% 30%,#15200f,#0a0f08)">' +
      '<div style="position:absolute;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(155,209,122,.14),transparent 70%);filter:blur(20px);animation:glow-pulse 6s ease-in-out infinite"></div>' +
      '<div style="position:relative;z-index:5;display:flex;gap:4px;padding:5px;background:rgba(18,24,15,.92);border:1px solid rgba(155,209,122,.2);border-radius:100px;margin-bottom:22px;width:300px;box-shadow:0 10px 30px rgba(0,0,0,.4)">' +
      '<button data-app="guest" style="' + appToggle(guest) + '">Guest app</button><button data-app="admin" style="' + appToggle(!guest) + '">Admin app</button></div>' +
      '<div style="position:relative;width:390px;max-width:100%;height:812px;background:#05080a;border-radius:52px;padding:11px;box-shadow:0 40px 100px rgba(0,0,0,.7),0 0 0 2px rgba(155,209,122,.14),inset 0 0 0 2px rgba(0,0,0,.6)">' +
      '<div style="position:relative;width:100%;height:100%;background:#0c110b;border-radius:42px;overflow:hidden;display:flex;flex-direction:column">' +
      '<div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:150px;height:30px;background:#05080a;border-radius:0 0 18px 18px;z-index:30"></div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 26px 6px;font-size:13px;font-weight:600;color:#dbe9cd;z-index:20"><span>9:41</span><span style="display:flex;gap:5px;align-items:center;font-size:11px;font-family:\'Space Mono\',monospace">●●● ▮</span></div>' +
      '<div style="flex:1;overflow-y:auto;overflow-x:hidden">' + screen() + '</div>' +
      bottomNav() + '</div></div>' +
      '<div style="margin-top:22px;font-family:\'Space Mono\',monospace;font-size:11px;color:#5f7a4d;letter-spacing:1px">switch guest / admin above · tap the bottom nav</div></div>';
  }

  function wire(root) {
    root.querySelectorAll('[data-app]').forEach(function (el) { el.addEventListener('click', function () { M.setState({ mobileApp: this.getAttribute('data-app') }); }); });
    root.querySelectorAll('[data-mtab]').forEach(function (el) { el.addEventListener('click', function () { M.setState({ mobileTab: this.getAttribute('data-mtab') }); }); });
    root.querySelectorAll('[data-matab]').forEach(function (el) { el.addEventListener('click', function () { M.setState({ mAdminTab: this.getAttribute('data-matab') }); }); });
    root.querySelectorAll('[data-key]').forEach(function (el) { el.addEventListener('click', function () { M.setState({ selectedKey: this.getAttribute('data-key'), bookingStep: 1 }); }); });
    root.querySelectorAll('[data-slot]').forEach(function (el) { el.addEventListener('click', function () { M.setState({ slot: this.getAttribute('data-slot') }); }); });
    var dec = root.querySelector('[data-party="dec"]'); if (dec) dec.addEventListener('click', function () { M.setState(function (s) { return { partySize: Math.max(1, s.partySize - 1) }; }); });
    var inc = root.querySelector('[data-party="inc"]'); if (inc) inc.addEventListener('click', function () { M.setState(function (s) { return { partySize: Math.min(8, s.partySize + 1) }; }); });
    var nm = root.querySelector('#m-name'); if (nm) nm.addEventListener('input', function () { M.set({ guestName: this.value }); });
    var ph = root.querySelector('#m-phone'); if (ph) ph.addEventListener('input', function () { M.set({ guestPhone: this.value }); patchBook(root); });
    var cf = root.querySelector('#m-confirm'); if (cf) cf.addEventListener('click', function () { if (!gate().disabled) confirmBooking(); });
    var dl = root.querySelector('#m-dl'); if (dl) dl.addEventListener('click', function () { if (M.state.lastBooking) M.downloadReceipt(M.state.lastBooking); });
    var ag = root.querySelector('#m-again'); if (ag) ag.addEventListener('click', function () { M.setState({ selectedKey: null, bookingStep: 1, partySize: 2, slot: 'morning', guestName: '', guestPhone: '', lastBooking: null }); });
    // track
    var tp = root.querySelector('#m-track-phone'); if (tp) { tp.addEventListener('input', function () { M.set({ trackPhone: this.value }); }); tp.addEventListener('keydown', function (e) { if (e.key === 'Enter') findTrack(); }); }
    var tf = root.querySelector('#m-track-find'); if (tf) tf.addEventListener('click', findTrack);
    root.querySelectorAll('.m-dl-receipt').forEach(function (b) { b.addEventListener('click', function () { var rec = (M.state.trackResults || [])[+this.getAttribute('data-i')]; if (rec) M.downloadReceipt(rec); }); });
    // admin
    root.querySelectorAll('[data-filter]').forEach(function (el) { el.addEventListener('click', function () { M.setState({ bookingFilter: this.getAttribute('data-filter') }); }); });
    root.querySelectorAll('[data-set]').forEach(function (el) { el.addEventListener('click', function () { M.setState(SET[this.getAttribute('data-set')]); }); });
    root.querySelectorAll('[data-pos-key]').forEach(function (el) { el.addEventListener('click', function () { M.setState({ posDateKey: this.getAttribute('data-pos-key'), posDone: false }); }); });
    root.querySelectorAll('[data-pos-slot]').forEach(function (el) { el.addEventListener('click', function () { M.setState({ posSlot: this.getAttribute('data-pos-slot') }); }); });
    var pd = root.querySelector('[data-pos-party="dec"]'); if (pd) pd.addEventListener('click', function () { M.setState(function (s) { return { posParty: Math.max(1, s.posParty - 1) }; }); });
    var pi = root.querySelector('[data-pos-party="inc"]'); if (pi) pi.addEventListener('click', function () { M.setState(function (s) { return { posParty: Math.min(8, s.posParty + 1) }; }); });
    var pn = root.querySelector('#m-pos-name'); if (pn) pn.addEventListener('input', function () { M.set({ posName: this.value }); });
    var pc = root.querySelector('#m-pos-complete'); if (pc) pc.addEventListener('click', function () {
      var info = M.dayInfo.apply(M, M.keyParts(M.state.posDateKey));
      if (info.remaining < M.state.posParty) return;
      M.setState(function (s) { var ov = Object.assign({}, s.overrides); ov[s.posDateKey] = (ov[s.posDateKey] || 0) + s.posParty; return { overrides: ov, posDone: true }; });
    });
    var pr = root.querySelector('#m-pos-reset'); if (pr) pr.addEventListener('click', function () { M.setState({ posDone: false, posName: '', posParty: 2, posSlot: 'morning' }); });
  }

  function patchBook(root) {
    var g = gate();
    var btn = root.querySelector('#m-confirm');
    if (btn) { btn.setAttribute('style', g.style); btn.textContent = g.label; }
    var total = root.querySelector('#m-total');
    if (total && M.state.selectedKey) total.textContent = '$' + (M.state.partySize * M.state.pricePerGuest);
  }

  M.mobile = {
    render: function () {
      var root = document.getElementById('surface-mobile');
      if (!root) return;
      root.innerHTML = shellHTML();
      wire(root);
    }
  };

})(window.MossCave);
