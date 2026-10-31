# Babu's TCG Price Checker

A mobile-friendly Cloudflare Pages website for searching Pokémon TCG cards and viewing available TCGplayer market references converted to PHP.

## Features in this version
- Search Pokémon cards by Pokémon/card name, collector number, or API card ID
- Card images, set, collector number, rarity and available TCGplayer market price
- Daily USD→PHP reference-rate conversion, with FX date shown
- Guest mode: no login required to search; collection and watchlist save in the current browser
- Optional Supabase member accounts for email/password sign-in and cloud-synced saved cards
- Responsive mobile layout
- Cloudflare Pages Function proxy for card database requests; optional API key stays server-side

## Deploy free on Cloudflare Pages
1. Create/sign in to a free Cloudflare account: https://dash.cloudflare.com/
2. Upload this folder to a GitHub repository.
3. In Cloudflare: Workers & Pages → Create → Pages → Connect to Git.
4. Set the project root to the repository root. No build command is required; output directory is `/`.
5. Optional: add `POKEMON_TCG_API_KEY` as a Cloudflare Pages secret under Settings → Variables and Secrets.
6. Deploy. Cloudflare gives you a public `*.pages.dev` address. Attach a custom domain later if desired.

## Pokémon TCG card data
The site uses the Pokémon TCG API: https://docs.pokemontcg.io/ . Review its current terms, usage limits and key requirements. If you obtain an API key, save it as the Cloudflare secret `POKEMON_TCG_API_KEY`. Never put a private API key in browser JavaScript or a public repository.

## Optional member accounts (Supabase)
Guest mode works immediately without Supabase. To turn on optional member accounts and cloud-synced lists:
1. Create a project at https://supabase.com/.
2. Open `config.js` and fill in `supabaseUrl` and `supabaseAnonKey` using your Supabase Project URL and anon/public key. The anon key is intended for browser use when Row Level Security is correctly enabled; never use a service-role key in this file.
3. In Supabase Dashboard → SQL Editor, run the contents of `supabase-schema.sql`.
4. In Authentication settings, configure your site URL and allowed redirect URLs to your Cloudflare Pages domain. Set email confirmation preferences as desired.
5. Redeploy the site.

The schema enables row-level security so each signed-in member can read and manage only their own saved cards. Validate auth and RLS settings before inviting users.

## Pricing
- Current price field: TCGplayer market price returned by the Pokémon TCG API, when available.
- PHP conversion: Frankfurter reference exchange rate; conversion date and rate are shown.
- These are international reference values, not confirmed local Philippine transaction prices. Condition, language, printing, grading, shipping and local demand matter.
- Collectr integration is not included. No authorized public Collectr API connection has been verified; this build does not scrape Collectr or use private endpoints.
- Cardmarket and eBay sold-price integrations are possible later only through documented/authorized data access.

## Important
This is an independent community tool and is not affiliated with The Pokémon Company, Nintendo, Creatures or GAME FREAK. No payment processing or public user profiles are included in this version.
