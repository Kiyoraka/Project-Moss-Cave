/* ===== Moss Cave — state store + localStorage persistence ===== */
window.MossCave = window.MossCave || {};
(function (M) {
  'use strict';

  var LS_KEY = 'mosscave.v1';

  // Seed demo reservation so phone-lookup works out of the box: (555) 0148
  function seedBooking() {
    return {
      ref: 'NC-2048', dateKey: '2026-06-22', dateLabel: 'June 22, 2026',
      slot: 'Morning · 09:30', party: 2, amount: 96,
      name: 'Wren Ash', phone: '(555) 0148', status: 'Confirmed'
    };
  }

  // ----- constants (shared across modules) -----
  M.MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  M.WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  M.NAMES = ['Lena Brook', 'Cole Fenn', 'Ivy Marsh', 'Theo Vale', 'Wren Ash', 'Otto Glenn',
    'Maya Fern', 'Rhea Stone', 'Soren Birch', 'Nina Frost', 'Cy Holloway', 'Pim Larch',
    'Edda Wynn', 'Jules Reed', 'Marlow Pike', 'Saga Linden'];

  // "today" is pinned to the design's reference date so deterministic data matches
  M.TODAY = { y: 2026, m: 5, d: 20 };

  // ----- load persisted slice -----
  function loadPersisted() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  var saved = loadPersisted() || {};

  var myBookings = saved.myBookings && typeof saved.myBookings === 'object' ? saved.myBookings : {};
  if (!myBookings['5550148']) myBookings['5550148'] = [seedBooking()];

  // ----- live application state (only the persisted keys survive reload) -----
  M.state = {
    view: 'landing',
    heroVariant: 'a',
    year: 2026, month: 5,
    selectedKey: null,
    partySize: 2,
    slot: 'morning',
    bookingStep: 1,                 // 1 = choosing, 2 = done
    overrides: saved.overrides && typeof saved.overrides === 'object' ? saved.overrides : {},
    weekdayQuota: saved.weekdayQuota || 60,
    weekendQuota: saved.weekendQuota || 90,
    pricePerGuest: saved.pricePerGuest || 48,
    adminTab: 'main',
    mobileTab: 'home',
    mobileApp: 'guest',
    mAdminTab: 'main',
    posName: '', posDateKey: '2026-06-20', posParty: 2, posSlot: 'morning', posDone: false,
    bookingFilter: 'all',
    guestName: '', guestPhone: '', lastBooking: null,
    myBookings: myBookings,
    trackOpen: false, trackPhone: '', trackResults: null, trackSearched: false
  };

  // ----- persistence: only the data that should outlive a reload -----
  M.persist = function () {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        overrides: M.state.overrides,
        myBookings: M.state.myBookings,
        weekdayQuota: M.state.weekdayQuota,
        weekendQuota: M.state.weekendQuota,
        pricePerGuest: M.state.pricePerGuest
      }));
    } catch (e) { /* storage unavailable — stay in-memory */ }
  };

  // ----- state mutation -----
  // setState: merge + persist + re-render the visible surface's dynamic regions.
  M.setState = function (patch) {
    var p = (typeof patch === 'function') ? patch(M.state) : patch;
    Object.assign(M.state, p);
    M.persist();
    if (typeof M.rerender === 'function') M.rerender();
  };

  // set: silent merge (no re-render) — used by text inputs so they keep focus.
  M.set = function (patch) {
    Object.assign(M.state, patch);
    M.persist();
  };

  // ----- small shared helpers -----
  M.initials = function (name) {
    return String(name || '').split(' ').map(function (x) { return x[0]; }).join('');
  };
  M.keyParts = function (key) {
    var p = key.split('-').map(Number);
    return [p[0], p[1] - 1, p[2]];   // [year, monthIndex, day]
  };

})(window.MossCave);
