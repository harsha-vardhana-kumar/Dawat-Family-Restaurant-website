# Dawat Restaurant OS — product audit

Review date: 9 September 2026. **Private pilot / review build; not yet approved for live restaurant billing.** The implemented backend is transactional. Isolated component fixtures are explicitly marked and never report successful server writes. The remaining acceptance work is stated below.

## 1. What was implemented

| Module | Implemented behavior |
| --- | --- |
| Access | Verified first-owner identity, individual passwords, paired-device staff PINs, lock/unlock, session expiry, account disabling, roles/custom permissions and payload-bound manager approval |
| Overview | Date-filtered sales, collections, tax, discounts, refunds, expenses, order/KOT counts, recent bills and item/hour summaries |
| POS and orders | Search/category/favorite/recent/signature views, modifiers, quantity/notes/seat, customer, local draft, hold/resume, four order channels, saved order history and price/availability validation |
| Floor and kitchen | Sections/tables/status, waiter assignment, move/merge/release, incremental station KOTs with frozen notes, preparing/ready/completed/recall views |
| Billing | Exact paise calculation, inclusive/exclusive component taxes, manual/coupon/line/order discounts, configurable charges/tips/rounding, immutable invoice numbering and snapshot, equal/custom/item/seat shares |
| Collections | Partial/mixed/manual-confirmed tender records, cash tender/change, outstanding/share limits, idempotent retries, full/partial/item refunds, unpaid cancellation and audited reprints |
| Cash | Terminal shifts, opening cash, cash in/out, bank deposit, petty cash, expenses/supplier payments/refunds, expected/actual close and variance |
| Menu | Priced source import, three disabled unpriced signatures, categories, modifiers, tax/station/channel assignment, price permissions, archive and availability controls |
| Stock and purchasing | Nullable opening stock, counted opening balance, units, ingredients, recipes/yield, consumption at finalization, negative-stock guard, wastage, physical counts, partial purchase receipts/returns, supplier payments and balances |
| Customers | Search by name/phone, customer records and history, loyalty earn after full collection, redemption reservation, expiry, unpaid cancellation release and earned-point reversal on refund |
| Reports | Daily/hourly/weekly/monthly sales, order type/item/category, payments/splits, tax/invoices/discounts/voids/refunds, staff/shifts, stock/movement/usage/wastage/count variance, purchases/suppliers, expense detail/category/day/month, conditional food-cost estimate and CSV |
| Administration | Real-data settings, staff/custom roles, audit filters, receipt attachments, operational notifications and owner-only encrypted export |
| Resilience | Actor-scoped saved drafts, idempotent offline create/add queue, visible conflicts with export/review/manual resolution, version guards and explicit offline/payment errors |

The production seed contains 91 exact priced dishes plus three unpriced signatures. Veg Manchow Soup remains **₹140.50**. No fake transactions, staff, suppliers, opening stock, tax registration or floor plan are installed. Where the supplied menu did not identify diet, the UI says it is unspecified.

## 2. Architecture used

React 19, Vinext/Next-compatible routes, TypeScript and Shadcn components run on a Cloudflare Worker. D1 holds relational state; R2 holds receipt files. `lib/server/api.ts` enforces origin, CSRF, sessions and permissions before workflow operations. Domain calculations use integer paise, basis points and stock thousandths. Prepared SQL, atomic batches, optimistic versions and canonical request hashes protect concurrent and repeated writes.

There are no service credentials in client code. Protected data is fetched only after authentication. Static assets can be cached, while auth/API responses are `no-store`. Staff screens and the customer website have independent application boundaries.

## 3. Database schema summary

There are **55 application tables**, with corresponding migrations, foreign keys, indexes and financial immutability triggers.

| Area | Tables |
| --- | --- |
| Organization | restaurants, locations, settings |
| Access | roles, staff, terminals, sessions, auth_attempts, approvals |
| Floor and customers | table_sections, dining_tables, customers, reservations |
| Menu and routing | categories, printers, stations, tax_profiles, menu_items, modifier_groups, modifiers, menu_item_modifiers |
| Order and kitchen | orders, table_assignments, order_items, kots, kot_items |
| Billing and cash | sequences, invoices, bill_shares, payments, refunds, invoice_events, shifts, cash_movements, coupons |
| Inventory | units, inventory_items, recipes, recipe_items, stock_movements, stock_counts, stock_count_items, wastage |
| Purchasing | suppliers, purchases, purchase_items, goods_receipts, supplier_payments |
| Administration and history | attachments, expenses, loyalty_transactions, audit_logs, idempotency, mutation_guards, notifications |

Invoices, payments, refunds and stock/cash/loyalty audit ledgers are protected from silent edits/deletion. Finalized order lines cannot be changed or moved out of their invoice. Cancellations and refunds are separate records. Reservation and location entities are foundations for future operational screens; their existence is not a claim of full reservation or multi-branch support.

## 4. Roles and permissions

| Role | Default scope |
| --- | --- |
| Owner | All operations, access/settings administration and encrypted export |
| Admin | Broad operating and administrative access; encrypted export still requires the Owner role |
| Manager | Operating, financial, stock and settings access; no staff administration or backup export |
| Cashier | Orders, configured discounts, billing/splits/reprints, collection, shifts, menu viewing and customer management |
| Waiter | Create/edit orders, transfer tables, view menu and kitchen |
| Kitchen | View/update KDS and view menu |
| Inventory Manager | Stock/count/wastage, purchases/receipt, suppliers and menu viewing |
| Custom | Explicit permission selection, enforced by the server. Sensitive approvals still require an authorized manager role |

