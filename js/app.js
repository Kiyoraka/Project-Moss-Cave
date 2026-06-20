/* ===== Moss Cave — app router + boot wiring (loaded last) ===== */
window.MossCave = window.MossCave || {};
(function (M) {
  'use strict';

  var SURFACES = ['landing', 'admin', 'mobile'];

  function showSurface(view) {
    SURFACES.forEach(function (v) {
      var el = document.getElementById('surface-' + v);
      if (el) el.classList.toggle('active', v === view);
    });
  }

  function updateSwitcher() {
    SURFACES.forEach(function (v) {
      var b = document.getElementById('sw-' + v);
      if (b) b.classList.toggle('active', v === M.state.view);
    });
  }

  // Global re-render: keep the visible surface in sync with state; track modal is global.
  M.rerender = function () {
    showSurface(M.state.view);
    updateSwitcher();
    if (M.state.view === 'landing') M.landing.rerender();
    else if (M.state.view === 'admin') M.admin.render();
    else if (M.state.view === 'mobile') M.mobile.render();
    M.track.render();
  };

  function boot() {
    document.querySelectorAll('.switcher button').forEach(function (b) {
      b.addEventListener('click', function () { M.setState({ view: this.getAttribute('data-go') }); });
    });
    showSurface(M.state.view);
    updateSwitcher();
    M.landing.init();   // paints landing dynamic regions
    M.track.render();   // closed by default
    M.startEffects();   // spores + reveal + parallax
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})(window.MossCave);
