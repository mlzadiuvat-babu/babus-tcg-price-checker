export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim();
  if (!q) return Response.json({ error: "Enter a card name or number." }, { status: 400 });
  if (q.length > 100) return Response.json({ error: "Search is too long." }, { status: 400 });
  // Escape characters that have special meaning in the Pokémon TCG API query language.
  const safe = q.replace(/[{}\[\]]/g, " ").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const api = new URL("https://api.pokemontcg.io/v2/cards");
  api.searchParams.set("q", `name:${safe}* OR number:${safe} OR id:${safe}`);
  api.searchParams.set("pageSize", "24");
  api.searchParams.set("orderBy", "-set.releaseDate");
  const headers = {};
  if (env.POKEMON_TCG_API_KEY) headers["X-Api-Key"] = env.POKEMON_TCG_API_KEY;
  try {
    const upstream = await fetch(api, { headers });
    const body = await upstream.json();
    if (!upstream.ok) return Response.json({ error: body.error || "Card database request failed. Check API key and rate limits." }, { status: upstream.status });
    return Response.json(body, { headers: { "Cache-Control": "public, max-age=180" } });
  } catch {
    return Response.json({ error: "Unable to reach the card database." }, { status: 502 });
  }
}
