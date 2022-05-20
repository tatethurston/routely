import { getQueryType } from "./utils";

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
