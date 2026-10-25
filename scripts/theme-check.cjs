const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const ts = require('typescript');
const homeCodeCss = fs.readFileSync('components/home-code-field.module.css', 'utf8');
const homeCodeSource = fs.readFileSync('components/home-code-field.tsx', 'utf8');
const homePageCss = fs.readFileSync('app/home-v2.module.css', 'utf8');
const homePageSource = fs.readFileSync('app/page.tsx', 'utf8');
const heroWordSource = fs.readFileSync('components/hero-rotating-word.tsx', 'utf8');
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
assert.match(homeCodeCss, /\.field\s*\{[^}]*inset:\s*0[^}]*width:\s*100%[^}]*height:\s*100%[^}]*grid-template-columns:\s*repeat\(2,/);
assert.match(homeCodeCss, /\.stream\s*\{[^}]*min-width:\s*0[^}]*width:\s*100%[^}]*height:\s*100%[^}]*overflow:\s*hidden/);
assert.match(homeCodeCss, /@media\s*\(max-width:\s*540px\)[\s\S]*?\.field\s*\{[^}]*grid-template-columns:\s*repeat\(2,/);
assert.match(homeCodeCss, /\.activeLine\s*\{[^}]*transition:\s*color 1s ease, opacity 1s ease/);
assert.match(homeCodeCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.caret\s*\{\s*display:\s*none;\s*animation:\s*none/);
assert.match(homeCodeSource, /18 \+ \(\(charCounter \* 7 \+ speedOffset\) % 18\)/, 'Characters must type at a perceptible 18–35ms cadence');
assert.match(homeCodeSource, /const TEXT_RENDER_INTERVAL = 48/, 'React text rendering must be coalesced instead of rerendering for every typed character');
assert.match(homeCodeSource, /character === "\\n" \|\| performance\.now\(\) - lastPaintAt >= TEXT_RENDER_INTERVAL/, 'Keep the typing cadence while publishing text in short batches');
assert.match(homeCodeSource, /if \(character === "\\n"\) output = trim\(output\)/, 'Recount and trim the bounded history only when a line is added');
assert.match(homeCodeSource, /useLayoutEffect\(\(\) => \{[\s\S]*?\}, \[activeLine\]\)/, 'Scroll layout reads should happen only when the active line changes, not for every character');
assert.match(homeCodeSource, /character === "\\n" \? 48/, 'Line pauses must remain brief');
assert.match(homeCodeSource, /programIndex = \(programIndex \+ 1\) % programs\.length/, 'Code fragments must cycle continuously');
assert.match(homeCodeSource, /new IntersectionObserver/, 'Code animation must pause outside the viewport');
assert.match(homeCodeSource, /document\.hidden/, 'Code animation must pause when its tab is hidden');
assert.match(homeCodeSource, /motion\.matches\)[\s\S]*?padToLines\(fullSource,[\s\S]*?setActiveLine\(-1\)/, 'Reduced motion must display the complete static source, padded to fill the viewport, without a cursor');
assert.match(homeCodeSource, /function padToLines/, 'The code field must pad its source so the stream never collapses to the bottom of a tall viewport');
assert.match(homeCodeSource, /getComputedStyle\(viewport\)\.lineHeight/, 'The visible line budget must be measured from the real rendered viewport, not a fixed constant');
assert.match(homeCodeSource, /<CodeStream startProgram=\{0\} initialDelay=\{80\} speedOffset=\{0\}/);
assert.match(homeCodeSource, /<CodeStream startProgram=\{1\} initialDelay=\{720\} speedOffset=\{5\}/, 'The two code streams must start separately');
assert.match(homePageCss, /\.heroActions > :global\(\.site-button\)\.solutionsAction\s*\{[^}]*animation:\s*solutionsSheen 9s cubic-bezier\(\.22,1,\.36,1\) infinite/);
assert.match(homePageCss, /\.secondaryAction::before\s*\{[^}]*bottom:\s*-1px[^}]*animation:\s*industryTrace 9s cubic-bezier\(\.22,1,\.36,1\) infinite/);
assert.match(homePageCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?:global\(\.site-button\)\.solutionsAction\s*\{[^}]*animation:\s*none[^}]*transition:\s*none[\s\S]*?\.secondaryAction::before\s*\{[^}]*display:\s*none;\s*animation:\s*none/);
assert.match(homePageSource, /href="\/applications\/">Nos applications</);
assert.match(homePageSource, /href="\/solutions\/">Nos solutions</);
assert.match(homePageSource, /aria-label="YVEXOR — Technologie sur mesure"/, 'The H1 accessible name must stay the stable approved text');
assert.match(homePageSource, />Technologie</, 'The static first line of the title must remain its own element');
assert.match(homePageSource, /<HeroRotatingWord /, 'The homepage must render the animated second title line');
assert.match(heroWordSource, /const ROTATING_WORDS = \["sur mesure\.", "connectée\.", "intelligente\.", "automatisée\.", "pour votre métier\."\]/, 'The rotating word list must match the approved order with "sur mesure." first');
assert.match(heroWordSource, /const HOLD_MS = 2600/);
assert.match(heroWordSource, /const EXIT_MS = 300/);
assert.match(heroWordSource, /const ENTER_MS = 360/);
assert.match(heroWordSource, /translateY\(-16%\)/, 'The rotating word should use a short, gentle exit movement');
assert.match(heroWordSource, /translateY\(16%\)/, 'The rotating word should use a short, gentle entrance movement');
assert.match(heroWordSource, /new IntersectionObserver/, 'The rotating word must pause outside the viewport');
assert.match(heroWordSource, /document\.hidden/, 'The rotating word must pause when its tab is hidden');
assert.match(heroWordSource, /prefers-reduced-motion:\s*reduce/, 'The rotating word must check prefers-reduced-motion');
assert.match(heroWordSource, /el\.textContent = ROTATING_WORDS\[0\]/, 'Reduced motion must reset to the default "sur mesure." word');
assert.match(heroWordSource, /aria-hidden="true"/, 'The animated word must stay hidden from assistive tech so it is never re-announced');
assert.match(heroWordSource, /let exitAnimation: Animation \| undefined/);
assert.match(heroWordSource, /let enterAnimation: Animation \| undefined/);
assert.match(heroWordSource, /animation\.onfinish = null;\s*animation\.cancel\(\)/, 'Paused or unmounted WAAPI animations must have callbacks detached before cancellation');
assert.match(heroWordSource, /const pause = \(\) => \{\s*clear\(\);\s*cancelAnimations\(\);\s*\}/, 'Pausing must clear the timer and cancel both active animations');
assert.match(heroWordSource, /if \(!visible\) pause\(\)/, 'Leaving the viewport must pause and cancel the current transition');
assert.match(heroWordSource, /if \(document\.hidden\) pause\(\)/, 'Hiding the tab must pause and cancel the current transition');
assert.match(heroWordSource, /currentCycle !== cycle \|\| !visible \|\| document\.hidden \|\| motion\.matches/, 'A stale exit callback must not advance the word after a pause');
assert.match(heroWordSource, /stopped = true;\s*pause\(\);\s*observer\.disconnect\(\)/, 'Unmount must stop callbacks, cancel animations and disconnect the observer');
assert.match(heroWordSource, /exit\.cancel\(\)/);
assert.match(heroWordSource, /enter\.cancel\(\)/);
assert.doesNotMatch(heroWordSource, /fill:\s*"forwards"/, 'Finished animations must not leave persistent fill effects');
assert.match(homePageCss, /\.heroRotatingWrap\s*\{[^}]*height:\s*1\.08em[^}]*overflow:\s*hidden/, 'The rotating word container height must stay fixed to avoid vertical jumps');
assert.match(homePageCss, /\.heroRotatingWrap\s*\{[^}]*display:\s*grid[^}]*width:\s*max-content/, 'The rotating line should reserve its widest phrase and remain centered');
assert.match(homePageCss, /\.heroRotatingWord\s*\{[^}]*color:\s*#68c9de/, 'The rotating phrase uses the YVEXOR cyan accent');
assert.match(homePageCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.heroRotatingWord\s*\{/, 'Reduced motion must also disable the rotating word transform/opacity transition hints');
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
