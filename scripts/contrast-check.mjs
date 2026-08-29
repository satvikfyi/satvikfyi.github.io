// One-off WCAG contrast verification for the satvik palette (not shipped to CI).
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(fg, bg) {
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}
const C = {
  cream: '#faf6ee', parchment: '#f2ebda',
  earth: '#3d362b', clay: '#5f5849',
  saffron: '#c07a1e', saffronDeep: '#8a4a0b',
  sage: '#74915c', sageDeep: '#4a6133',
  indigo: '#7b76cf', indigoDeep: '#47429c',
  plum: '#ad6a92', plumDeep: '#7c3a63',
};
const pairs = [
  ['earth on cream', C.earth, C.cream],
  ['earth on parchment', C.earth, C.parchment],
  ['clay on cream', C.clay, C.cream],
  ['clay on parchment', C.clay, C.parchment],
  ['saffron-deep on cream', C.saffronDeep, C.cream],
  ['saffron-deep on parchment', C.saffronDeep, C.parchment],
  ['sage-deep on cream', C.sageDeep, C.cream],
  ['sage-deep on parchment', C.sageDeep, C.parchment],
  ['indigo-deep on cream', C.indigoDeep, C.cream],
  ['indigo-deep on parchment', C.indigoDeep, C.parchment],
  ['plum-deep on cream', C.plumDeep, C.cream],
  ['plum-deep on parchment', C.plumDeep, C.parchment],
  ['cream (text) on earth', C.cream, C.earth],
  ['cream (text) on saffron-deep', C.cream, C.saffronDeep],
  ['clay/80 on parchment (approx, full opacity)', C.clay, C.parchment],
];
for (const [name, fg, bg] of pairs) {
  const r = ratio(fg, bg);
  console.log(`${r >= 4.5 ? 'PASS' : 'FAIL'}  ${r.toFixed(2)}  ${name}`);
}
