import { describe, expect, it } from "vitest";
import { buildAlternates, buildCanonical, buildMetadata } from "./metadata";
describe("SEO helpers", () => {
  it("creates absolute canonical URLs", () => {
    expect(buildCanonical("/vi/du-an/panoma")).toMatch(
      /^https?:\/\/[^/]+\/vi\/du-an\/panoma$/,
    );
  });
  it("builds reciprocal language alternatives and x-default", () => {
    const a = buildAlternates("/vi/du-an/panoma", "/en/properties/panoma");
    expect(a.languages.vi).toContain("/vi/du-an/panoma");
    expect(a.languages.en).toContain("/en/properties/panoma");
    expect(a.languages["x-default"]).toBe(a.languages.vi);
  });
  it("marks operational pages noindex when requested", () => {
    const m = buildMetadata({
      title: "Search",
      description: "Results",
      locale: "vi",
      path: "/vi/tim-kiem",
      alternatePath: "/en/search",
      index: false,
    });
    expect(m.robots).toMatchObject({ index: false, follow: false });
  });
});
