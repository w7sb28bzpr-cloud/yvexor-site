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

const { filterPublishedProjects, getGeneratedIndustryPages, getGeneratedProjectPages, getGeneratedSolutionPages, getProjectSitemapPaths, getPublicProjectBySlug, getPublicTools, getPublishablePricing, getPublishedProjects, validateContentGraph } = require("../lib/content.ts");
const { projects } = require("../data/projects.ts");
const { getPublicSolutions } = require("../lib/content.ts");
const { solutions } = require("../data/solutions.ts");
const { v2Solutions } = require("../data/v2-solutions.ts");
const { businessTools } = require("../data/business-tools.ts");
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
assert.deepEqual(getPublicTools().map((tool) => tool.id), ["business-website", "business-management-app", "cash-register"], "Only confirmed application offers appear in the initial public library, with general business tools before the historic POS offer");
const draftTool = { ...businessTools[0], id: "tool-draft", slug: "crm-a-confirmer", availabilityStatus: "draft", solutionIds: [] };
assert.deepEqual(getPublicTools([draftTool]), [], "Draft business tools never enter public views");
assert.ok(validateContentGraph({ tools: [{ ...businessTools[0], solutionIds: ["missing-solution"] }] }).some((error) => error.includes("Unknown solution missing-solution on tool")), "Unknown Solution relations on tools must fail validation");
assert.ok(validateContentGraph({ tools: [{ ...draftTool, availabilityStatus: "available" }] }).some((error) => error.includes("Available tool tool-draft must link to at least one solution")), "Available tools must be backed by at least one Solution");
assert.deepEqual(validateContentGraph({ tools: [...businessTools, { ...businessTools[0], id: "duplicate-tool", slug: "caisse" }] }).filter((error) => error.includes("Duplicate tool slug")), ["Duplicate tool slug: caisse"], "Tool slugs must remain unique");
assert.deepEqual(filterPublishedProjects([{ publicationStatus: "draft" }]), [], "Draft projects must be filtered out");

const fixtureProject = {
  id: "fixture-project", slug: "fixture-project", title: "Fixture en mémoire",
  need: "Besoin vérifiable", context: "Contexte vérifiable", intervention: "Intervention vérifiable", outcome: "Résultat vérifiable",
  solutionIds: [solutions[0].id], industryIds: [require("../data/industries.ts").industries[0].id],
  media: [
    { src: "/fixture-approved.jpg", alt: "Image autorisée", publicationApproved: true },
    { src: "/fixture-unapproved.jpg", alt: "Image sans autorisation", publicationApproved: false },
  ],
  publicationStatus: "approved",
};
const draftFixture = { ...fixtureProject, id: "fixture-draft", slug: "fixture-draft", publicationStatus: "draft" };
assert.deepEqual(getPublishedProjects([draftFixture, fixtureProject]).map((project) => project.id), ["fixture-project"], "Only explicitly approved projects are public");
assert.equal(getPublicProjectBySlug("fixture-draft", [draftFixture, fixtureProject]), undefined, "Draft detail lookup must not be public");
assert.equal(getPublicProjectBySlug("fixture-project", [draftFixture, fixtureProject]).media.length, 1, "Media without publication approval must be removed from the public project");
assert.deepEqual(getGeneratedProjectPages([draftFixture, fixtureProject]), [{ slug: "fixture-project" }], "Only approved projects generate detail routes");
assert.deepEqual(getProjectSitemapPaths([]), [], "No approved projects means no project sitemap entries");
assert.deepEqual(getProjectSitemapPaths([draftFixture]), [], "Draft projects never enter the sitemap");
assert.deepEqual(getProjectSitemapPaths([fixtureProject]), ["/projets/"], "An approved in-memory project enables the hub; detail sitemap entries wait until a detail route is buildable");

const industry = require("../data/industries.ts").industries[0];
const relatedSolutions = solutions.map((solution) => solution.id === fixtureProject.solutionIds[0]
  ? { ...solution, projectIds: [fixtureProject.id] }
  : solution);
const relatedIndustries = require("../data/industries.ts").industries.map((item) => item.id === industry.id
  ? { ...item, projectIds: [fixtureProject.id] }
  : item);
assert.deepEqual(validateContentGraph({ solutions: relatedSolutions, industries: relatedIndustries, projects: [fixtureProject] }), [], "Valid approved in-memory graph passes validation");
assert.ok(validateContentGraph({ projects: [{ ...fixtureProject, solutionIds: ["missing-solution"] }] }).some((error) => error.includes("Unknown solution missing-solution")), "Unknown Solution relation must fail validation");
assert.ok(validateContentGraph({ projects: [{ ...fixtureProject, industryIds: ["missing-industry"] }] }).some((error) => error.includes("Unknown industry missing-industry")), "Unknown Industry relation must fail validation");
const duplicateFixture = { ...fixtureProject };
assert.ok(validateContentGraph({ projects: [fixtureProject, duplicateFixture] }).some((error) => error.includes("Duplicate project id")), "Duplicate project IDs must fail validation");
assert.ok(validateContentGraph({ projects: [fixtureProject, { ...duplicateFixture, id: "another-project" }] }).some((error) => error.includes("Duplicate project slug")), "Duplicate project slugs must fail validation");

const hypothesis = { offers: [{ kind: "subscription", monthlyFrom: 1 }], validated: false };
assert.equal(getPublishablePricing(hypothesis), null, "Unvalidated pricing must not be exposed to public UI");
const validated = { offers: [{ kind: "quote" }], validated: true };
assert.equal(getPublishablePricing(validated)?.validated, true);
assert.deepEqual(getPublicSolutions().map((solution) => solution.pricing), solutions.map((solution) => getPublishablePricing(solution.pricing)));

console.log(`PASS: ${require("../data/solutions.ts").solutions.length} solutions, ${require("../data/industries.ts").industries.length} industries, ${businessTools.length} business tools, ${projects.length} projects; IDs, slugs, relations, canonicalPath, draft and pricing guards.`);
