#!/usr/bin/env node

import { writeFileSync } from "fs";
import { join } from "path";
import { getRoutes, ROUTES_DIRECTORY_NAME, findFiles, isTS } from "./utils";
import { generate } from "./codegen";

const NEXTJS_PAGES_DIRECTORY = join(".", ROUTES_DIRECTORY_NAME);

async function main(): Promise<void> {
  const files = findFiles(NEXTJS_PAGES_DIRECTORY);
  const routes = getRoutes(files);
  const ext = isTS(routes) ? ".ts" : ".js";

  writeFileSync("router" + ext, await generate(routes));
}

void main();
