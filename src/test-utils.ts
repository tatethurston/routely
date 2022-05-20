import { routeFromFilepath } from "./utils";

export const filepaths = [
  "routes/404.ts",
  "routes/[foo].ts",
  "routes/[foo]/[bar]/[baz].ts",
  "routes/[foo]/bar/[baz].ts",
  "routes/[foo]/bar/[baz]/foo/[bar].ts",
  "routes/[foo]/baz.ts",
  "routes/_app.ts",
  "routes/_debug.ts",
  "routes/_debug/health-check.ts",
  "routes/_document.ts",
  "routes/_error.ts",
  "routes/_error/index.ts",
  "routes/api/[[...segments]].ts",
  "routes/api/[...segments].ts",
  "routes/api/bar.ts",
  "routes/foo/[slug].ts",
  "routes/index.ts",
  "routes/not-found.ts",
  "routes/settings/bars/[bar].ts",
  "routes/settings/bars/[bar]/baz.ts",
  "routes/settings/foo.ts",
  "routes/settings/index.ts",
];

export const routes = filepaths.map(routeFromFilepath);
