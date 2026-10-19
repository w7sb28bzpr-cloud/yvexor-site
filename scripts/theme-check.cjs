const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const ts = require('typescript');
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
console.log('PASS: automatic day/night boundaries, manual overrides, invalid preferences and blocked storage; prepaint script matches resolver.');
