async function logScan(env, data) {
  if (!env.DISCORD_WEBHOOK_URL) return;

  const {
    tarpID,
    ip,
    userAgent,
    country,
    region,
    city,
    timestamp,
    url,
  } = data;

  const content =
    `NFC Scan\n` +
    `${timestamp}\n` +
    `${tarpID}\n` +
    `${city}, ${region}, ${country}\n` +
    `IP: ${ip}\n` +
    `UA: ${userAgent}\n` +
    `${url}`;

  await fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

// export default {
//   async fetch(request, env, ctx) {
//     const url = new URL(request.url);

//     if (!url.pathname.startsWith("/tarp")) {
//       return fetch(request);
//     }

//     const tarpID = url.searchParams.get("id");
//     if (!tarpID) {
//       return new Response("Missing tarp ID (?id=TT-2020-A1)", {
//         status: 400,
//         headers: { "content-type": "text/plain; charset=utf-8" },
//       });
//     }

//     const ip =
//       request.headers.get("CF-Connecting-IP") ||
//       request.headers.get("x-forwarded-for") ||
//       "unknown";

//     const userAgent = request.headers.get("User-Agent") || "unknown";

//     const cf = request.cf || {};
//     const country = cf.country || "unknown";
//     const region = cf.region || "unknown";
//     const city = cf.city || "unknown";

//     const timestamp = new Date().toISOString();

//     ctx.waitUntil(
//       logScan(env, {
//         tarpID,
//         ip,
//         userAgent,
//         country,
//         region,
//         city,
//         timestamp,
//         url: url.toString(),
//       })
//     );

//     return fetch(request);
//   },
// };

export default {
  fetch() {
    return new Response("WORKER HIT ✅");
  }
};

