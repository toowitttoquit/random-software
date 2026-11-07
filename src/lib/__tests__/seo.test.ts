import { describe, expect, it } from "vitest";
import { formatPageTitle, getCanonicalUrl } from "../seo";

describe("formatPageTitle", () => {
  it("appends the site name once to a page title", () => {
    expect(formatPageTitle("Manifesto")).toBe("Manifesto | Random Software");
  });

  it("returns just the site name when a page has no title", () => {
    expect(formatPageTitle()).toBe("Random Software");
  });

  it("treats an empty title as no title", () => {
    expect(formatPageTitle("")).toBe("Random Software");
  });
});

describe("getCanonicalUrl", () => {
  it("removes the .html extension from a page path", () => {
    expect(getCanonicalUrl("/manifesto.html")).toBe("https://www.random-software.com/manifesto");
  });

  it("keeps nested paths intact", () => {
    expect(getCanonicalUrl("/projects/taru.html")).toBe("https://www.random-software.com/projects/taru");
  });

  it("maps the homepage file to the site root", () => {
    expect(getCanonicalUrl("/index.html")).toBe("https://www.random-software.com/");
  });

  it("removes a trailing slash", () => {
    expect(getCanonicalUrl("/manifesto/")).toBe("https://www.random-software.com/manifesto");
  });
});
