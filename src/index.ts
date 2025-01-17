export class Quack extends EventTarget {
  async text(value) {
    const headers = new Headers(this.headers);
    headers.append("Content-Type", "text/plain");
    return new Response(value, { headers });
  }

  async json(value) {
    const headers = new Headers(this.headers);
    headers.append("Content-Type", "application/json");
    return new Response(JSON.stringify(value), { headers });
  }

  async proxy(request, url) {
    const headers = new Headers(this.headers);
    for (const [key, value] of request.headers.entries()) {
      // @todo which are safe to proxy
      if (key.toLowerCase() === "host") continue;
      headers.append(key, value);
    }
    const newRequest = new Request(url, { headers });
    const response = await fetch(newRequest); // @todo update host?...
    for (const [key, value] of response.headers.entries()) {
      headers.append(key, value);
    }
    return new Response(response.body, { headers });
  }

  constructor() {
    super();
    this.routes = new Array();
    this.headers = new Headers();
  }

  get fetch() {
    return this.handleFetch.bind(this);
  }

  log(message) {
    this.dispatchEvent(new CustomEvent("log", { detail: { message } }));
  }

  handleFetch(request: Request) {
    const url = new URL(request.url);
    for (const route of this.routes) {
      if (route.options.pathname && url.pathname !== route.options.pathname)
        continue;
      if (route.options.method && request.method !== route.options.method)
        continue;
      this.log(`${JSON.stringify(route.options)}: Match`);
      return route.handler(request);
    }
    this.log(`${pathname}: No Match`);
    return new Response("Not Found", { status: 404, headers: this.headers });
  }

  addRoute(options: any, handler: (request: Request) => Response) {
    this.routes.push({ options, handler });
    return this;
  }

  setHeaders(headers: Headers) {
    this.headers = headers instanceof Headers ? headers : new Headers(headers);
    return this;
  }
}
