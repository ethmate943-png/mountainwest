# AGENT KICKOFF — Mountain West Bank

Rebuild **https://connect.mountainwestbank.com/login** with the Ameriprise/Adetelco method.

See: `windsurf-project/AMERIPRISE-METHOD-PLAYBOOK.md`

## Context

- App folder: `windsurf-project/mountainwestbank-app`
- Scrape reference: `scraped_data/connect.mountainwestbank.com/` (create/refresh if missing)
- Token prefix: `mwb-` (already in `app/globals.css`)
- Stub shell exists: AppShell, SiteHeader, SiteFooter, homepage placeholder

## Rules

- Real React + Tailwind components — **do NOT** embed scraped HTML
- Match desktop + mobile (header, primary UI, modals, mobile nav)
- Localize icons/brand into `public/images/`
- Content in `lib/site-content.ts` (+ domain data files as needed)
- QA against live side-by-side before calling done
- Serve on `http://127.0.0.1:3035/`

## Paste into Cursor

```text
Rebuild https://connect.mountainwestbank.com/login with the Ameriprise/Adetelco method (see
windsurf-project/AMERIPRISE-METHOD-PLAYBOOK.md).

- App folder: windsurf-project/mountainwestbank-app
- Scrape reference: scraped_data/connect.mountainwestbank.com/
- Real React + Tailwind components — do NOT embed scraped HTML
- Match desktop + mobile (header, primary UI, modals, mobile nav)
- Localize icons/brand into public/images
- Design tokens use prefix mwb- in app/globals.css @theme
- Content in lib/site-content.ts (+ domain data files)
- QA against live side-by-side before calling done
- Serve at http://127.0.0.1:3035/
```
