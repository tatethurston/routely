import { routeFromFilepath } from "./utils";

export const filepaths = [
  "/404.ts",
  "/[foo].ts",
  "/[foo]/[bar]/[baz].ts",
  "/[foo]/bar/[baz].ts",
  "/[foo]/bar/[baz]/foo/[bar].ts",
  "/[foo]/baz.ts",
  "/_app.ts",
  "/_debug.ts",
  "/_debug/health-check.ts",
  "/_document.ts",
  "/_error.ts",
  "/_error/index.ts",
  "/api/[[...segments]].ts",
  "/api/[...segments].ts",
  "/api/bar.ts",
  "/foo/[slug].ts",
  "/index.ts",
  "/not-found.ts",
  "/settings/bars/[bar].ts",
  "/settings/bars/[bar]/baz.ts",
  "/settings/foo.ts",
  "/settings/index.ts",
];

export const routes = filepaths.map(routeFromFilepath);
