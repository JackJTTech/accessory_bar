import { createClient } from "urql";
import { createScript } from "../../graphql/mutations/createScript";

const DEV = process.env.NODE_ENV !== "production";
const { HOST } = process.env;

export async function installScriptTags(ctx) {
  const { accessToken, shop } = ctx.session;

  // Create urql client
  const client = createClient({
    url: `https://${shop}/admin/api/2020-07/graphql.json`,
    fetchOptions: {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
    },
  });
  console.log(`Installing on ${HOST}`);
  // Send request
  const res = await client
    .query(createScript, {
      displayScope: "ONLINE_STORE",
      src: DEV ? `${HOST}/index.min.js` : process.env.SHOPFRONT_SCRIPT_SRC,
    })
    .toPromise();

  if (!res.error) {
    console.log(`> ${shop} - Script tag successfully installed`);
  } else {
    console.error(`! ${shop} - Script tag installation failure`);
  }
}
