import { getRoutes, getQueryType } from "./utils";

/**
 * Escapes RegExp control characters from a path segment
 * https://stackoverflow.com/questions/4669692/valid-characters-for-directory-part-of-a-url-for-short-links
 */
export function escapeUrlPathRegExp(str: string): string {
  return str.replace(/[*+$()//]/g, "\\$&");
}

export function getPathRegex(path: string): RegExp {
  const re = escapeUrlPathRegExp(path)
    // optional catch all
    .replaceAll(/\\\/\[\[\.\.\.(.+?)\]\]/g, "(?<$1>.*)")
    // catch all
    .replaceAll(/\[\.\.\.(.+?)\]/g, "(?<$1>.+)")
    // dynamic
    .replaceAll(/\[(.+?)\]/g, "(?<$1>[^/]+)");

  return new RegExp(`^${re}/*$`);
}

type Match = (path: string) => {
  match: boolean;
  params: Record<string, string | string[]>;
};

export function getMatch(pathname: string): Match {
  const query = getQueryType(pathname);
  const re = getPathRegex(pathname);

  return (path: string) => {
    const match = re.exec(path);
    if (!match) {
      return { match: false, params: {} };
    }

    const params = Object.entries(query).reduce<
      Record<string, string | string[]>
    >((acc, [name, _type]) => {
      if (_type === "catch-all" || _type === "optional-catch-all") {
        // normalize matches from regex that may be:
        // '', '/', to []
        // and '/a', '/a/b/c/ to ['a'] and ['a', 'b', 'c']
        acc[name] = match.groups?.[name].split("/").filter(Boolean) ?? [];
      } else {
        acc[name] = match.groups?.[name] ?? "";
      }
      return acc;
    }, {});
    return { match: true, params };
  };
}

interface Route {
  pathname: string;
  query: Record<string, string | string[]> | unknown;
}

type Manifest = Record<string, unknown>;

type RouteMatcher = Record<string, Route & { match: Match }>;

interface RouteMatch<R extends Route, M extends Manifest> {
  handler: M[string];
  pathname: R["pathname"];
  params: R["query"];
}

interface Router<R extends Route, M extends Manifest> {
  match: (path: string) => RouteMatch<R, M> | undefined;
}

export function Router<R extends Route, M extends Manifest>(
  manifest: M
): Router<R, M> {
  const filepaths = Object.keys(manifest);
  const routes = getRoutes(filepaths);
  const router = routes.reduce<RouteMatcher>((acc, route) => {
    acc[route.pathname] = {
      ...route,
      match: getMatch(route.pathname),
    };
    return acc;
  }, {});

  return {
    match: (path) => {
      for (const route of routes) {
        const re = router[route.pathname].match(path);
        if (re.match) {
          return {
            handler: manifest[route.filepath] as M[string],
            pathname: route.pathname,
            params: re.params,
          };
        }
      }
      return undefined;
    },
  };
}
