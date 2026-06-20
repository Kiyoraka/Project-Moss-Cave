/* ===== Moss Cave — PDF receipt builder (jsPDF) ===== */
window.MossCave = window.MossCave || {};
(function (M) {
  'use strict';

  // Builds and downloads a receipt PDF for one booking record `b`
  // (expects: name, phone, dateLabel, slot, party, ref, amount).
  M.downloadReceipt = function (b) {
    var J = window.jspdf && window.jspdf.jsPDF;
    if (!J) { alert('Receipt generator is still loading — please try again in a moment.'); return; }
    var doc = new J({ unit: 'pt', format: [420, 560] });

    // header band
    doc.setFillColor(12, 17, 11); doc.rect(0, 0, 420, 96, 'F');
    doc.setFillColor(155, 209, 122); doc.circle(46, 46, 13, 'F');
    doc.setFillColor(95, 138, 69); doc.circle(50, 50, 6, 'F');
    doc.setTextColor(231, 237, 224); doc.setFont('times', 'normal'); doc.setFontSize(26); doc.text('Nature', 74, 44);
    doc.setTextColor(155, 209, 122); doc.setFont('courier', 'normal'); doc.setFontSize(8.5); doc.text('MOSS CAVE  ·  BOOKING RECEIPT', 74, 62);
    doc.setTextColor(140, 160, 120); doc.setFontSize(7.5); doc.text('48.21°N  /  cool  /  11°C', 74, 76);

    // ref pill
    doc.setTextColor(180, 200, 150); doc.setFont('courier', 'normal'); doc.setFontSize(9);
    doc.text(b.ref, 380, 50, { align: 'right' });
    doc.setTextColor(120, 140, 100); doc.setFontSize(7); doc.text('CONFIRMED', 380, 64, { align: 'right' });

    // body rows
    var y = 146;
    var row = function (label, val) {
      doc.setFont('courier', 'normal'); doc.setFontSize(8.5); doc.setTextColor(150, 160, 135);
      doc.text(label.toUpperCase(), 40, y);
      doc.setFont('times', 'normal'); doc.setFontSize(13); doc.setTextColor(28, 38, 24);
      doc.text(String(val), 380, y, { align: 'right' });
      doc.setDrawColor(228, 230, 222); doc.setLineWidth(0.6); doc.line(40, y + 13, 380, y + 13);
      y += 38;
    };
    doc.setFont('times', 'normal'); doc.setFontSize(11); doc.setTextColor(90, 120, 70);
    doc.text('Your descent is reserved', 40, 124);
    row('Guest', b.name);
    row('Phone', b.phone);
    row('Date', b.dateLabel);
    row('Tour time', b.slot);
    row('Party size', b.party + ' guest' + (b.party > 1 ? 's' : ''));
    row('Reference', b.ref);

    // total
    y += 8;
    doc.setFont('courier', 'normal'); doc.setFontSize(9); doc.setTextColor(150, 160, 135);
    doc.text('TOTAL PAID', 40, y + 6);
    doc.setFont('times', 'normal'); doc.setFontSize(30); doc.setTextColor(60, 90, 45);
    doc.text('$' + b.amount, 380, y + 12, { align: 'right' });

    // footer
    doc.setDrawColor(228, 230, 222); doc.line(40, y + 34, 380, y + 34);
    doc.setFont('courier', 'normal'); doc.setFontSize(8); doc.setTextColor(140, 150, 125);
    doc.text('Please present this receipt at the cave entrance.', 40, y + 54);
    doc.text('Arrive 15 minutes early · silent tour · 11°C, bring a layer.', 40, y + 68);
    doc.setTextColor(95, 138, 69); doc.setFont('times', 'italic'); doc.setFontSize(11);
    doc.text('Thank you — see you in the deep.', 40, y + 94);
    doc.setFont('courier', 'normal'); doc.setFontSize(7); doc.setTextColor(170, 178, 160);
    doc.text('hello@nature.cave   ·   +1 555 0148   ·   © 2026 Nature Cave', 40, 540);

    doc.save('Nature-receipt-' + b.ref + '.pdf');
  };

})(window.MossCave);
