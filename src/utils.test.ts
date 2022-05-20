import { filepaths } from "./test-utils";
import { getRoutes, isTS, Route } from "./utils";

describe("isTS", () => {
  it("detects based on file extension", () => {
    expect(isTS([{ filepath: "foo.ts" } as Route])).toEqual(true);
    expect(isTS([{ filepath: "foo.js" } as Route])).toEqual(false);
  });
});

describe("getRoutes", () => {
  it("processes and orders route filepaths", () => {
    expect(getRoutes(filepaths)).toMatchInlineSnapshot(`
      Array [
        Object {
          "filepath": "routes/index.ts",
          "pathname": "/",
          "query": Object {},
        },
        Object {
          "filepath": "routes/404.ts",
          "pathname": "/404",
          "query": Object {},
        },
        Object {
          "filepath": "routes/_app.ts",
          "pathname": "/_app",
          "query": Object {},
        },
        Object {
          "filepath": "routes/_debug.ts",
          "pathname": "/_debug",
          "query": Object {},
        },
        Object {
          "filepath": "routes/_document.ts",
          "pathname": "/_document",
          "query": Object {},
        },
        Object {
          "filepath": "routes/_error.ts",
          "pathname": "/_error",
          "query": Object {},
        },
        Object {
          "filepath": "routes/_error/index.ts",
          "pathname": "/_error/",
          "query": Object {},
        },
        Object {
          "filepath": "routes/not-found.ts",
          "pathname": "/not-found",
          "query": Object {},
        },
        Object {
          "filepath": "routes/settings/index.ts",
          "pathname": "/settings/",
          "query": Object {},
        },
        Object {
          "filepath": "routes/_debug/health-check.ts",
          "pathname": "/_debug/health-check",
          "query": Object {},
        },
        Object {
          "filepath": "routes/api/bar.ts",
          "pathname": "/api/bar",
          "query": Object {},
        },
        Object {
          "filepath": "routes/settings/foo.ts",
          "pathname": "/settings/foo",
          "query": Object {},
        },
        Object {
          "filepath": "routes/settings/bars/[bar].ts",
          "pathname": "/settings/bars/[bar]",
          "query": Object {
            "bar": "dynamic",
          },
        },
        Object {
          "filepath": "routes/settings/bars/[bar]/baz.ts",
          "pathname": "/settings/bars/[bar]/baz",
          "query": Object {
            "bar": "dynamic",
          },
        },
        Object {
          "filepath": "routes/foo/[slug].ts",
          "pathname": "/foo/[slug]",
          "query": Object {
            "slug": "dynamic",
          },
        },
        Object {
          "filepath": "routes/api/[...segments].ts",
          "pathname": "/api/[...segments]",
          "query": Object {
            "segments": "catch-all",
          },
        },
        Object {
          "filepath": "routes/api/[[...segments]].ts",
          "pathname": "/api/[[...segments]]",
          "query": Object {
            "segments": "optional-catch-all",
          },
        },
        Object {
          "filepath": "routes/[foo].ts",
          "pathname": "/[foo]",
          "query": Object {
            "foo": "dynamic",
          },
        },
        Object {
          "filepath": "routes/[foo]/baz.ts",
          "pathname": "/[foo]/baz",
          "query": Object {
            "foo": "dynamic",
          },
        },
        Object {
          "filepath": "routes/[foo]/bar/[baz].ts",
          "pathname": "/[foo]/bar/[baz]",
          "query": Object {
            "baz": "dynamic",
            "foo": "dynamic",
          },
        },
        Object {
          "filepath": "routes/[foo]/bar/[baz]/foo/[bar].ts",
          "pathname": "/[foo]/bar/[baz]/foo/[bar]",
          "query": Object {
            "bar": "dynamic",
            "baz": "dynamic",
            "foo": "dynamic",
          },
        },
        Object {
          "filepath": "routes/[foo]/[bar]/[baz].ts",
          "pathname": "/[foo]/[bar]/[baz]",
          "query": Object {
            "bar": "dynamic",
            "baz": "dynamic",
            "foo": "dynamic",
          },
        },
      ]
    `);
  });
});
