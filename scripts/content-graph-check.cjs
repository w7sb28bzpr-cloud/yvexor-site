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

const { filterPublishedProjects, getPublishablePricing, getPublishedProjects, validateContentGraph } = require("../lib/content.ts");
const { projects } = require("../data/projects.ts");
const { getPublicSolutions } = require("../lib/content.ts");
const { solutions } = require("../data/solutions.ts");
const errors = validateContentGraph();
assert.deepEqual(errors, [], errors.join("\n"));
assert.deepEqual(getPublishedProjects(), [], "No fictional or draft project should be public");
assert.deepEqual(filterPublishedProjects([{ publicationStatus: "draft" }]), [], "Draft projects must be filtered out");

const hypothesis = { offers: [{ kind: "subscription", monthlyFrom: 1 }], validated: false };
assert.equal(getPublishablePricing(hypothesis), null, "Unvalidated pricing must not be exposed to public UI");
const validated = { offers: [{ kind: "quote" }], validated: true };
assert.equal(getPublishablePricing(validated)?.validated, true);
assert.deepEqual(getPublicSolutions().map((solution) => solution.pricing), solutions.map((solution) => getPublishablePricing(solution.pricing)));

console.log(`PASS: ${require("../data/solutions.ts").solutions.length} solutions, ${require("../data/industries.ts").industries.length} industries, ${projects.length} projects; IDs, slugs, relations, canonicalPath, draft and pricing guards.`);
