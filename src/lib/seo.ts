export const SITE_NAME = "Random Software";

export const SITE_URL = "https://www.random-software.com";

export const DEFAULT_DESCRIPTION =
  "Software with something to say. A collection of intentional tools and experiments by a builder who believes software should serve people, not scale.";

export function formatPageTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME;
}

// The static build reports paths like /manifesto.html, but the public URLs have no extension.
export function getCanonicalUrl(pathname: string): string {
  const publicPath = pathname.replace(/(\/index)?\.html$/, "").replace(/\/$/, "");
  return `${SITE_URL}${publicPath || "/"}`;
}
