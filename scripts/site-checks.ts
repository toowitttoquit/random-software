import { load } from "cheerio";
import { SITE_NAME, SITE_URL, getCanonicalUrl } from "../src/lib/seo.ts";

export function htmlFileToUrl(relativePath: string): string {
  const withoutExtension = relativePath.replace(/\.html$/, "");
  return withoutExtension === "index" ? "/" : `/${withoutExtension}`;
}

export function findRemovedUrls(expectedUrls: string[], builtUrls: string[], redirectSources: string[]): string[] {
  return expectedUrls.filter((url) => !builtUrls.includes(url) && !redirectSources.includes(url));
}

export function findUntrackedUrls(expectedUrls: string[], builtUrls: string[]): string[] {
  return builtUrls.filter((url) => !expectedUrls.includes(url));
}

export function checkPageSeo(url: string, html: string): string[] {
  const $ = load(html);
  const problems: string[] = [];

  const title = $("title").text().trim();
  if (!title) {
    problems.push("has no title");
  } else if (title.split(SITE_NAME).length > 2) {
    problems.push(`repeats the site name in its title: "${title}"`);
  }

  if (!$('meta[name="description"]').attr("content")?.trim()) {
    problems.push("has no meta description");
  }

  const canonical = $('link[rel="canonical"]').attr("href");
  if (canonical !== getCanonicalUrl(url)) {
    problems.push(`has canonical "${canonical}" but should have "${getCanonicalUrl(url)}"`);
  }

  const headingCount = $("h1").length;
  if (headingCount !== 1) {
    problems.push(`has ${headingCount} h1 headings instead of 1`);
  }

  return problems;
}

function collectResourceUrls(html: string): string[] {
  const $ = load(html);
  const resources: string[] = [];

  $("a[href], link[href]").each((_, element) => {
    resources.push($(element).attr("href") ?? "");
  });
  $("img[src], script[src]").each((_, element) => {
    resources.push($(element).attr("src") ?? "");
  });
  $("img[srcset]").each((_, element) => {
    const candidates = ($(element).attr("srcset") ?? "").split(",");
    resources.push(...candidates.map((candidate) => candidate.trim().split(/\s+/)[0]));
  });

  return resources;
}

export function findBrokenInternalLinks(html: string, existingPaths: Set<string>): string[] {
  const internalPaths = collectResourceUrls(html)
    .filter((resource) => resource.startsWith("/") && !resource.startsWith("//"))
    .map((resource) => resource.split(/[?#]/)[0]);

  return [...new Set(internalPaths)].filter((path) => !existingPaths.has(path));
}

export function findExternalLinks(html: string): string[] {
  const $ = load(html);
  const links = $("a[href]")
    .map((_, element) => $(element).attr("href") ?? "")
    .get()
    .filter((href) => href.startsWith("http") && !href.startsWith(SITE_URL));

  return [...new Set(links)];
}

// These sites refuse automated requests, so a failure says nothing about the link.
const UNCHECKABLE_HOSTS = ["www.linkedin.com", "x.com"];

export function isCheckableLink(url: string): boolean {
  return !UNCHECKABLE_HOSTS.includes(new URL(url).hostname);
}

// Only "this page is gone" fails a build. Timeouts and rate limits are about the
// other site's mood that day, and shouldn't block publishing.
export function isDeadStatus(status: number): boolean {
  return status === 404 || status === 410;
}
