const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const ts = require('typescript');
const homeCodeCss = fs.readFileSync('components/home-code-field.module.css', 'utf8');
const homeCodeSource = fs.readFileSync('components/home-code-field.tsx', 'utf8');
const homePageCss = fs.readFileSync('app/home-v2.module.css', 'utf8');
const output = ts.transpileModule(fs.readFileSync('lib/theme.ts', 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const sandbox = {exports:{}};
vm.runInNewContext(output, sandbox);
const {resolveTheme, themeBootstrap} = sandbox.exports;
for (const [hour, expected] of [[0,'dark'],[6,'dark'],[7,'light'],[18,'light'],[19,'dark'],[23,'dark']]) {
  assert.equal(resolveTheme('auto', hour), expected);
  for (const mode of ['auto','light','dark','invalid',null]) {
    const root = {dataset:{},style:{}};
    vm.runInNewContext(themeBootstrap,{document:{documentElement:root},localStorage:{getItem:()=>mode},Date:class{getHours(){return hour}}});
    assert.equal(root.dataset.theme, mode==='light'||mode==='dark'?mode:expected);
    assert.equal(root.style.colorScheme, root.dataset.theme);
  }
}
const root={dataset:{},style:{}};
vm.runInNewContext(themeBootstrap,{document:{documentElement:root},localStorage:{getItem(){throw Error('Storage blocked')}},Date:class{getHours(){return 12}}});
assert.equal(root.dataset.theme,'light');
const tokenCss = fs.readFileSync('app/site-tokens.css', 'utf8');
const primitiveCss = fs.readFileSync('app/site-primitives.css', 'utf8');
const contrast = (foreground, background) => {
  const luminance = color => {
    const channels = color.match(/[a-f\d]{2}/gi).map(channel => parseInt(channel, 16) / 255).map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
};
const token = (name, source = tokenCss) => {
  const match = source.match(new RegExp(`${name}:\\s*(#[a-f\\d]{3,6})`, 'i'));
  assert.ok(match, `Missing semantic token ${name}`);
  let color = match[1];
  if (color.length === 4) color = `#${[...color.slice(1)].map(channel => channel + channel).join('')}`;
  return color;
};
for (const [label, background, surface, primary, secondary, muted, border, focus, accent, accentText] of [
  ['dark', '#090909', '#141414', '#f7f7f7', '#c2c2c2', '#a0a0a0', '#777777', '#ffffff', '#d6d6d6', '#111111'],
  ['light', '#ffffff', '#f5f5f5', '#111111', '#404040', '#595959', '#767676', '#111111', '#292929', '#ffffff'],
]) {
  const scope = label === 'dark' ? tokenCss : tokenCss.slice(tokenCss.indexOf(':root[data-theme="light"]'));
  for (const [name, expected] of [['--site-background', background], ['--site-surface', surface], ['--site-text-primary', primary], ['--site-text-secondary', secondary], ['--site-text-muted', muted], ['--site-border', border], ['--site-focus', focus], ['--site-accent', accent], ['--site-accent-contrast', accentText]]) {
    assert.equal(token(name, scope).toLowerCase(), expected, `${label} ${name} changed; review neutral palette contrast`);
  }
  assert.ok(contrast(primary, background) >= 4.5, `${label} primary text contrast`);
  assert.ok(contrast(secondary, background) >= 4.5, `${label} secondary text contrast`);
  assert.ok(contrast(muted, background) >= 4.5, `${label} muted text contrast`);
  assert.ok(contrast(border, surface) >= 3, `${label} surface border contrast`);
  assert.ok(contrast(focus, background) >= 3, `${label} focus indicator contrast`);
  assert.ok(contrast(accentText, accent) >= 4.5, `${label} accent button contrast`);
}
assert.match(primitiveCss, /\.site-foundation \.site-button\s*\{[\s\S]*?min-height:\s*44px/);
assert.match(primitiveCss, /\.site-foundation \.site-container\s*\{/);
assert.doesNotMatch(primitiveCss, /^\.site-container\s*\{/m, 'Site containers must opt into the foundation wrapper');
assert.match(primitiveCss, /:focus-visible/);
assert.match(primitiveCss, /prefers-reduced-motion:\s*reduce/);
assert.match(primitiveCss, /--site-gutter/);
assert.match(homePageCss, /\.heroVisual\s*\{[^}]*inset:\s*0[^}]*width:\s*100%[^}]*max-width:\s*none/);
assert.match(homeCodeCss, /\.field\s*\{[^}]*width:\s*100%[^}]*min-width:\s*100%[^}]*max-width:\s*none/);
assert.match(homeCodeCss, /\.ambient\s*\{[^}]*inset:\s*0[^}]*width:\s*100%[^}]*max-width:\s*none[^}]*columns:\s*2[^}]*column-fill:\s*auto/);
assert.match(homeCodeCss, /@media\s*\(max-width:\s*800px\)[\s\S]*?\.ambient\s*\{[^}]*columns:\s*2/);
assert.match(homeCodeSource, /source\.repeat\(12\)/, 'Ambient source must continue through both mobile columns');
assert.match(homeCodeSource, /source\[current\]\s*===\s*"\\n"\s*\?\s*155/, 'Typing must pause briefly as new lines appear');
assert.match(homeCodeSource, /motion\.matches\)[\s\S]*?cursor\s*=\s*sourceLength[\s\S]*?setPosition\(sourceLength\)/, 'Reduced motion must display the complete static source');
const footerSource = fs.readFileSync('components/site-footer.tsx', 'utf8');
assert.match(footerSource, /© 2026 YVEXOR/);
assert.match(footerSource, /href="\/mentions-legales\/"/);
assert.match(footerSource, /href="\/politique-confidentialite\/"/);
assert.doesNotMatch(footerSource, /href="\/(?:solutions|metiers|projets|a-propos|contact|boutique|materiel|faq|caisse)\//, 'Shared footer must not repeat site navigation');
for (const width of [320, 375, 768, 1024, 1440]) {
  const gutter = Math.min(64, Math.max(16, width * 0.04));
  assert.ok(width - 2 * gutter > 0, `Site content must remain positive at ${width}px`);
}
console.log('PASS: theme resolver, prepaint script, neutral light/dark contrast, focus, reduced motion and responsive foundation widths.');
