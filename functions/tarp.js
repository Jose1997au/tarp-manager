export async function onRequest({ request, env, waitUntil }) {
  const url = new URL(request.url);
  const tarpID = url.searchParams.get("id");

  if (!tarpID) {
    return new Response("Missing tarp ID", { status: 400 });
  }

  const ip =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("x-forwarded-for") ||
    "unknown";

  const ua = request.headers.get("User-Agent") || "unknown";
  const cf = request.cf || {};

  if (env.DISCORD_WEBHOOK_URL) {
    waitUntil(
      fetch(env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          content:
            `🟦 NFC Scan\n` +
            `🆔 ${tarpID}\n` +
            `🌍 ${cf.city || "?"}, ${cf.region || "?"}, ${cf.country || "?"}\n` +
            `📡 ${ip}\n` +
            `📱 ${ua}\n`
        })
      })
    );
  }

  // Continue to tarp.html
  return fetch(request);
}
