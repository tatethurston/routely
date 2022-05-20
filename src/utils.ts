import { readdirSync, statSync } from "fs";
import { join, parse } from "path";

const DYNAMIC_SEGMENT_RE = /\[(.*?)\]/g;

// istanbul ignore next: too much mocking to be valuable
export function findFiles(entry: string): string[] {
  return readdirSync(entry).flatMap((file) => {
    const filepath = join(entry, file);
    if (
      statSync(filepath).isDirectory() &&
      !filepath.includes("node_modules")
    ) {
      return findFiles(filepath);
    }
    return filepath;
  });
}

export interface Route {
  filepath: string;
  pathname: string;
  query: Record<string, QueryType>;
}

export const isTS = (routes: Route[]) =>
  routes.some((route) => route.filepath.includes(".ts"));

export type QueryType =
  | "static"
  | "dynamic"
  | "catch-all"
  | "optional-catch-all";

export function getSegmentType(segment: string): QueryType {
  if (segment.startsWith("[[")) {
    return "optional-catch-all";
  } else if (segment.startsWith("[...")) {
    return "catch-all";
  } else if (segment.startsWith("[")) {
    return "dynamic";
  }
  return "static";
}

export function getQueryType(path: string): Record<string, QueryType> {
  const segments = path.match(DYNAMIC_SEGMENT_RE) ?? [];
  const query = segments.reduce<Record<string, QueryType>>((acc, cur) => {
    const param = cur.replace(/\[/g, "").replace(/\]/g, "").replace("...", "");
    const queryType = getSegmentType(cur);
    acc[param] = queryType;
    return acc;
  }, {});
  return query;
}

export function routeFromFilepath(file: string): string {
  return file.replace(parse(file).ext, "").replace(/index$/, "");
}

const segmentOrder = ["static", "dynamic", "catch-all", "optional-catch-all"];

export function getRoutes(files: string[]): Route[] {
  return files
    .map((file) => {
      const pathname = routeFromFilepath(file);
      const query = getQueryType(pathname);

      return {
        filepath: file,
        pathname,
        query,
      };
    })
    .sort((a, b) => {
      const aSegments = a.pathname.split("/").filter(Boolean);
      const bSegments = b.pathname.split("/").filter(Boolean);
      for (let idx = 0; idx <= aSegments.length; idx++) {
        if (idx >= aSegments.length && idx >= bSegments.length) {
          return 0;
        } else if (idx >= aSegments.length) {
          return -1;
        } else if (idx >= bSegments.length) {
          return 1;
        }
        const a = segmentOrder.indexOf(getSegmentType(aSegments[idx]));
        const b = segmentOrder.indexOf(getSegmentType(bSegments[idx]));
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
      }
      // istanbul ignore next: unreachable
      return 0;
    });
}
