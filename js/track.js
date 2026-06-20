/* ===== Moss Cave — Track booking modal (phone lookup) ===== */
window.MossCave = window.MossCave || {};
(function (M) {
  'use strict';

  var DL_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0c110b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 v12"></path><path d="M7 11 l5 5 l5 -5"></path><path d="M5 20 h14"></path></svg>';

  function escAttr(v) { return String(v || '').replace(/"/g, '&quot;'); }

  function findBooking() {
    var digits = (M.state.trackPhone || '').replace(/\D/g, '');
    var res = digits.length >= 4 ? (M.state.myBookings[digits] || []) : [];
    M.setState({ trackResults: res, trackSearched: true });
  }

  function resultsHTML() {
    return '<div style="display:flex;flex-direction:column;gap:12px">' + (M.state.trackResults || []).map(function (b, i) {
      return '<div style="background:rgba(155,209,122,.05);border:1px solid rgba(155,209,122,.14);border-radius:16px;padding:18px">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">' +
        '<div><div style="font-family:\'Newsreader\',serif;font-size:21px;line-height:1.1">' + b.dateLabel + '</div>' +
        '<div style="font-size:13px;color:#9aa790;margin-top:2px">' + b.slot + '</div></div>' +
        '<span style="font-family:\'Space Mono\',monospace;font-size:10.5px;padding:4px 10px;border-radius:6px;color:#9bd17a;background:rgba(155,209,122,.14);letter-spacing:.5px">' + b.status + '</span></div>' +
        '<div style="display:flex;gap:22px;padding:12px 0;border-top:1px solid rgba(155,209,122,.1);border-bottom:1px solid rgba(155,209,122,.1);margin-bottom:14px">' +
        cell('Guest', b.name) + cell('Party', b.party + ' guests') + cell('Ref', b.ref, '#9bd17a', true) +
        '<div style="margin-left:auto;text-align:right"><div style="font-family:\'Space Mono\',monospace;font-size:10px;color:#73815f;text-transform:uppercase;letter-spacing:1px">Paid</div><div style="font-family:\'Newsreader\',serif;font-size:22px;color:#bfe89a;margin-top:1px">$' + b.amount + '</div></div></div>' +
        '<button class="btn-accent dl-receipt" data-i="' + i + '" style="width:100%;font-size:14px;padding:13px;border-radius:11px;display:flex;align-items:center;justify-content:center;gap:8px">' + DL_SVG + 'Download receipt (PDF)</button></div>';
    }).join('') + '</div>';
  }

  function cell(label, val, color, mono) {
    return '<div><div style="font-family:\'Space Mono\',monospace;font-size:10px;color:#73815f;text-transform:uppercase;letter-spacing:1px">' + label + '</div>' +
      '<div style="font-size:14px;color:' + (color || '#dbe9cd') + ';margin-top:3px' + (mono ? ";font-family:'Space Mono',monospace" : '') + '">' + val + '</div></div>';
  }

  function modalHTML() {
    var s = M.state;
    var body;
    if (s.trackSearched && s.trackResults && s.trackResults.length > 0) {
      body = resultsHTML();
    } else if (s.trackSearched) {
      body = '<div style="text-align:center;padding:22px 10px;color:#9aa790">' +
        '<div style="width:46px;height:46px;border-radius:50%;border:1px dashed rgba(155,209,122,.3);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:18px">🌫</div>' +
        '<div style="font-size:14.5px;color:#cdd8c2;margin-bottom:4px">No booking found</div>' +
        '<div style="font-size:12.5px;max-width:260px;margin:0 auto">We couldn\'t find a reservation for that number. Double-check it, or try the demo number (555) 0148.</div></div>';
    } else {
      body = '<div style="text-align:center;padding:18px 10px 6px;color:#73815f;font-size:13px;font-family:\'Space Mono\',monospace;line-height:1.7">Try the demo number<br><span style="color:#9bd17a;font-size:15px">(555) 0148</span></div>';
    }
    return '<div id="track-overlay" style="position:fixed;inset:0;z-index:3000;background:rgba(5,8,5,.74);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:24px">' +
      '<div id="track-card" style="width:460px;max-width:100%;max-height:88vh;overflow-y:auto;background:#11180e;border:1px solid rgba(155,209,122,.18);border-radius:22px;padding:30px;box-shadow:0 40px 100px rgba(0,0,0,.65)">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">' +
      '<div><div style="font-family:\'Space Mono\',monospace;font-size:11px;letter-spacing:2px;color:#9bd17a;text-transform:uppercase;margin-bottom:8px">No account needed</div>' +
      '<div style="font-family:\'Newsreader\',serif;font-size:28px;line-height:1.05">Track your booking</div></div>' +
      '<button id="track-close" style="width:34px;height:34px;border-radius:50%;background:rgba(155,209,122,.08);border:1px solid rgba(155,209,122,.14);color:#cdd8c2;cursor:pointer;font-size:14px;flex:none">✕</button></div>' +
      '<div style="font-size:13.5px;color:#8c9a80;margin:10px 0 20px">Enter the phone number you booked with to see your reservation and download your receipt.</div>' +
      '<div style="display:flex;gap:9px;margin-bottom:20px">' +
      '<input id="track-phone" value="' + escAttr(s.trackPhone) + '" placeholder="e.g. (555) 0148" style="flex:1;font-family:inherit;font-size:15px;color:#e7ede0;background:rgba(12,17,11,.6);border:1px solid rgba(155,209,122,.16);border-radius:12px;padding:13px 15px;outline:none" />' +
      '<button id="track-find" class="btn-accent" style="font-size:14.5px;padding:0 24px;border-radius:12px">Find</button></div>' +
      body + '</div></div>';
  }

  M.track = {
    open: function () { M.setState({ trackOpen: true, trackSearched: false, trackResults: null, trackPhone: '' }); },
    close: function () { M.setState({ trackOpen: false }); },
    render: function () {
      var root = document.getElementById('track-root');
      if (!root) return;
      if (!M.state.trackOpen) { root.innerHTML = ''; return; }
      root.innerHTML = modalHTML();

      root.querySelector('#track-overlay').addEventListener('click', function () { M.track.close(); });
      root.querySelector('#track-card').addEventListener('click', function (e) { e.stopPropagation(); });
      root.querySelector('#track-close').addEventListener('click', function () { M.track.close(); });
      var phone = root.querySelector('#track-phone');
      phone.addEventListener('input', function () { M.set({ trackPhone: this.value }); });
      phone.addEventListener('keydown', function (e) { if (e.key === 'Enter') findBooking(); });
      root.querySelector('#track-find').addEventListener('click', findBooking);
      root.querySelectorAll('.dl-receipt').forEach(function (b) {
        b.addEventListener('click', function () {
          var rec = (M.state.trackResults || [])[+this.getAttribute('data-i')];
          if (rec) M.downloadReceipt(rec);
        });
      });
    }
  };

})(window.MossCave);
