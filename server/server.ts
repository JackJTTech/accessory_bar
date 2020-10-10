import dotenv from "dotenv";
import Koa, { Context } from "koa";
import session from "koa-session";
import Router from "koa-router";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import next from "next";

dotenv.config();

const port = parseInt(process.env.PORT!, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES } = process.env;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  // Session
  server.use(session({ sameSite: "none", secure: true }, server));
  server.keys = [SHOPIFY_API_SECRET];
  // Auth
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],

      async afterAuth(ctx: Context) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });
        ctx.redirect("/");
      },
    })
  );
  // Graphql proxy
  server.use(
    graphQLProxy({
      version: ApiVersion.April20,
    })
  );
  // Routing
  router.get("(.*)", verifyRequest(), async (ctx: Context) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

export default app;
