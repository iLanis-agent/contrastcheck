var E = require('./engine.js'), n = 0, bad = 0;
function eq(a, b, m, t) { n++; if (!(Math.abs(a - b) <= (t == null ? 1e-9 : t))) { bad++; console.log('FAIL', m, a, b); } }
function is(a, b, m) { n++; if (a !== b) { bad++; console.log('FAIL', m, a, b); } }
var W = [255, 255, 255], K = [0, 0, 0], p = E.parseHex;
// W3C definition: black on white = (1+0.05)/(0+0.05) = 21:1; same color = 1:1
eq(E.ratio(K, W), 21, 'black/white'); eq(E.ratio(W, K), 21, 'symmetric'); eq(E.ratio(W, W), 1, 'same');
eq(E.luminance(W), 1, 'lum white', 1e-9); eq(E.luminance(K), 0, 'lum black');
// WebAIM widely cited pair: #767676 is the lightest gray on white that passes AA (4.54:1); #777777 gives 4.48:1 and fails
eq(E.ratio(p('#767676'), W), 4.54, '767676', 0.006); eq(E.ratio(p('#777'), W), 4.48, '777', 0.006);
is(E.verdicts(E.ratio(p('#767676'), W))['AA normal text'], true, '767676 passes AA');
is(E.verdicts(E.ratio(p('#777777'), W))['AA normal text'], false, '777 fails AA');
is(E.verdicts(E.ratio(p('#777777'), W))['AA large text'], true, '777 passes large');
// primaries (luminance coefficients 0.2126 / 0.7152 / 0.0722)
eq(E.luminance(p('#ff0000')), 0.2126, 'red', 1e-9); eq(E.luminance(p('#00ff00')), 0.7152, 'green', 1e-9); eq(E.luminance(p('#0000ff')), 0.0722, 'blue', 1e-9);
// thresholds are exact
is(E.verdicts(4.499)['AA normal text'], false, '4.499 fails'); is(E.verdicts(4.5)['AA normal text'], true, '4.5 passes'); is(E.verdicts(2.999)['UI components (AA)'], false, '2.999 fails'); is(E.verdicts(7)['AAA normal text'], true, '7 passes'); is(E.verdicts(6.99)['AAA normal text'], false, '6.99');
is(E.fmtRatio(4.499), '4.49:1', 'truncate'); is(E.fmtRatio(21), '21.00:1', 'fmt21'); is(E.fmtRatio(4.5), '4.50:1', 'fmt45');
// parsing
is(JSON.stringify(p('#FFF')), '[255,255,255]', 'short'); is(JSON.stringify(p('1a2B3c')), '[26,43,60]', 'no hash'); is(p('#12'), null, 'bad'); is(p('zzzzzz'), null, 'bad2'); is(E.toHex([26, 43, 60]), '#1a2b3c', 'toHex');
// fixer: result passes, passing input untouched, and stays near the original
var f = E.fixForeground(p('#777777'), W, 4.5); is(f.changed, true, 'fix changed'); is(E.ratio(f.rgb, W) >= 4.5, true, 'fix passes'); is(E.toHex(f.rgb), '#767676', 'fix lands on 767676');
is(E.fixForeground(K, W, 4.5).changed, false, 'no change');
var g = E.fixForeground(p('#888888'), p('#999999'), 4.5); is(E.ratio(g.rgb, p('#999999')) >= 4.5, true, 'fix on mid bg passes');
is(E.fixForeground(p('#808080'), p('#808080'), 21), null, 'impossible target');
console.log((n - bad) + '/' + n + ' passed'); process.exit(bad ? 1 : 0);
