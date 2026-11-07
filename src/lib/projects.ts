import { getCollection, type CollectionEntry } from "astro:content";
import { getImage } from "astro:assets";
import type { CarouselImage } from "@/components/ProjectCarousel";
import { sortByOrder } from "./project-order";

export type Project = CollectionEntry<"projects">;

export async function getProjects(): Promise<Project[]> {
  return sortByOrder(await getCollection("projects"));
}

export function getProjectHref(project: Project): string {
  return `/projects/${project.id}`;
}

// The carousel is a React island, which can't use Astro's <Image>, so images are
// optimized here at build time and handed to it as plain URLs.
export async function getCarouselImages(project: Project): Promise<CarouselImage[]> {
  return Promise.all(
    project.data.images.map(async ({ src, alt, label }) => {
      const optimized = await getImage({
        src,
        format: "webp",
        width: 1920,
        widths: [640, 1280, 1920],
      });
      return { src: optimized.src, srcSet: optimized.srcSet.attribute, alt, label };
    }),
  );
}
