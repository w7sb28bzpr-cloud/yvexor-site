import { cp, copyFile, mkdir } from "node:fs/promises";
const routes=["a-propos","agence-ia-marseille","automatisation-entreprise","contact","faq","intelligence-artificielle-entreprise","logiciel-caisse-marseille","logiciel-garage","logiciel-sur-mesure","mentions-legales","politique-confidentialite","realisations","solutions-hotels","solutions-restaurants","tarifs-partenariat","yvexor-pos"];
const assets=["robots.txt","sitemap.xml","styles.css","script.js","yvexorlogo.jpeg","yvexor-social.jpg"];
await mkdir("out",{recursive:true});
await Promise.all(routes.map(route=>cp(route,`out/${route}`,{recursive:true,force:true})));
await Promise.all(assets.map(asset=>copyFile(asset,`out/${asset}`)));
