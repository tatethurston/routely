interface Route {
  pathname: string;
  query: Record<string, string | string[]> | unknown;
}

export class Router<Routes extends Route[]> {
  routes: Routes | any;

  constructor(routes: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.routes = routes;
  }
}
