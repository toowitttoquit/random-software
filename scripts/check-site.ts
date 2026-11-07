import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import {
  checkPageSeo,
  findBrokenInternalLinks,
  findExternalLinks,
  findRemovedUrls,
  findUntrackedUrls,
  htmlFileToUrl,
  isCheckableLink,
  isDeadStatus,
} from "./site-checks.ts";

const BUILD_DIRECTORY = "dist";
const LINK_TIMEOUT_MS = 10_000;

interface VercelConfig {
  redirects: { source: string }[];
}

function listFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

function readJson<Shape>(path: string): Shape {
  return JSON.parse(readFileSync(path, "utf8"));
}

async function getLinkStatus(url: string): Promise<number | null> {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(LINK_TIMEOUT_MS),
    });
    return response.status;
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  const files = listFiles(BUILD_DIRECTORY).map((path) => relative(BUILD_DIRECTORY, path));
  const htmlFiles = files.filter((file) => file.endsWith(".html"));
  const pageFiles = htmlFiles.filter((file) => file !== "404.html");

  const builtUrls = pageFiles.map(htmlFileToUrl);
  const expectedUrls = readJson<string[]>("site-urls.json");
  const redirectSources = readJson<VercelConfig>("vercel.json").redirects.map((redirect) => redirect.source);
  const existingPaths = new Set([...files.map((file) => `/${file}`), ...builtUrls]);

  const problems: string[] = [];

  for (const url of findRemovedUrls(expectedUrls, builtUrls, redirectSources)) {
    problems.push(`${url} no longer exists. Add a redirect for it to vercel.json, then remove it from site-urls.json.`);
  }
  for (const url of findUntrackedUrls(expectedUrls, builtUrls)) {
    problems.push(`${url} is a new page. Add it to site-urls.json so it's protected from being removed by accident.`);
  }

  const externalLinks = new Set<string>();
  for (const file of htmlFiles) {
    const url = htmlFileToUrl(file);
    const html = readFileSync(join(BUILD_DIRECTORY, file), "utf8");

    if (file !== "404.html") {
      problems.push(...checkPageSeo(url, html).map((problem) => `${url} ${problem}.`));
    }
    for (const path of findBrokenInternalLinks(html, existingPaths)) {
      problems.push(`${url} links to ${path}, which doesn't exist.`);
    }
    for (const link of findExternalLinks(html)) {
      externalLinks.add(link);
    }
  }

  const checkableLinks = [...externalLinks].filter(isCheckableLink);
  const statuses = await Promise.all(checkableLinks.map(async (link) => ({ link, status: await getLinkStatus(link) })));
  for (const { link, status } of statuses) {
    if (status !== null && isDeadStatus(status)) {
      problems.push(`External link ${link} is dead (${status}).`);
    } else if (status === null) {
      console.warn(`Couldn't reach ${link}, so it wasn't checked.`);
    }
  }

  if (problems.length > 0) {
    console.error(`\nSite check found ${problems.length} problem(s):\n`);
    for (const problem of problems) {
      console.error(`  - ${problem}`);
    }
    process.exit(1);
  }

  console.log(`Site check passed: ${builtUrls.length} pages, ${checkableLinks.length} external links.`);
}

await main();
