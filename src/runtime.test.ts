import { router, getMatch, escapeUrlPathRegExp, getPathRegex } from "./runtime";
import { routes } from "./test-utils";

describe("escapeRegExp", () => {
  it.each(routes)("escapes %s", (path) =>
    expect(escapeUrlPathRegExp(path)).toMatchSnapshot()
  );
});

describe("getPathRegex", () => {
  it.each(routes)("escapes %s", (path) =>
    expect(getPathRegex(path)).toMatchSnapshot()
  );

  describe("static routes", () => {
    it("matches", () => {
      let route;

      route = "/";
      expect(getPathRegex(route).test(route)).toEqual(true);
      expect(getPathRegex(route).test("/foo")).toEqual(false);

      route = "/foo";
      expect(getPathRegex(route).test(route)).toEqual(true);
      expect(getPathRegex(route).test(route + "/")).toEqual(true);
      expect(getPathRegex(route).test("/")).toEqual(false);

      route = "/foo/bar";
      expect(getPathRegex(route).test(route)).toEqual(true);
      expect(getPathRegex(route).test(route + "/")).toEqual(true);
      expect(getPathRegex(route).test("/foo")).toEqual(false);
    });
  });

  describe("dynamic routes", () => {
    it("matches", () => {
      let route;

      route = "/[foo]";
      expect(getPathRegex(route).test("/foo")).toEqual(true);
      expect(getPathRegex(route).test("/bar")).toEqual(true);
      expect(getPathRegex(route).test("/bar/")).toEqual(true);
      expect(getPathRegex(route).test("/")).toEqual(false);
      expect(getPathRegex(route).test("/bar/foo")).toEqual(false);

      route = "/[foo]/[bar]";
      expect(getPathRegex(route).test("/foo/bar")).toEqual(true);
      expect(getPathRegex(route).test("/bar/baz")).toEqual(true);
      expect(getPathRegex(route).test("/bar/baz/")).toEqual(true);
      expect(getPathRegex(route).test("/foo")).toEqual(false);
      expect(getPathRegex(route).test("/foo/")).toEqual(false);
      expect(getPathRegex(route).test("/foo/bar/baz")).toEqual(false);

      route = "/[foo]/[bar]/[baz]";
      expect(getPathRegex(route).test("/foo/bar/baz")).toEqual(true);
      expect(getPathRegex(route).test("/bar/baz/foo")).toEqual(true);
      expect(getPathRegex(route).test("/bar/baz/foo/")).toEqual(true);
      expect(getPathRegex(route).test("/foo/bar")).toEqual(false);
      expect(getPathRegex(route).test("/foo/bar/baz/foo")).toEqual(false);

      route = "/foos/[foo]/bars/[bar]/bazs/[baz]";
      expect(getPathRegex(route).test("/foos/1/bars/2/bazs/3")).toEqual(true);
      expect(getPathRegex(route).test("/bar/baz/foo")).toEqual(false);
    });

    it("extracts query parameters", () => {
      let route;

      route = "/[foo]";
      expect(getPathRegex(route).exec("/bar")?.groups).toEqual({
        foo: "bar",
      });

      route = "/[foo]/[bar]";
      expect(getPathRegex(route).exec("/bar/baz")?.groups).toEqual({
        bar: "baz",
        foo: "bar",
      });

      route = "/[foo]/[bar]/[baz]";
      expect(getPathRegex(route).exec("/1/2/3")?.groups).toEqual({
        bar: "2",
        baz: "3",
        foo: "1",
      });

      route = "/foos/[foo]/bars/[bar]/bazs/[baz]";
      expect(getPathRegex(route).exec("/foos/1/bars/2/bazs/3")?.groups).toEqual(
        {
          bar: "2",
          baz: "3",
          foo: "1",
        }
      );
    });
  });

  describe("catch all routes", () => {
    it("matches", () => {
      const route = "/post/[...slug]";
      expect(getPathRegex(route).test("/post/a")).toEqual(true);
      expect(getPathRegex(route).test("/post/a/")).toEqual(true);
      expect(getPathRegex(route).test("/post/a/b")).toEqual(true);
      expect(getPathRegex(route).test("/post/a/b/c")).toEqual(true);
      expect(getPathRegex(route).test("/post/a/b/c/")).toEqual(true);
      expect(getPathRegex(route).test("/post")).toEqual(false);
      expect(getPathRegex(route).test("/post/")).toEqual(false);
    });

    it("extracts query parameters", () => {
      const route = "/post/[...slug]";
      expect(getPathRegex(route).exec("/post/a")?.groups).toEqual({
        slug: "a",
      });
      expect(getPathRegex(route).exec("/post/a/")?.groups).toEqual({
        slug: "a/",
      });
      expect(getPathRegex(route).exec("/post/a/b")?.groups).toEqual({
        slug: "a/b",
      });
      expect(getPathRegex(route).exec("/post/a/b/c")?.groups).toEqual({
        slug: "a/b/c",
      });
      expect(getPathRegex(route).exec("/post/a/b/c/")?.groups).toEqual({
        slug: "a/b/c/",
      });
    });
  });

  describe("optional catch all routes", () => {
    it("matches", () => {
      const route = "/post/[[...slug]]";
      expect(getPathRegex(route).test("/post/a")).toEqual(true);
      expect(getPathRegex(route).test("/post/a/")).toEqual(true);
      expect(getPathRegex(route).test("/post/a/b")).toEqual(true);
      expect(getPathRegex(route).test("/post/a/b/c")).toEqual(true);
      expect(getPathRegex(route).test("/post/a/b/c/")).toEqual(true);
      expect(getPathRegex(route).test("/post")).toEqual(true);
      expect(getPathRegex(route).test("/post/")).toEqual(true);
    });

    it("extracts query parameters", () => {
      const route = "/post/[[...slug]]";
      expect(getPathRegex(route).exec("/post/a")?.groups).toEqual({
        slug: "/a",
      });
      expect(getPathRegex(route).exec("/post/a/")?.groups).toEqual({
        slug: "/a/",
      });
      expect(getPathRegex(route).exec("/post/a/b")?.groups).toEqual({
        slug: "/a/b",
      });
      expect(getPathRegex(route).exec("/post/a/b/c")?.groups).toEqual({
        slug: "/a/b/c",
      });
      expect(getPathRegex(route).exec("/post/a/b/c/")?.groups).toEqual({
        slug: "/a/b/c/",
      });
      expect(getPathRegex(route).exec("/post")?.groups).toEqual({
        slug: "",
      });
      expect(getPathRegex(route).exec("/post/")?.groups).toEqual({
        slug: "/",
      });
    });
  });

  describe("dynamic, catch all, optional catch all routes", () => {
    it("matches", () => {
      const route = "/foo/[foo]/bar/[...bar]/post/[[...slug]]";
      expect(getPathRegex(route).test("/foo/1/bar/1/2/post/a")).toEqual(true);
    });

    it("extracts query parameters", () => {
      const route = "/foo/[foo]/bar/[...bar]/post/[[...slug]]";
      expect(getPathRegex(route).exec("/foo/1/bar/1/2/post/a")?.groups).toEqual(
        {
          foo: "1",
          bar: "1/2",
          slug: "/a",
        }
      );
    });
  });
});

describe("getMatch", () => {
  it("generates route matcher", () => {
    const path = "/foo/[foo]/bar/[...bar]/post/[[...slug]]";
    const match = getMatch(path);
    expect(match("/foo/1/bar/1/2/post/a/b/c")).toEqual({
      match: true,
      params: {
        bar: ["1", "2"],
        foo: "1",
        slug: ["a", "b", "c"],
      },
    });
    expect(match("/foo/1/bar/1/2/post")).toEqual({
      match: true,
      params: {
        bar: ["1", "2"],
        foo: "1",
        slug: [],
      },
    });
    expect(match("/foo/1/bar/1/2/post/")).toEqual({
      match: true,
      params: {
        bar: ["1", "2"],
        foo: "1",
        slug: [],
      },
    });
    expect(match("/foo/")).toEqual({
      match: false,
      params: {},
    });
  });
});

describe("Router", () => {
  it(".match", () => {
    const filepath = "/foo/[foo].ts";
    const handler = jest.fn();
    const r = router({ [filepath]: handler });
    expect(r.match("/foo/1")).toEqual({
      handler,
      params: {
        foo: "1",
      },
      pathname: "/foo/[foo]",
    });
  });
});
