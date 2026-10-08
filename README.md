# Party Rats website

The Party Rats site, rebuilt from the Canva design ("Party Rats - website") as a plain static site.
No build step: everything that ships is in `public/`.

- `public/index.html`: the page
- `public/styles.css`: styles, with brand colors and fonts from the Canva Master Design System at the top
- `public/img/`: logo and rat art, exported from the brand files and converted to WebP
- `wrangler.jsonc`: Cloudflare Workers config (static assets only)

## Preview locally

    npx wrangler dev

## Deploy

Cloudflare Workers Builds is connected to this repo: every push to `main` deploys to production,
and every other branch gets its own preview URL. To deploy by hand: `npx wrangler deploy`.

## Brand notes

- Black dominates; hot pink `#FF2B8C`, cyan `#22D9FF` and acid chartreuse `#D8FF2B` are accents.
- League Spartan for headlines, Inter for body, Edo for short accent phrases only
  ("Ideas first.", "Got an idea?"). Edo (freeware by Vic Fieger) is self-hosted in `public/fonts/`.
- The "Wanna Party?" buttons go to the Google Form: https://forms.gle/2iD8DwDikYpsya6V6
