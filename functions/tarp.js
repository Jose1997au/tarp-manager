export async function onRequest(context) {
  const { request, env, waitUntil } = context;
  const url = new URL(request.url);

  const tarpID = url.searchParams.get("id");
  if (!tarpID) {
    return new Response("Missing tarp ID" + env.DISCORD_WEBHOOK_URL, { status: 400 });
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

  return context.next();
}
