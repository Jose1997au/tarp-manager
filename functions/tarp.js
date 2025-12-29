export async function onRequest(context) {
  try {
    const { request, env, waitUntil } = context;
    const url = new URL(request.url);

    const tarpID = url.searchParams.get("id");
    const fromScan = url.searchParams.has("scan");

    // Not a scan? Just serve the page.
    if (!fromScan) return context.next();

    if (!tarpID) {
      return new Response("Missing tarp ID", { status: 400 });
    }

    const ip =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("x-forwarded-for") ||
      "unknown";

    const uaRaw = request.headers.get("User-Agent") || "unknown";
    const ua = uaRaw.length > 900 ? uaRaw.slice(0, 900) + "…" : uaRaw;

    const cf = request.cf || {};
    const loc = `${cf.city || "?"}, ${cf.region || "?"}, ${cf.country || "?"}`;

    // Extra guard: avoid invalid/empty webhook URLs crashing fetch()
    const hook = env.DISCORD_WEBHOOK_URL;
    const hookOk = typeof hook === "string" && hook.startsWith("https://");

    if (hookOk) {
      waitUntil((async () => {
        try {
          const res = await fetch(hook, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              embeds: [{
                title: "NFC Scan",
                color: 0x3498db,
                fields: [
                  { name: "Tarp ID", value: tarpID || "unknown", inline: true },
                  { name: "Location", value: loc || "unknown", inline: true },
                  { name: "IP", value: ip || "unknown", inline: true },
                  { name: "User Agent", value: ua || "unknown", inline: false },
                ],
                footer: { text: "Tarp Manager • NFC Scan" },
                timestamp: new Date().toISOString(),
              }]
            })
          });

          if (!res.ok) {
            console.log("Discord rejected:", res.status, await res.text());
          }
        } catch (e) {
          console.log("Discord fetch threw:", e?.message || e);
        }
      })());
    } else {
      console.log("Webhook missing/invalid:", hook);
    }

    return context.next();
  } catch (e) {
    // This turns the mystery 1101 into an actual readable error
    return new Response(
      `Function crashed: ${e?.stack || e?.message || String(e)}`,
      { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } }
    );
  }
}
