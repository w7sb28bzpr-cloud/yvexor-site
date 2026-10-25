const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;
  module._compile(output, filename);
};

const { filterPublishedProjects, getGeneratedIndustryPages, getGeneratedSolutionPages, getPublishablePricing, getPublishedProjects, validateContentGraph } = require("../lib/content.ts");
const { projects } = require("../data/projects.ts");
const { getPublicSolutions } = require("../lib/content.ts");
const { solutions } = require("../data/solutions.ts");
const { v2Solutions } = require("../data/v2-solutions.ts");
const errors = validateContentGraph();
assert.deepEqual(errors, [], errors.join("\n"));
assert.deepEqual(getGeneratedSolutionPages().map((page) => page.slug).sort(), ["hebergement-infrastructure", "retrofit-equipement-non-connecte"], "Only solutions without an existing canonical destination may generate new detail routes");
assert.deepEqual(getGeneratedIndustryPages(), [], "Legacy canonical industries must not generate competing /metiers/ detail routes");
assert.deepEqual(getGeneratedIndustryPages([
  { id: "legacy", slug: "restaurant", canonicalPath: "/solutions-restaurants/" },
  { id: "new", slug: "future-activity", canonicalPath: "/metiers/future-activity/" },
  { id: "mismatch", slug: "other-activity", canonicalPath: "/metiers/future-activity/" },
]).map((page) => page.slug), ["future-activity"], "Only exact /metiers/{slug}/ canonical paths may generate detail routes");
assert.equal(new Set(v2Solutions.map((solution) => solution.id)).size, v2Solutions.length, "V2 solution source IDs must be unique");
for (const solution of solutions.filter((item) => item.id !== "equipment-retrofit")) {
  const source = v2Solutions.find((item) => item.id === solution.id);
  assert.ok(source, `Solution ${solution.id} must have an explicit V2 source`);
  assert.equal(solution.eyebrow, source.title, `Solution ${solution.id} must use its matching V2 source`);
}
assert.deepEqual(getPublishedProjects(), [], "No fictional or draft project should be public");
assert.deepEqual(filterPublishedProjects([{ publicationStatus: "draft" }]), [], "Draft projects must be filtered out");

const hypothesis = { offers: [{ kind: "subscription", monthlyFrom: 1 }], validated: false };
assert.equal(getPublishablePricing(hypothesis), null, "Unvalidated pricing must not be exposed to public UI");
const validated = { offers: [{ kind: "quote" }], validated: true };
assert.equal(getPublishablePricing(validated)?.validated, true);
assert.deepEqual(getPublicSolutions().map((solution) => solution.pricing), solutions.map((solution) => getPublishablePricing(solution.pricing)));

console.log(`PASS: ${require("../data/solutions.ts").solutions.length} solutions, ${require("../data/industries.ts").industries.length} industries, ${projects.length} projects; IDs, slugs, relations, canonicalPath, draft and pricing guards.`);
