/* ===== Moss Cave — ambient effects: spores, reveal-on-scroll, parallax ===== */
window.MossCave = window.MossCave || {};
(function (M) {
  'use strict';

  var raf = null;
  var sporeList = null;
  var io = null;
  var revealTimer = null;

  // reveal-on-scroll: animate .reveal elements as they enter the viewport
  function setupReveal() {
    var run = function () {
      var els = [].slice.call(document.querySelectorAll('.reveal:not(.anim)'));
      if (!els.length) { revealTimer = setTimeout(run, 150); return; }
      if (io) io.disconnect();
      io = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('anim'); io.unobserve(e.target); }
        });
      }, { threshold: 0.06 });
      els.forEach(function (el) { io.observe(el); });
    };
    run();
  }

  // drifting bioluminescent spores on the hero canvas
  function spores() {
    var cv = document.getElementById('moss-spores');
    if (!cv) { raf = requestAnimationFrame(spores); return; }
    var ctx = cv.getContext('2d');
    var resize = function () { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize();
    if (!sporeList) {
      sporeList = Array.from({ length: 46 }, function () {
        return {
          x: Math.random(), y: Math.random(), r: Math.random() * 2.2 + 0.6,
          sp: Math.random() * 0.00018 + 0.00006, dr: (Math.random() - 0.5) * 0.0002,
          a: Math.random() * 0.5 + 0.2, ph: Math.random() * 6.28
        };
      });
    }
    var tick = function () {
      var cv2 = document.getElementById('moss-spores');
      if (!cv2) { raf = requestAnimationFrame(tick); return; }
      if (cv2.width !== cv2.offsetWidth) resize();
      ctx.clearRect(0, 0, cv.width, cv.height);
      var t = Date.now() * 0.001;
      for (var i = 0; i < sporeList.length; i++) {
        var s = sporeList[i];
        s.y -= s.sp; s.x += s.dr + Math.sin(t + s.ph) * 0.00012;
        if (s.y < -0.02) { s.y = 1.02; s.x = Math.random(); }
        var px = s.x * cv.width, py = s.y * cv.height;
        var tw = 0.6 + 0.4 * Math.sin(t * 1.5 + s.ph);
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, 6.28);
        ctx.fillStyle = 'rgba(' + (175 + Math.floor(40 * tw)) + ',220,140,' + (s.a * tw) + ')';
        ctx.shadowColor = 'rgba(155,209,122,0.8)'; ctx.shadowBlur = 6;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
  }

  // subtle parallax on the layered cave background as the page scrolls
  function setupParallax() {
    var onScroll = function () {
      var y = window.scrollY;
      var b1 = document.getElementById('moss-bg-1');
      var b2 = document.getElementById('moss-bg-2');
      var b3 = document.getElementById('moss-bg-3');
      if (b1) b1.style.transform = 'translateY(' + (y * 0.18) + 'px) scale(1.05)';
      if (b2) b2.style.transform = 'translateY(' + (y * 0.32) + 'px)';
      if (b3) b3.style.transform = 'translateY(' + (y * 0.12) + 'px)';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // re-arm reveal after the landing DOM changes (e.g. hero variant swap adds new .reveal nodes)
  M.refreshReveal = function () { setupReveal(); };

  M.startEffects = function () {
    setupReveal();
    spores();
    setupParallax();
  };

})(window.MossCave);
