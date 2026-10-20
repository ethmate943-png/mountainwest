# Mountain West Bank (Ameriprise / Adetelco method)

Next.js + Tailwind scaffold for [connect.mountainwestbank.com](https://connect.mountainwestbank.com/login).

**Playbook:** [`../AMERIPRISE-METHOD-PLAYBOOK.md`](../AMERIPRISE-METHOD-PLAYBOOK.md)  
**Next steps for Cursor:** [`AGENT_KICKOFF.md`](./AGENT_KICKOFF.md)

## Run

```bash
cd mountainwestbank-app
# npm install   # or use symlink from workflow --symlink-modules
npm run build && npm run start -- --hostname 127.0.0.1 --port 3035
# or: npm run dev -- --hostname 127.0.0.1 --port 3035
```

Scrape reference: `../scraped_data/connect.mountainwestbank.com/` (do not embed HTML).
# mountainwest
