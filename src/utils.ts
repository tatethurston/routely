import { readdirSync, statSync } from "fs";
import { join, parse } from "path";

const DYNAMIC_SEGMENT_RE = /\[(.*?)\]/g;

export const ROUTES_DIRECTORY_NAME = "routes";

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
  return file
    .replace(ROUTES_DIRECTORY_NAME, "")
    .replace(parse(file).ext, "")
    .replace(/index$/, "");
}