Permissions are enumerated in `lib/domain.ts` and checked on every server operation. PIN knowledge alone does not elevate a role. Manager approvals expire after two minutes and are bound to the actor, action, entity and exact request. The UI hides inaccessible pages but is not the security boundary.

## 5. Critical workflow results

Automated checks run against the actual SQL migrations through a D1-shaped SQLite adapter and call the actual API/workflow functions. They do not contact bank/payment services or production data.

| Verification | Result and boundary |
| --- | --- |
| Backend transaction suite | 28 scenarios cover seed precision, tax/discount arithmetic, dine-in/takeaway, incremental KOT/KDS, table moves/merge, shares/mixed collections, duplicate retries, manager approval/PIN pairing/RBAC, frozen ledgers, stock rollback/count conflicts, shift/refund/expense reconciliation, loyalty expiry/reversal, supplier returns, report totals and portable password derivation |
| Encrypted local restore | Full database/receipt round trip, foreign-key/integrity checks, ledger-total comparison and reinstated immutability; wrong passphrase/tampering/overwrite refused |
| Rendering and receipts | Private server shell and escaped receipt/KOT content; inclusive-tax breakdown and 58 mm/80 mm/A4 output checks |
| Browser observation | Signed-out application renders. Real POS components render at desktop, tablet and mobile sizes. Search preserves ₹140.50 and the browser draft survives a reload with quantity and order note |
| Responsive component checks | Clearly marked, isolated SQLite-derived QA records; no live authentication or successful server mutations are simulated |
| Authenticated deployed E2E | **Not completed:** first-owner setup requires the restaurant owner's actual identity/session. No credentials were invented and no authentication bypass was added |
| Hardware and hosted restore | **Not completed:** real printers, drawer, payment terminal/bank checks and provider D1/R2 restore need the owner's deployment/equipment |

The final verification results are recorded in [WORK-STATUS.md](WORK-STATUS.md). This audit does not equate unit/integration or component checks with full browser end-to-end acceptance.

## 6. Remaining external integrations

Payments are records entered after staff independently confirm receipt/refund. No UPI gateway, bank feed, card processor, delivery aggregator, accounting service, WhatsApp/SMS/email delivery or fiscal filing integration is connected. “Online” is a manually entered order channel. Notifications are in-application events and current-data alerts.

Reservation scheduling, branch switching/consolidation, advanced loyalty refund economics and an unattended backup schedule remain separate future work. The application does not claim these integrations are active.

## 7. Printer setup requirements

The browser print adapter generates bill and KOT documents and opens the real print dialog. Owner-selected 58 mm, 80 mm and A4 receipt layouts are supported. Reprints are explicitly marked and audited. Allow the receipt popup, install each real printer's driver, set paper/margins/scaling and perform an actual kitchen/service print test.

Printer and station configuration can describe routing, but direct device routing, silent printing, ESC-POS/QZ Tray and cash-drawer triggering need a device bridge and installation. A drawer request records an audit event and clearly says hardware was not triggered. Never interpret that event as proof the drawer opened.

## 8. Deployment requirements

Deploy as a separate private application with its own D1/R2 bindings and the committed migrations. Use the locked dependencies and supported Linux/Node runtime. Preserve the platform's trusted identity-header boundary and private audience. Commit and deploy the same verified source. Exclude generated component fixtures, local databases, credentials and private hosting metadata from public GitHub review.

Validate actual Worker CPU allowance for the 600,000-iteration password/export derivation, first-owner sign-in, cookie/CSRF behavior, D1 migration integrity and receipt upload/download after deployment. See [DEPLOYMENT.md](DEPLOYMENT.md).

## 9. Required real restaurant configuration before launch

The owner must supply legal/tax details, invoice numbering, actual staff and terminal assignments, floor/table plan, kitchen stations, signature prices, any missing diet/modifier details, opening stock/costs/recipes, charges/discount policy, payment procedures, cash balances, printer setup and optional loyalty economics. Business settings stay unconfigured where facts were not supplied. Automatic stock consumption and loyalty start disabled. See the full [setup checklist](SETUP.md).

## 10. Risks to resolve before live billing

- Finish authenticated acceptance for every real role on the deployed service, including concurrent devices, network failure/recovery, delivery and all split/refund modes. Automated coverage is strong but does not replace this gate.
- Rehearse hosted D1/R2 recovery and post-export transaction reconciliation. Local restoration is executable and tested; remote cutover and recovery-time objectives are not yet established.
- Validate real printer output, bank confirmation procedures and cashier shift reconciliation. A manually recorded payment is not independently verified by this app.
- Confirm all tax/legal policy with the restaurant's accountant and enable billing deliberately. The software does not determine applicable tax law.
- Measure Worker authentication/backup CPU and service latency under representative load. Report/export size limits and polling behavior must fit the actual restaurant volume.
- An open page retains drafts during a disconnection; cold offline sign-in/startup is unavailable. Shared-device browser storage needs the restaurant's device access controls and an operating procedure for queued conflicts.
- Stock deduction requires complete recipes, yield and counts. Food-cost margin is left unavailable when invoice consumption/cost coverage is incomplete; it is an estimate and excludes overhead/refund adjustments.

**Release posture:** suitable for private configuration and review. Do not use it for live billing until these acceptance gates are recorded as passed by the owner/operator.
