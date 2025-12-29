export async function onRequest(context) {
  const { request, env, waitUntil } = context;
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
            embeds: [
                {
                    title: "NFC Scan",
                    color: 0x3498db,
                    fields: [
                        {
                            name: "Tarp ID",
                            value: tarpID,
                            inline: true,
                        },
                        {
                            name: "Location",
                            value: `${cf.city || "?"}, ${cf.region || "?"}, ${cf.country || "?"}`,
                            inline: true,
                        },
                        {
                            name: "IP",
                            value: ip,
                            inline: true,
                        },
                        {
                            name: "User Agent",
                            value: ua,
                            inline: true,
                        }
                    ],
                    footer: {
                        text: "Tarp Manager • NFC Scan"
                    },
                    timestamp: new Date().toISOString()
                }
            ]
        })
      })
    );
  }

  return context.next();
}
