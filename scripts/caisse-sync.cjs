// Generated portal snapshot. The editable source remains data/caisses.json + caisse-professions.ts.
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),Module=require('node:module');
const file=path.resolve('data/caisse-professions.ts'),mod=new Module(file,module);
mod.filename=file;mod.paths=module.paths;mod._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,file);
const data={...require('../data/caisses.json'),professions:mod.exports.professions.map(({slug,family,name})=>({slug,family,name}))};
const content=JSON.stringify(data,null,2)+'\n',target='portal/core/caisse_catalogue.json';
if(process.argv.includes('--check')){if(fs.readFileSync(target,'utf8')!==content)throw Error('Run node scripts/caisse-sync.cjs before deployment');}else fs.writeFileSync(target,content);
