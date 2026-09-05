const response = await fetch("https://yvexor.com/?audit=" + Date.now(), {
  headers: { "cache-control": "no-cache", pragma: "no-cache" },
});
const html = await response.text();
const required = ["Votre problème métier", "Construisons la solution"];
const forbidden = ["YVEXOR Côte d’Azur | Caisse", "À partir de 350 €"];
if (!response.ok || required.some(marker => !html.includes(marker)) || forbidden.some(marker => html.includes(marker))) {
  console.error("PRODUCTION = NOUVELLE HOME : NON");
  process.exit(1);
}
console.log("PRODUCTION = NOUVELLE HOME : OUI");
