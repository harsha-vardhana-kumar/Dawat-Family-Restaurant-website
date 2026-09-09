# Architecture and deployment

The OS is an independent Vinext/React application with an authenticated JSON API on Cloudflare Workers. D1 stores relational state and R2 stores receipt attachments. The public customer website can retain its existing build and deployment; the OS source belongs under `apps/restaurant-os/` when reviewed alongside it.

## Boundaries

- `app/` and `components/os/`: responsive staff interface with Shadcn primitives; the signed-out page contains no operational records.
- `lib/server/api.ts`: routing, origin/CSRF enforcement, authenticated actor resolution and explicit errors.
- Workflow modules: order/KOT/billing, finance/shift, stock/purchase, administration, reports, loyalty, notifications and encrypted export.
- `lib/server/db.ts`: parameterized D1 statements, atomic batches, optimistic record versions, conflict responses and request idempotency.
- `db/schema.ts` and `drizzle/`: 55 application tables, foreign keys, indexes, constraints and immutable-ledger triggers.
- `lib/client.ts`: actor-scoped IndexedDB drafts and bounded offline create/add queue. `public/sw.js` caches static assets only; authentication, API responses and financial mutations are never cached.

Money is stored in integer paise and percentages in basis points. Stock is stored in thousandths of each defined unit. Invoice calculations and receipt data are frozen at finalization. Corrections create separate events/refunds; invoice/payment/refund/stock/cash history is not edited in place. Optimistic guards roll back an entire batch when another terminal has changed the expected version.

## Hosting

Deploy privately. The first-owner flow trusts only identity headers injected by the hosting dispatcher; do not expose the raw Worker directly to arbitrary clients or accept client-supplied identity headers at a separate ingress. Private access policy and restaurant staff permissions are distinct controls.

The manifest declares D1 as `DB` and R2 as `BUCKET`. Managed Sites provides the actual project identity and resource provisioning. Do not publish real private hosting identifiers, credentials or deployment metadata to the public customer website repository. `.openai/hosting.example.json` is the safe logical-binding example for source review.

Use the committed migrations in order. New installations apply `0000_safe_jane_foster.sql` then `0001_immutable_ledgers.sql`; retain the matching Drizzle journal. Never run an initial migration blindly against a restored database. There are no production sample transaction migrations.

For a release:

1. Remove generated visual fixtures from `public/_visual-qa`; the build guard rejects their presence.
2. Run `npx tsc --noEmit`, `npm run lint` and `npm test`.
3. Commit and push the exact source revision. Package/save that same revision using the hosting workflow and deploy privately.
4. Wait for confirmed deployment success. Check the signed-out page, first-owner identity, D1 migrations, R2 receipt upload/download, session cookies, real authentication and the service acceptance checklist.
5. Keep live billing disabled until actual configuration and acceptance pass. Retain the prior source/deployment and an authenticated backup for rollback planning.

## Runtime limits and integrations

Password and backup key derivation uses a portable PBKDF2 implementation at 600,000 SHA-256 iterations. This avoids relying on a lower native runtime PBKDF2 limit. Native Node interoperability is tested; validate actual Worker CPU allowance and login/export latency on the deployment plan before service. References: [Cloudflare Web Crypto](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/) and [OWASP password storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).

Reports are bounded to 10,000 source records where relevant and date ranges up to 366 days. Large datasets need pagination/export planning. KDS and dashboards poll; no push messaging or guaranteed offline cold startup is installed. A page already open can retain a draft during a disconnection; restarting a terminal without connectivity still requires an online authentication path.

UPI/card/bank/wallet/other payments are manual records after staff confirmation. There is no connected payment gateway, bank reconciliation feed, delivery aggregator, accounting export connector, SMS/WhatsApp sender, email sender, QZ Tray/ESC-POS bridge or drawer hardware driver. Reservation and multi-location tables provide a foundation; no full reservation calendar, branch switching or cross-branch consolidation is claimed.
