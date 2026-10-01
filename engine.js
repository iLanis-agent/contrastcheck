(function (root) {
  'use strict';
  // WCAG 2.x relative luminance and contrast ratio. Thresholds are exact, never rounded (W3C: 4.499:1 fails 4.5:1).
  function parseHex(s) {
    var t = String(s).trim().replace(/^#/, '');
    if (/^[0-9a-f]{3}$/i.test(t)) t = t.replace(/./g, function (c) { return c + c; });
    if (!/^[0-9a-f]{6}$/i.test(t)) return null;
    return [parseInt(t.slice(0, 2), 16), parseInt(t.slice(2, 4), 16), parseInt(t.slice(4, 6), 16)];
  }
  function toHex(rgb) { return '#' + rgb.map(function (v) { var h = Math.max(0, Math.min(255, Math.round(v))).toString(16); return h.length < 2 ? '0' + h : h; }).join(''); }
  function lin(c8) { var c = c8 / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function luminance(rgb) { return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]); }
  function ratio(a, b) { var la = luminance(a), lb = luminance(b), hi = Math.max(la, lb), lo = Math.min(la, lb); return (hi + 0.05) / (lo + 0.05); }
  var LEVELS = { 'AA normal text': 4.5, 'AA large text': 3, 'AAA normal text': 7, 'AAA large text': 4.5, 'UI components (AA)': 3 };
  function verdicts(r) { var o = {}; Object.keys(LEVELS).forEach(function (k) { o[k] = r >= LEVELS[k]; }); return o; }
  // display ratio truncated (not rounded) to 2 decimals so 4.499 never shows as a pass-looking 4.50
  function fmtRatio(r) { return (Math.floor(r * 100 + 1e-9) / 100).toFixed(2) + ':1'; }
  // Nearest passing foreground: mix the foreground toward black or white (whichever gets there with the smaller change) until it reaches target.
  function fixForeground(fg, bg, target) {
    if (ratio(fg, bg) >= target) return { rgb: fg, changed: false };
    var best = null;
    [[0, 0, 0], [255, 255, 255]].forEach(function (end) {
      if (ratio(end, bg) < target) return;
      var lo = 0, hi = 1;
      for (var i = 0; i < 40; i++) { var m = (lo + hi) / 2, c = fg.map(function (v, k) { return v + (end[k] - v) * m; }); if (ratio(c.map(Math.round), bg) >= target) hi = m; else lo = m; }
      var c = fg.map(function (v, k) { return Math.round(v + (end[k] - v) * hi); });
      while (ratio(c, bg) < target) { hi = Math.min(1, hi + 0.002); c = fg.map(function (v, k) { return Math.round(v + (end[k] - v) * hi); }); if (hi >= 1) break; }
      if (!best || hi < best.t) best = { rgb: c, t: hi };
    });
    return best ? { rgb: best.rgb, changed: true } : null;
  }
  var api = { parseHex: parseHex, toHex: toHex, luminance: luminance, ratio: ratio, LEVELS: LEVELS, verdicts: verdicts, fmtRatio: fmtRatio, fixForeground: fixForeground };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.WC = api;
})(typeof window !== 'undefined' ? window : this);
