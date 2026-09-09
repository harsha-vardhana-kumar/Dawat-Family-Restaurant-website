# Dawat Restaurant OS

A separate operations application for Dawat Family Restaurant, Tanuku. The customer website remains separate and unchanged.

**Status: private pilot / review build. Live billing is disabled by default.** The transactional engine has automated coverage and the interface has responsive component checks. First-owner setup, authenticated browser acceptance on the deployed service, real printer testing, and a hosted recovery rehearsal are still required before service use. See the [product audit](docs/PRODUCT-AUDIT.md) for the exact verification boundary.

## Included

- POS for dine-in, takeaway, delivery and manually entered online orders; persistent local drafts, incremental kitchen tickets, table transfer/merge and KDS.
- Frozen invoices, configurable taxes and charges, discounts, guest splits, manually confirmed payments, refunds, cash shifts and receipt printing.
- Menu administration, inventory/recipes/counts, purchase receipt/return, suppliers, expenses and receipt attachments.
- Customer histories and configurable loyalty; financial and operational reports with CSV exports.
- Owner identity, password and paired-terminal staff PIN access, server-side permissions, manager approvals and append-only audit/financial ledgers.
- Encrypted database-and-receipt export with an executable, verified local restoration procedure.

The only production seed is the supplied business identity, **91 exact menu prices and three unpriced signatures**, system roles and measurement units. No staff, floor plan, stock, suppliers, sales or accounting policy is fabricated. The initial owner is created from the verified identity at first setup.

## Run and verify

Use Node.js **22.13 or newer** on Linux with `bash`, `flock`, GNU `timeout`, and `curl`. Use the committed lockfile.

```sh
npm run install:ci
npx tsc --noEmit
npm run lint
npm test
```

`npm test` executes the real SQLite transaction tests, builds the Worker and client, and verifies server rendering and receipt output. `npm run test:engine` runs just the business engine suite.

For a GitHub checkout, copy `.openai/hosting.example.json` to `.openai/hosting.json` before local development. The example declares logical `DB` and `BUCKET` bindings and contains no private deployment identity. Hosting registration must supply the actual project identity before deployment. Inside a managed Sites checkout, retain its existing hosting file.

```sh
npm run dev
```

Local development does not forge the platform identity headers used for first-owner setup. The test suite creates its own isolated database, which is never connected to production. An optional component harness is prepared with `npm run build` followed by `npm run test:visual:prepare`; open `/_visual-qa/index.html` on the local preview. Its banner marks the fixture, and **all server writes are disabled**. Remove `public/_visual-qa` before building a deployment. The normal build refuses to package it.

## Operator documents

- [First setup and service acceptance](docs/SETUP.md)
- [Product audit and remaining launch gates](docs/PRODUCT-AUDIT.md)
- [Backup and recovery](docs/RECOVERY.md)
- [Architecture, hosting and deployment](docs/DEPLOYMENT.md)
- [Implementation checkpoint](docs/WORK-STATUS.md)

Source areas: `components/os/` for staff screens, `lib/server/` for authenticated workflows, `lib/domain.ts` for exact money calculations and permission definitions, `db/schema.ts` and `drizzle/` for the schema and immutable-ledger guards, and `tests/` for isolated verification. Money uses integer paise; stock uses integer thousandths of a unit.
