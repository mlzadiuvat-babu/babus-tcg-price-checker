
export async function onRequestGet({ request, env }) {
  const q = (new URL(request.url).searchParams.get("q") || "").trim();

  if (!q) {
    return json({ error: "Please enter a card name or number." }, 400);
  }

  if (q.length > 80) {
    return json({ error: "Search query is too long." }, 400);
  }

  const headers = {};
  if (env.POKEMON_TCG_API_KEY) {
    headers["X-Api-Key"] = env.POKEMON_TCG_API_KEY;
  }

  try {
    const api = new URL("https://api.pokemontcg.io/v2/cards");
    const safe = q.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

    api.searchParams.set("q", `name:"${safe}" OR number:"${safe}"`);
    api.searchParams.set("pageSize", "24");
    api.searchParams.set("orderBy", "-set.releaseDate");

    const response = await fetch(api, { headers });
    if (!response.ok) throw new Error("Card database request failed.");

    const data = await response.json();

    let rate = null;
    try {
      const fx = await fetch(
        "https://api.frankfurter.app/latest?from=USD&to=PHP"
      );
      if (fx.ok) {
        rate = (await fx.json()).rates?.PHP ?? null;
      }
    } catch (_) {}

    const cards = (data.data || []).map(card => {
      const prices = Object.values(card.tcgplayer?.prices || {})
        .map(v => v?.market)
        .filter(v => typeof v === "number" && Number.isFinite(v));

      const usd = prices.length ? Math.min(...prices) : null;

      return {
        name: card.name,
        set: card.set?.name || "",
        number: card.number || "",
        rarity: card.rarity || "",
        image: card.images?.large || card.images?.small || "",
        pricePHP:
          usd !== null && rate !== null
            ? Math.round(usd * rate * 100) / 100
            : null
      };
    });

    return json({ cards, rate });
  } catch (error) {
    return json({
      error: error.message || "Unable to search right now."
    }, 502);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60"
    }
  });
}
