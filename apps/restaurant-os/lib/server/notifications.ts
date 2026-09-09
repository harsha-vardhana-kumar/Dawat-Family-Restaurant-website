import { can, localDate } from '../domain';
import { all, Context, now, one, Row } from './db';

export async function operationalNotifications(c: Context) {
  const loc = c.actor.locationId;
  const rows: Row[] = can(c.actor, 'audit.view')
    ? await all(c.db, 'SELECT * FROM notifications WHERE location_id=? AND acknowledged_at IS NULL ORDER BY created_at DESC LIMIT 75', loc)
    : [];
  const add = (id: string, type: string, title: string, href: string) => rows.unshift({ id, type, title, href, derived: 1, created_at: now() });
  if (c.settings.lowStockAlerts && can(c.actor, 'inventory.view')) {
    const low = await one(c.db, 'SELECT COUNT(*) n FROM inventory_items WHERE location_id=? AND active=1 AND quantity_milli IS NOT NULL AND minimum_milli IS NOT NULL AND quantity_milli<=minimum_milli', loc);
    if (Number(low?.n)) add('current-low-stock', 'Low stock', `${low!.n} inventory items are at or below their minimum.`, '/inventory');
  }
  if (can(c.actor, 'payment.accept')) {
    const unpaid = await one(c.db, "SELECT COUNT(*) n FROM orders WHERE location_id=? AND status IN ('Billed','Part paid')", loc);
    if (Number(unpaid?.n)) add('current-unpaid', 'Pending bills', `${unpaid!.n} bills have an unpaid balance.`, '/orders');
  }
  if (can(c.actor, 'kitchen.view') && c.settings.notificationOverdueMinutes) {
    const overdue = await one(c.db, "SELECT COUNT(*) n FROM kots k JOIN orders o ON o.id=k.order_id WHERE k.location_id=? AND k.status NOT IN ('Ready','Completed') AND o.status NOT IN ('Closed','Cancelled','Refunded','Merged') AND k.created_at<?", loc, new Date(Date.now() - c.settings.notificationOverdueMinutes * 60000).toISOString());
    if (Number(overdue?.n)) add('current-overdue-kitchen', 'Kitchen delay', `${overdue!.n} kitchen tickets exceed the configured preparation time.`, '/kitchen');
  }
  if (can(c.actor, 'supplier.manage')) {
    const due = await one(c.db, "SELECT COUNT(*) n FROM purchases p WHERE p.location_id=? AND p.due_date IS NOT NULL AND p.due_date<=? AND COALESCE((SELECT SUM(CASE WHEN type='Return' THEN -amount_paise ELSE amount_paise END) FROM goods_receipts WHERE purchase_id=p.id),0)>COALESCE((SELECT SUM(amount_paise) FROM supplier_payments WHERE purchase_id=p.id),0)", loc, localDate(Date.now(), c.settings.timezone));
    if (Number(due?.n)) add('current-purchases-due', 'Supplier payments due', `${due!.n} received purchases have a payment due.`, '/purchases');
  }
  return { rows, total: rows.length, page: 1, pageSize: 100 };
}
