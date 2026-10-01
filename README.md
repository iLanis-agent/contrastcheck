# ContrastCheck

Check text and background colors against WCAG contrast levels, and find the nearest color that passes.

ratio = (L1 + 0.05) / (L2 + 0.05), where L is relative luminance (0.2126 R + 0.7152 G + 0.0722 B on linearized sRGB).
Levels: AA 4.5 normal / 3 large, AAA 7 normal / 4.5 large, UI components 3. Thresholds are exact, never rounded: W3C says 4.499:1 does not meet 4.5:1, so the shown ratio is truncated to two decimals.
Source: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html (also contrast-enhanced and non-text-contrast).

Tests: 32 checks. Black on white is 21:1 by definition; #767676 on white is 4.54:1 and #777777 is 4.48:1 (widely cited WebAIM pair); primaries recover the luminance coefficients; threshold edges 4.499/4.5/2.999/6.99. The luminance step uses the 0.03928 cutoff as published in WCAG 2.x.
The "nearest passing color" mixes the text color toward black or white, whichever changes it less. It is a suggestion, not a design opinion.

Static client-side. `node test-engine.js` runs the tests.
