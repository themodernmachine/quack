# @themodernmachine/quack

Simple fetch wrapper for rapid backends

## Example

```js
import { Quack } from "@themodernmachine/quack";

const app = new Quack()
  .addRoute({ pathname: "/text", method: "GET" }, (request) =>
    app.text("Hello, World!"),
  )
  .addRoute({ pathname: "/json", method: "GET" }, (request) =>
    app.json({ message: "Hello, World!" }),
  )
  .addRoute({ pathname: "/proxy", method: "GET" }, (request) =>
    app.proxy(request, "https://api.ipify.org?format=json"),
  )
  .setHeaders(new Headers({ Test: 42 }));

app.addEventListener("log", (event) => console.log(event.detail.message));

Bun.serve(app);
```
