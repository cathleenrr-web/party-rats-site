# Party Rats website

The Party Rats site, rebuilt from the Canva design ("Party Rats - website") as a plain static site,
plus a small Worker for the inquiry form. No build step.

- `public/index.html`: the page
- `public/styles.css`: styles, with brand colors and fonts from the Canva Master Design System at the top
- `public/img/`: logo and rat art, exported from the brand files and converted to WebP
- `public/inquiry.js`: sends the inquiry form without a page reload
- `src/worker.js`: handles `POST /api/inquiry` and emails the lead; everything else is served from `public/`
- `wrangler.jsonc`: Cloudflare Workers config

## Inquiry form setup (one time, Cloudflare dashboard)

1. Email Routing on for thepartyrats.com, with the lead inbox added and verified as a destination address.
2. A routing rule forwarding `hello@thepartyrats.com` to that inbox (the form's fallback address).
3. Worker secret `LEAD_TO` set to that inbox (Worker > Settings > Variables and Secrets).

If an email fails to send, the lead is still written to the Worker logs.

## Preview locally

    npx wrangler dev

## Deploy

Cloudflare Workers Builds is connected to this repo: every push to `main` deploys to production,
and every other branch gets its own preview URL. To deploy by hand: `npx wrangler deploy`.

## Brand notes

- Black dominates; hot pink `#FF2B8C`, cyan `#22D9FF` and acid chartreuse `#D8FF2B` are accents.
- League Spartan for headlines, Inter for body, Edo for short accent phrases only
  ("Ideas first.", "Got an idea?"). Edo (freeware by Vic Fieger) is self-hosted in `public/fonts/`.
- The "Wanna Party?" buttons go to the on-site inquiry form (`#inquire`).
