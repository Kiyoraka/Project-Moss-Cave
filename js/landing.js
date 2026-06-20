/* ===== Moss Cave — Landing surface: hero, gallery, booking flow ===== */
window.MossCave = window.MossCave || {};
(function (M) {
  'use strict';

  // ---------- shared style helpers ----------
  function slotBtn(active) {
    return 'flex:1;font-family:inherit;font-size:12.5px;padding:11px 8px;border-radius:10px;cursor:pointer;transition:all .2s;border:1px solid rgba(155,209,122,' + (active ? 0.45 : 0.14) + ');background:' + (active ? 'rgba(155,209,122,.14)' : 'rgba(12,17,11,.4)') + ';color:' + (active ? '#bfe89a' : '#9aa790') + ';font-weight:' + (active ? 600 : 400);
  }
  var STEP_BTN = 'width:36px;height:36px;border-radius:9px;background:rgba(12,17,11,.6);border:1px solid rgba(155,209,122,.2);color:#cdd8c2;font-size:20px;cursor:pointer';
  var INPUT_STYLE = 'width:100%;font-family:inherit;font-size:14px;color:#e7ede0;background:rgba(12,17,11,.6);border:1px solid rgba(155,209,122,.16);border-radius:11px;padding:12px 14px;outline:none';

  function confirmGate() {
    var sel = M.state.selectedKey ? M.dayInfo.apply(M, M.keyParts(M.state.selectedKey)) : null;
    var full = sel && sel.remaining < M.state.partySize;
    var needPhone = !(M.state.guestPhone && M.state.guestPhone.replace(/\D/g, '').length >= 6);
    var disabled = full || needPhone;
    return {
      disabled: disabled,
      label: full ? 'Not enough spots' : needPhone ? 'Enter phone to confirm' : 'Confirm reservation',
      style: 'font-family:inherit;font-size:15px;font-weight:600;padding:15px;border-radius:12px;border:none;cursor:' + (disabled ? 'not-allowed' : 'pointer') + ';width:100%;transition:all .25s;background:' + (disabled ? 'rgba(155,209,122,.2)' : '#9bd17a') + ';color:' + (disabled ? '#6f8a58' : '#0c110b') + ';box-shadow:' + (disabled ? 'none' : '0 0 26px rgba(155,209,122,.32)')
    };
  }

  // ---------- actions ----------
  function scrollTo(id) {
    var el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' });
  }
  function selectDay(key) { M.setState({ selectedKey: key, bookingStep: 1 }); }
  function confirmBooking() {
    var key = M.state.selectedKey; if (!key) return;
    var info = M.dayInfo.apply(M, M.keyParts(key));
    var ref = 'NC-' + (1000 + Math.floor(Math.random() * 8999));
    var dateLabel = M.MONTHS[info.date.getMonth()] + ' ' + info.date.getDate() + ', ' + info.date.getFullYear();
    var slot = M.state.slot === 'morning' ? 'Morning · 09:30' : 'Afternoon · 14:00';
    var digits = (M.state.guestPhone || '').replace(/\D/g, '');
    var rec = {
      ref: ref, dateKey: key, dateLabel: dateLabel, slot: slot, party: M.state.partySize,
      amount: M.state.partySize * M.state.pricePerGuest,
      name: M.state.guestName || 'Guest', phone: M.state.guestPhone || '—', status: 'Confirmed'
    };
    M.setState(function (s) {
      var mb = Object.assign({}, s.myBookings);
      if (digits) mb[digits] = (mb[digits] || []).concat([rec]);
      var ov = Object.assign({}, s.overrides); ov[key] = (ov[key] || 0) + s.partySize;
      return { overrides: ov, bookingStep: 2, lastBooking: rec, myBookings: mb };
    });
  }
  function resetBooking() {
    M.setState({ selectedKey: null, bookingStep: 1, partySize: 2, slot: 'morning', guestName: '', guestPhone: '', lastBooking: null });
  }

  // ---------- hero ----------
  var DOWNLOAD_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0c110b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 v12"></path><path d="M7 11 l5 5 l5 -5"></path><path d="M5 20 h14"></path></svg>';

  function heroHTML() {
    var v = M.state.heroVariant;
    if (v === 'b') {
      return '<div style="width:100%;max-width:1240px;margin:0 auto;padding:0 44px;display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center" class="about-grid">' +
        '<div>' +
        '<div class="reveal" style="font-family:\'Space Mono\',monospace;font-size:12.5px;letter-spacing:4px;color:#9bd17a;text-transform:uppercase;margin-bottom:22px">Est. in the deep</div>' +
        '<h1 class="reveal" style="font-family:\'Newsreader\',serif;font-weight:300;font-size:clamp(44px,6vw,86px);line-height:1;letter-spacing:-1px;margin-bottom:22px">A cave that<br>breathes <em style="font-style:italic;color:#bfe89a">green</em></h1>' +
        '<p class="reveal" style="max-width:440px;margin:0 0 36px;color:#b0bda4;font-size:18px">Step off the trail and into the hush. Glowing moss walls, mineral pools and cool stone — open to a handful of guests each day.</p>' +
        '<div class="reveal" style="display:flex;gap:14px">' +
        '<button class="btn-accent" data-scroll="book" style="font-size:15px;padding:15px 30px;box-shadow:0 0 30px rgba(155,209,122,.35)">Check availability</button>' +
        '<button data-scroll="gallery" style="font-family:inherit;font-size:15px;color:#e7ede0;background:transparent;border:1px solid rgba(183,196,171,.32);padding:15px 28px;border-radius:100px;cursor:pointer">Gallery</button>' +
        '</div></div>' +
        '<div class="reveal" style="height:520px;border-radius:14px;overflow:hidden;position:relative;background:repeating-linear-gradient(125deg,#18221330,#18221330 14px,#1e2a1a30 14px,#1e2a1a30 28px),radial-gradient(80% 70% at 60% 30%,#2a3c22,#10170d);border:1px solid rgba(155,209,122,.16);animation:float-slow 7s ease-in-out infinite">' +
        '<div style="position:absolute;inset:0;display:flex;align-items:flex-end;padding:18px"><span class="img-tag">[ hero image · cave mouth, low light ]</span></div></div></div>';
    }
    if (v === 'c') {
      return '<div style="width:100%;max-width:1280px;margin:0 auto;padding:0 44px">' +
        '<div class="reveal" style="font-family:\'Space Mono\',monospace;font-size:12.5px;letter-spacing:4px;color:#9bd17a;text-transform:uppercase;margin-bottom:18px;display:flex;justify-content:space-between"><span>Nature — booking</span><span>48.21°N / cool / 11°C</span></div>' +
        '<h1 class="reveal" style="font-family:\'Newsreader\',serif;font-weight:300;font-size:clamp(56px,13vw,190px);line-height:.86;letter-spacing:-3px;margin-bottom:8px">THE<br><em style="font-style:italic;color:#bfe89a">MOSS</em> CAVE</h1>' +
        '<div class="reveal" style="display:flex;justify-content:space-between;align-items:flex-end;gap:40px;margin-top:24px">' +
        '<p style="max-width:420px;color:#b0bda4;font-size:18px">A living underground room of light-drinking moss. Slow tours, small numbers, booked one day at a time.</p>' +
        '<button class="btn-accent" data-scroll="book" style="font-size:15px;padding:15px 32px;white-space:nowrap;box-shadow:0 0 30px rgba(155,209,122,.35)">Reserve a day</button>' +
        '</div></div>';
    }
    // variant A (default)
    return '<div style="width:100%;max-width:1000px;margin:0 auto;padding:0 32px;text-align:center">' +
      '<div class="reveal" style="font-family:\'Space Mono\',monospace;font-size:12.5px;letter-spacing:4px;color:#9bd17a;text-transform:uppercase;margin-bottom:26px">An underground sanctuary</div>' +
      '<h1 class="reveal" style="font-family:\'Newsreader\',serif;font-weight:300;font-size:clamp(48px,8vw,108px);line-height:.98;letter-spacing:-1px;margin-bottom:24px">Where moss meets<br><em style="font-style:italic;color:#bfe89a">ancient stone</em></h1>' +
      '<p class="reveal" style="max-width:540px;margin:0 auto 40px;color:#b0bda4;font-size:18px;line-height:1.6">Descend into a living cave of glowing moss, still water and cool air. A slow, quiet escape — booked by the day, limited by nature.</p>' +
      '<div class="reveal" style="display:flex;gap:14px;justify-content:center">' +
      '<button class="btn-accent" data-scroll="book" style="font-size:15px;padding:15px 30px;box-shadow:0 0 30px rgba(155,209,122,.35)">Check availability</button>' +
      '<button data-scroll="gallery" style="font-family:inherit;font-size:15px;color:#e7ede0;background:transparent;border:1px solid rgba(183,196,171,.32);padding:15px 28px;border-radius:100px;cursor:pointer">Explore the cave</button>' +
      '</div></div>';
  }

  function renderHero() {
    var el = document.getElementById('hero-content');
    if (!el) return;
    el.innerHTML = heroHTML();
    el.querySelectorAll('[data-scroll]').forEach(function (b) {
      b.addEventListener('click', function () { scrollTo(this.getAttribute('data-scroll') === 'book' ? 'book-anchor' : 'gallery-anchor'); });
    });
    syncHeroButtons();
    if (M.refreshReveal) M.refreshReveal();
  }

  function syncHeroButtons() {
    document.querySelectorAll('.hv-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-hero') === M.state.heroVariant);
    });
  }

  // ---------- gallery ----------
  var GALLERY = [
    { label: 'cave entrance · dawn', no: '01', span: 'grid-column:span 2;grid-row:span 2' },
    { label: 'moss wall · detail', no: '02', span: '' },
    { label: 'mineral pool', no: '03', span: '' },
    { label: 'glow chamber', no: '04', span: 'grid-column:span 2' },
    { label: 'narrow passage', no: '05', span: '' },
    { label: 'the deep room', no: '06', span: '' }
  ];
  M.GALLERY = GALLERY;

  function renderGallery() {
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;
    grid.innerHTML = GALLERY.map(function (g, i) {
      var style = g.span + ';position:relative;border-radius:12px;overflow:hidden;cursor:pointer;background:repeating-linear-gradient(125deg,#16201230,#16201230 12px,#1c281830 12px,#1c281830 24px),radial-gradient(70% 60% at ' + (30 + i * 8) + '% 40%,#26371f,#0e150b);border:1px solid rgba(155,209,122,.1);transition:transform .4s;animation-delay:' + (i * 0.06) + 's';
      return '<div class="reveal gallery-item" style="' + style + '">' +
        '<div class="gal-glow" style="position:absolute;inset:0;background:radial-gradient(60% 60% at 50% 40%,rgba(155,209,122,.12),transparent 70%);opacity:0;transition:opacity .4s"></div>' +
        '<div style="position:absolute;left:14px;bottom:12px;font-family:\'Space Mono\',monospace;font-size:10.5px;letter-spacing:1px;color:rgba(199,210,188,.72)">' + g.label + '</div>' +
        '<div style="position:absolute;right:14px;top:12px;font-family:\'Space Mono\',monospace;font-size:10px;color:rgba(155,209,122,.5)">' + g.no + '</div>' +
        '</div>';
    }).join('');
    if (M.refreshReveal) M.refreshReveal();
  }

  // ---------- calendar ----------
  function renderCalendar() {
    var label = document.getElementById('month-label');
    if (label) label.textContent = M.MONTHS[M.state.month] + ' ' + M.state.year;
    var grid = document.getElementById('cal-grid');
    if (!grid) return;
    var days = M.buildDays();
    grid.innerHTML = days.map(function (d) {
      if (d.blank) return '<div style="' + d.cellStyle + '"></div>';
      return '<div ' + (d.clickable ? 'data-key="' + d.key + '" ' : '') + 'style="' + d.cellStyle + '">' +
        '<div style="font-size:15px;font-weight:500;line-height:1">' + d.day + '</div>' +
        '<div style="' + d.dotStyle + '"></div></div>';
    }).join('');
    grid.querySelectorAll('[data-key]').forEach(function (cell) {
      cell.addEventListener('click', function () { selectDay(this.getAttribute('data-key')); });
    });
  }

  // ---------- booking panel ----------
  function bookPanelHTML() {
    var s = M.state;
    if (!s.selectedKey) {
      return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#73815f">' +
        '<div style="width:54px;height:54px;border-radius:50%;border:1px dashed rgba(155,209,122,.3);display:flex;align-items:center;justify-content:center;margin-bottom:18px;animation:float-slow 6s ease-in-out infinite">🌿</div>' +
        '<div style="font-family:\'Newsreader\',serif;font-size:21px;color:#cdd8c2;margin-bottom:6px">Choose a day</div>' +
        '<div style="font-size:14px;max-width:220px">Select an available date on the calendar to begin your reservation.</div></div>';
    }
    var sel = M.selView(s.selectedKey, s.partySize);
    if (s.bookingStep === 2) {
      var slotLabel = s.slot === 'morning' ? 'Morning · 09:30' : 'Afternoon · 14:00';
      var ref = s.lastBooking ? s.lastBooking.ref : '';
      return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">' +
        '<div style="width:64px;height:64px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#bfe89a,#5f8a45);display:flex;align-items:center;justify-content:center;font-size:30px;margin-bottom:20px;box-shadow:0 0 36px rgba(155,209,122,.45);animation:breathe 3s ease-in-out infinite">✓</div>' +
        '<div style="font-family:\'Newsreader\',serif;font-size:26px;margin-bottom:6px">You\'re booked in</div>' +
        '<div style="font-size:14.5px;color:#b0bda4;max-width:250px;margin-bottom:8px">' + sel.dateLabel + ' · ' + slotLabel + ' · ' + s.partySize + ' guests</div>' +
        '<div style="font-family:\'Space Mono\',monospace;font-size:12px;color:#9bd17a;letter-spacing:1px;margin-bottom:22px">Ref ' + ref + '</div>' +
        '<button id="dl-last" class="btn-accent" style="font-size:14px;padding:13px 24px;margin-bottom:10px;display:flex;align-items:center;gap:8px">' + DOWNLOAD_SVG + 'Download receipt (PDF)</button>' +
        '<button id="book-another" style="font-family:inherit;font-size:14px;color:#9bd17a;background:transparent;border:1px solid rgba(155,209,122,.3);padding:11px 22px;border-radius:100px;cursor:pointer">Book another day</button></div>';
    }
    // step 1 — choosing
    var ss = s.slot;
    var gate = confirmGate();
    var price = M.state.pricePerGuest;
    return '<div style="flex:1;display:flex;flex-direction:column">' +
      '<div style="font-family:\'Space Mono\',monospace;font-size:11px;letter-spacing:2px;color:#9bd17a;text-transform:uppercase;margin-bottom:6px">Selected day</div>' +
      '<div style="font-family:\'Newsreader\',serif;font-size:28px;line-height:1.05;margin-bottom:4px">' + sel.dateLabel + '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:22px"><span style="' + sel.badgeStyle + '">' + sel.statusText + '</span>' +
      '<span style="font-size:13px;color:#8c9a80;font-family:\'Space Mono\',monospace">' + sel.remaining + ' of ' + sel.quota + ' spots left</span></div>' +
      '<div style="height:8px;border-radius:6px;background:rgba(255,255,255,.06);overflow:hidden;margin-bottom:26px"><div style="' + sel.barStyle + '"></div></div>' +
      '<div style="font-size:13px;color:#9aa790;margin-bottom:10px">Time of descent</div>' +
      '<div style="display:flex;gap:8px;margin-bottom:22px">' +
      '<button data-slot="morning" style="' + slotBtn(ss === 'morning') + '">Morning · 09:30</button>' +
      '<button data-slot="afternoon" style="' + slotBtn(ss === 'afternoon') + '">Afternoon · 14:00</button></div>' +
      '<div style="font-size:13px;color:#9aa790;margin-bottom:10px">Party size</div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;background:rgba(155,209,122,.06);border:1px solid rgba(155,209,122,.14);border-radius:12px;padding:10px 14px;margin-bottom:18px">' +
      '<button data-party="dec" style="' + STEP_BTN + '">–</button>' +
      '<div style="text-align:center"><div style="font-family:\'Newsreader\',serif;font-size:30px;line-height:1">' + s.partySize + '</div><div style="font-size:11px;color:#8c9a80;font-family:\'Space Mono\',monospace">guests</div></div>' +
      '<button data-party="inc" style="' + STEP_BTN + '">+</button></div>' +
      '<div style="font-size:13px;color:#9aa790;margin-bottom:10px">Your details</div>' +
      '<input id="guest-name" value="' + escAttr(s.guestName) + '" placeholder="Name (optional)" style="' + INPUT_STYLE + ';margin-bottom:9px" />' +
      '<input id="guest-phone" value="' + escAttr(s.guestPhone) + '" placeholder="Phone number" style="' + INPUT_STYLE + '" />' +
      '<div style="font-size:11px;color:#73815f;margin-top:8px;font-family:\'Space Mono\',monospace;line-height:1.5">No account needed — we\'ll use your number to look up the booking later.</div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin:22px 0 16px"><span style="color:#8c9a80;font-size:14px">' + s.partySize + ' × $' + price + '</span>' +
      '<span id="book-total" style="font-family:\'Newsreader\',serif;font-size:26px;color:#bfe89a">' + sel.total + '</span></div>' +
      '<button id="confirm-btn" style="' + gate.style + '">' + gate.label + '</button></div>';
  }

  function escAttr(v) { return String(v || '').replace(/"/g, '&quot;'); }

  function renderBookPanel() {
    var panel = document.getElementById('book-panel');
    if (!panel) return;
    panel.innerHTML = bookPanelHTML();

    panel.querySelectorAll('[data-slot]').forEach(function (b) {
      b.addEventListener('click', function () { M.setState({ slot: this.getAttribute('data-slot') }); });
    });
    var dec = panel.querySelector('[data-party="dec"]');
    var inc = panel.querySelector('[data-party="inc"]');
    if (dec) dec.addEventListener('click', function () { M.setState(function (s) { return { partySize: Math.max(1, s.partySize - 1) }; }); });
    if (inc) inc.addEventListener('click', function () { M.setState(function (s) { return { partySize: Math.min(8, s.partySize + 1) }; }); });

    var nameI = panel.querySelector('#guest-name');
    var phoneI = panel.querySelector('#guest-phone');
    if (nameI) nameI.addEventListener('input', function () { M.set({ guestName: this.value }); });
    if (phoneI) phoneI.addEventListener('input', function () { M.set({ guestPhone: this.value }); patchControls(); });

    var confirm = panel.querySelector('#confirm-btn');
    if (confirm) confirm.addEventListener('click', function () { if (!confirmGate().disabled) confirmBooking(); });

    var dl = panel.querySelector('#dl-last');
    if (dl) dl.addEventListener('click', function () { if (M.state.lastBooking) M.downloadReceipt(M.state.lastBooking); });
    var again = panel.querySelector('#book-another');
    if (again) again.addEventListener('click', resetBooking);
  }

  // update confirm button + total in place (called on phone input — no re-render, keeps focus)
  function patchControls() {
    var panel = document.getElementById('book-panel');
    if (!panel) return;
    var gate = confirmGate();
    var btn = panel.querySelector('#confirm-btn');
    if (btn) { btn.setAttribute('style', gate.style); btn.textContent = gate.label; }
    var total = panel.querySelector('#book-total');
    if (total && M.state.selectedKey) total.textContent = '$' + (M.state.partySize * M.state.pricePerGuest);
  }

  // ---------- wiring ----------
  M.landing = {
    init: function () {
      // static hooks
      document.querySelectorAll('.nav-book').forEach(function (n) { n.addEventListener('click', function () { scrollTo('book-anchor'); }); });
      document.querySelectorAll('.nav-track').forEach(function (n) { n.addEventListener('click', function () { M.track.open(); }); });
      document.querySelectorAll('.hv-btn').forEach(function (b) {
        b.addEventListener('click', function () { M.set({ heroVariant: this.getAttribute('data-hero') }); renderHero(); });
      });
      var prev = document.getElementById('cal-prev');
      var next = document.getElementById('cal-next');
      if (prev) prev.addEventListener('click', function () { M.setState(function (s) { var m = s.month - 1, y = s.year; if (m < 0) { m = 11; y--; } return { month: m, year: y }; }); });
      if (next) next.addEventListener('click', function () { M.setState(function (s) { var m = s.month + 1, y = s.year; if (m > 11) { m = 0; y++; } return { month: m, year: y }; }); });
      // first paint
      renderHero();
      renderGallery();
      renderCalendar();
      renderBookPanel();
    },
    // re-render dynamic regions on state change (hero handled separately to keep its reveal)
    rerender: function () {
      renderCalendar();
      renderBookPanel();
      syncHeroButtons();
    }
  };

})(window.MossCave);
