# First setup and service acceptance

This application starts with live billing disabled. An owner must configure it using Dawat's real operating information.

## Owner and staff access

1. Open the private application using the authorized hosting account. Choose **Sign in with ChatGPT**, then **Continue with workspace identity**. On the first visit to an empty database this creates the restaurant, Tanuku location and owner from the verified identity. Subsequent identities cannot create another owner implicitly.
2. In Settings, create real terminals and pair each browser/device. Pairing grants a staff PIN login entry point; it does not grant any role permission by itself. Re-pairing rotates that terminal's device credential.
3. In Staff & access, create actual staff accounts and choose the least permission needed. Set individual non-repeating PINs of the configured length. Passwords must have at least 12 characters. There are no default passwords or PINs.
4. The owner should set a recovery password and securely retain both account access and backup passphrases. Create an appropriate secondary administrator before service. Disabling a staff account takes effect on the next server request.

## Business configuration

| Area | Required information or decision |
| --- | --- |
| Legal identity | Legal business name, GST registration status/GSTIN if applicable, state, place of supply and any receipt classification required by the restaurant's accountant |
| Tax | Accountant-confirmed profiles, component names/rates, inclusive or exclusive treatment, menu/default assignment and charge tax; or an explicit confirmed no-tax configuration |
| Invoice numbers | Approved unique prefix, digit count and fiscal-year convention. `{FY}` expands to the April–March year label |
| Menu | Confirm imported prices and names; configure three unpriced signatures, diet information where unspecified, portions/modifiers, channels and kitchen stations |
| Floor | Real sections, tables, capacities and any current reservations; no sample floor is installed |
| Payments | Enabled tender methods, any UPI identity, cash opening balances and the procedure for independently confirming non-cash receipts/refunds |
| Charges and discounts | Packing/delivery/service charges, optional tips, rounding, manual discounts, limits, coupons and manager approval policy |
| Inventory | Real units and ingredients, measured opening counts, minimum/reorder thresholds, supplier costs, recipes and yields. Enable automatic deduction only after these reconcile |
| Loyalty | Optional earn, redemption, minimum and expiry rules; leave disabled until these economics and refund policy are approved |
| Operations | Shift requirements, cash accountability, KDS overdue threshold, terminal assignments, receipt size/footer and printer routing |

The provided identity is Dawat Family Restaurant at Ward-19, Rajiv Chowk Center, 28-2-11, Velpur Road, Tanuku, opposite Reliance Digital; telephone +91 97019 19654. The supplied service hours are daily 06:30–22:30. These facts do not establish a legal or tax registration.

## Acceptance on real equipment

Run these in an isolated acceptance environment first, with clearly marked test records. The component harness is a layout check and cannot substitute for this exercise.

- Sign in as owner, cashier, waiter, kitchen and inventory staff. Check wrong PIN, lock/unlock, idle expiry, disabled accounts, manager approval and forbidden settings/price changes.
- Run dine-in, takeaway and delivery from order entry to incremental KOTs, kitchen status, frozen invoice, split collection and closing. Verify quantity/notes, table moves and merges, sold-out protection and exact paise totals.
- Exercise cash change, UPI/card confirmation, partial/mixed payments, item/equal/custom/seat shares, reprints, full/partial/item refunds and unpaid cancellation. Reconcile payment/refund ledgers and cash shift variance.
- Test opening stock, purchase partial receipt/return, recipe consumption, wastage and a physical count. Verify stock conflict handling while two devices edit the same record.
- Check the actual network interruption and reconnection on each POS device: saved draft, queued create/add, duplicate retry and conflict review. Payments and bill finalization require a working connection.
- Print and inspect bill/KOT output on the actual 58 mm/80 mm/A4 devices. Confirm paper size, margins, legibility, notes, tax breakdown, duplicates and browser popup permissions.
- Export an encrypted backup and complete the recovery procedure, including a hosted database/object-storage rehearsal, before enabling live service.

Keep live billing disabled until the owner confirms these results and the real settings. The application can enforce required fields and permissions; it cannot certify the restaurant's tax policy, validate a bank transfer, operate an unconnected printer or approve its own launch.
