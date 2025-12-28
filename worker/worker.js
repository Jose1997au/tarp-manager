export default {
    async logScan(env, data) {
        if (!env.DISCORD_WEBHOOK_URL) return;

        const {
            tarpID,
            ip,
            userAgent,
            country,
            region,
            city,
            timestamp,
            url
        } = data;

        const content = 
            `NFC Scan\n` +
            `${timestamp}\n` +
            `${tarpID}\n` +
            `${city}, ${region}, ${country}\n` +
            `IP: ${ip}` +
            `UA: ${userAgent}\n` +
            `${url}`;

        await fetch(env.DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ content }),
        });
    },

    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        if (!url.pathname.startsWith("/tarp")) {
            return fetch(request);
        }

        const tarpID = url.searchParams.get("id");

        if (!tarpID) {
            return new Response("Missing tarp ID", {
                status: 400,
                headers: { "content-type": "text/plain; charset=utf-8" }
            });
        }

        const anon = "unknown"
        const id =
            request.headers.get("CF-Connecting-IP") ||
            request.headers.get("x-forwarded-for")  ||
            "unknown";

        const userAgent = request.headers.get("User-Agent") || anon;

        const cf = request.cf || {};
        const country = cf.country || anon;
        const region = cf.region || anon;
        const city = cf.city || anon;

        const timestamp = new Date().toISOString();

        ctx.waitUntil(
            this.logScan(env, {
                tarpID,
                id,
                userAgent,
                country,
                region,
                city,
                timestamp,
                url: url.toString(),
            })
        );

        return fetch(request);
    }
}
