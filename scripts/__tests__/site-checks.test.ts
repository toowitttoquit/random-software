import { describe, expect, it } from "vitest";
import {
  checkPageSeo,
  findBrokenInternalLinks,
  findExternalLinks,
  findRemovedUrls,
  findUntrackedUrls,
  htmlFileToUrl,
  isCheckableLink,
  isDeadStatus,
} from "../site-checks";

function page(head: string, body = "<h1>Heading</h1>"): string {
  return `<html><head>${head}</head><body>${body}</body></html>`;
}

const VALID_HEAD = `
  <title>Manifesto | Random Software</title>
  <meta name="description" content="A description" />
  <link rel="canonical" href="https://www.random-software.com/manifesto" />
`;

describe("htmlFileToUrl", () => {
  it("maps the homepage file to the root", () => {
    expect(htmlFileToUrl("index.html")).toBe("/");
  });

  it("removes the extension from nested pages", () => {
    expect(htmlFileToUrl("projects/taru.html")).toBe("/projects/taru");
  });
});

describe("findRemovedUrls", () => {
  it("flags a URL that disappeared without a redirect", () => {
    expect(findRemovedUrls(["/old"], [], [])).toEqual(["/old"]);
  });

  it("allows a removed URL that has a redirect", () => {
    expect(findRemovedUrls(["/old"], [], ["/old"])).toEqual([]);
  });

  it("allows a URL that still exists", () => {
    expect(findRemovedUrls(["/page"], ["/page"], [])).toEqual([]);
  });
});

describe("findUntrackedUrls", () => {
  it("flags a built page missing from the URL list", () => {
    expect(findUntrackedUrls(["/page"], ["/page", "/new"])).toEqual(["/new"]);
  });
});

describe("checkPageSeo", () => {
  it("passes a complete page", () => {
    expect(checkPageSeo("/manifesto", page(VALID_HEAD))).toEqual([]);
  });

  it("flags a missing title", () => {
    const head = VALID_HEAD.replace("<title>Manifesto | Random Software</title>", "");
    expect(checkPageSeo("/manifesto", page(head))).toEqual(["has no title"]);
  });

  it("flags a title that repeats the site name", () => {
    const head = VALID_HEAD.replace("Manifesto | Random Software", "Manifesto | Random Software | Random Software");
    expect(checkPageSeo("/manifesto", page(head))[0]).toContain("repeats the site name");
  });

  it("flags a blank description", () => {
    const head = VALID_HEAD.replace("A description", " ");
    expect(checkPageSeo("/manifesto", page(head))).toEqual(["has no meta description"]);
  });

  it("flags a canonical URL ending in .html", () => {
    const head = VALID_HEAD.replace("/manifesto\"", "/manifesto.html\"");
    expect(checkPageSeo("/manifesto", page(head))[0]).toContain("has canonical");
  });

  it("flags a page with no h1", () => {
    expect(checkPageSeo("/manifesto", page(VALID_HEAD, "<h2>Heading</h2>"))).toEqual(["has 0 h1 headings instead of 1"]);
  });

  it("flags a page with two h1s", () => {
    expect(checkPageSeo("/manifesto", page(VALID_HEAD, "<h1>One</h1><h1>Two</h1>"))).toEqual([
      "has 2 h1 headings instead of 1",
    ]);
  });
});

describe("findBrokenInternalLinks", () => {
  it("flags a link to a page that doesn't exist", () => {
    expect(findBrokenInternalLinks('<a href="/gone">x</a>', new Set(["/"]))).toEqual(["/gone"]);
  });

  it("accepts a link to a page with a fragment", () => {
    expect(findBrokenInternalLinks('<a href="/page#part">x</a>', new Set(["/page"]))).toEqual([]);
  });

  it("flags a missing image in a srcset", () => {
    const html = '<img src="/a.webp" srcset="/a.webp 640w, /b.webp 1280w" />';
    expect(findBrokenInternalLinks(html, new Set(["/a.webp"]))).toEqual(["/b.webp"]);
  });

  it("ignores external and protocol-relative links", () => {
    const html = '<a href="https://example.com/x">x</a><img src="//cdn.example.com/a.png" />';
    expect(findBrokenInternalLinks(html, new Set())).toEqual([]);
  });

  it("reports a repeated broken link once", () => {
    expect(findBrokenInternalLinks('<a href="/gone">x</a><a href="/gone">y</a>', new Set())).toEqual(["/gone"]);
  });
});

describe("findExternalLinks", () => {
  it("returns links to other sites once each", () => {
    const html = '<a href="https://example.com">x</a><a href="https://example.com">y</a>';
    expect(findExternalLinks(html)).toEqual(["https://example.com"]);
  });

  it("skips links to this site and relative links", () => {
    const html = '<a href="https://www.random-software.com/build">x</a><a href="/manifesto">y</a>';
    expect(findExternalLinks(html)).toEqual([]);
  });
});

describe("isCheckableLink", () => {
  it("skips sites that block automated requests", () => {
    expect(isCheckableLink("https://www.linkedin.com/in/someone/")).toBe(false);
  });

  it("checks ordinary sites", () => {
    expect(isCheckableLink("https://github.com/someone")).toBe(true);
  });
});

describe("isDeadStatus", () => {
  it("treats 404 and 410 as dead", () => {
    expect(isDeadStatus(404)).toBe(true);
    expect(isDeadStatus(410)).toBe(true);
  });

  it("does not treat a rate limit or server error as dead", () => {
    expect(isDeadStatus(429)).toBe(false);
    expect(isDeadStatus(503)).toBe(false);
  });
});
