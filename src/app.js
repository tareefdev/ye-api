const Koa = require("koa");
const cors = require("@koa/cors");
const logger = require("koa-logger");
const router = require("./routes");

const app = new Koa();

const isDev = process.env.NODE_ENV !== "production";
if (isDev) app.use(cors());

app
  .use(logger())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000);
