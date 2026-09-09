CREATE TRIGGER immutable_invoices_update BEFORE UPDATE ON invoices BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_invoices_delete BEFORE DELETE ON invoices BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_payments_update BEFORE UPDATE ON payments BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_payments_delete BEFORE DELETE ON payments BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_refunds_update BEFORE UPDATE ON refunds BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_refunds_delete BEFORE DELETE ON refunds BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_invoice_events_update BEFORE UPDATE ON invoice_events BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_invoice_events_delete BEFORE DELETE ON invoice_events BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_stock_movements_update BEFORE UPDATE ON stock_movements BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_stock_movements_delete BEFORE DELETE ON stock_movements BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_cash_movements_update BEFORE UPDATE ON cash_movements BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_cash_movements_delete BEFORE DELETE ON cash_movements BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_supplier_payments_update BEFORE UPDATE ON supplier_payments BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_supplier_payments_delete BEFORE DELETE ON supplier_payments BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_goods_receipts_update BEFORE UPDATE ON goods_receipts BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_goods_receipts_delete BEFORE DELETE ON goods_receipts BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_loyalty_transactions_update BEFORE UPDATE ON loyalty_transactions BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_loyalty_transactions_delete BEFORE DELETE ON loyalty_transactions BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_audit_logs_update BEFORE UPDATE ON audit_logs BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_audit_logs_delete BEFORE DELETE ON audit_logs BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_kot_items_update BEFORE UPDATE ON kot_items BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER immutable_kot_items_delete BEFORE DELETE ON kot_items BEGIN SELECT RAISE(ABORT, 'immutable financial or audit record'); END;
--> statement-breakpoint
CREATE TRIGGER frozen_order_items_insert BEFORE INSERT ON order_items WHEN EXISTS (SELECT 1 FROM invoices WHERE order_id=NEW.order_id) BEGIN SELECT RAISE(ABORT, 'finalized order lines are immutable'); END;
--> statement-breakpoint
CREATE TRIGGER frozen_order_items_update BEFORE UPDATE ON order_items WHEN EXISTS (SELECT 1 FROM invoices WHERE order_id=NEW.order_id OR order_id=OLD.order_id) BEGIN SELECT RAISE(ABORT, 'finalized order lines are immutable'); END;
--> statement-breakpoint
CREATE TRIGGER frozen_order_items_delete BEFORE DELETE ON order_items WHEN EXISTS (SELECT 1 FROM invoices WHERE order_id=OLD.order_id) BEGIN SELECT RAISE(ABORT, 'finalized order lines are immutable'); END;
