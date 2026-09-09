CREATE TABLE `approvals` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`actor_id` text NOT NULL,
	`approver_id` text NOT NULL,
	`action` text NOT NULL,
	`entity_id` text NOT NULL,
	`request_hash` text NOT NULL,
	`expires_at` text NOT NULL,
	`used_at` text,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`actor_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`approver_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`object_key` text NOT NULL,
	`uploaded_by` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`uploaded_by`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`actor_id` text NOT NULL,
	`actor_name` text NOT NULL,
	`action` text NOT NULL,
	`entity` text NOT NULL,
	`entity_id` text NOT NULL,
	`old_json` text,
	`new_json` text,
	`reason` text,
	`approver_id` text,
	`terminal_id` text,
	`session_id` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`actor_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_audit_logs_location_id_created_at` ON `audit_logs` (`location_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `auth_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`window_start` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bill_shares` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text NOT NULL,
	`label` text NOT NULL,
	`amount_paise` integer NOT NULL,
	`allocation_json` text NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cash_movements` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`shift_id` text NOT NULL,
	`type` text NOT NULL,
	`amount_paise` integer NOT NULL,
	`reason` text NOT NULL,
	`reference` text,
	`actor_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shift_id`) REFERENCES `shifts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`actor_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`name` text NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`code` text NOT NULL,
	`type` text NOT NULL,
	`value` integer NOT NULL,
	`starts_at` text,
	`ends_at` text,
	`min_paise` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_coupons_code` ON `coupons` (`code`);--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`name` text NOT NULL,
	`phone` text,
	`email` text,
	`birthday` text,
	`anniversary` text,
	`notes` text,
	`active` integer DEFAULT 1 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_customers_location_id_phone` ON `customers` (`location_id`,`phone`);--> statement-breakpoint
CREATE TABLE `dining_tables` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`section_id` text,
	`name` text NOT NULL,
	`capacity` integer NOT NULL,
	`status` text DEFAULT 'Available' NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`section_id`) REFERENCES `table_sections`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "check_dining_tables_0" CHECK(capacity > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_dining_tables_location_id_name` ON `dining_tables` (`location_id`,`name`);--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`amount_paise` integer NOT NULL,
	`date` text NOT NULL,
	`category` text NOT NULL,
	`method` text NOT NULL,
	`description` text NOT NULL,
	`attachment_id` text,
	`shift_id` text,
	`status` text NOT NULL,
	`authorized_by` text NOT NULL,
	`created_at` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`attachment_id`) REFERENCES `attachments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shift_id`) REFERENCES `shifts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`authorized_by`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `goods_receipts` (
	`id` text PRIMARY KEY NOT NULL,
	`purchase_id` text NOT NULL,
	`type` text NOT NULL,
	`items_json` text NOT NULL,
	`amount_paise` integer NOT NULL,
	`reason` text,
	`actor_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`purchase_id`) REFERENCES `purchases`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`actor_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `idempotency` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text NOT NULL,
	`action` text NOT NULL,
	`request_hash` text NOT NULL,
	`response_json` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`actor_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `inventory_items` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`unit_id` text NOT NULL,
	`quantity_milli` integer,
	`minimum_milli` integer,
	`reorder_milli` integer,
	`average_cost_paise` integer,
	`active` integer DEFAULT 1 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `invoice_events` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text NOT NULL,
	`action` text NOT NULL,
	`reason` text NOT NULL,
	`actor_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`actor_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`order_id` text NOT NULL,
	`number` text NOT NULL,
	`subtotal_paise` integer NOT NULL,
	`discount_paise` integer NOT NULL,
	`tax_paise` integer NOT NULL,
	`charges_paise` integer NOT NULL,
	`round_paise` integer NOT NULL,
	`total_paise` integer NOT NULL,
	`snapshot_json` text NOT NULL,
	`finalized_by` text NOT NULL,
	`finalized_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`finalized_by`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "check_invoices_0" CHECK(total_paise >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_invoices_order_id` ON `invoices` (`order_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_invoices_number` ON `invoices` (`number`);--> statement-breakpoint
CREATE INDEX `idx_invoices_location_id_finalized_at` ON `invoices` (`location_id`,`finalized_at`);--> statement-breakpoint
CREATE TABLE `kot_items` (
	`id` text PRIMARY KEY NOT NULL,
	`kot_id` text NOT NULL,
	`order_item_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`snapshot_json` text NOT NULL,
	FOREIGN KEY (`kot_id`) REFERENCES `kots`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `kots` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`order_id` text NOT NULL,
	`station_id` text,
	`number` text NOT NULL,
	`status` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_kots_location_id_status` ON `kots` (`location_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_kots_order_id` ON `kots` (`order_id`);--> statement-breakpoint
CREATE TABLE `locations` (
	`id` text PRIMARY KEY NOT NULL,
	`restaurant_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `loyalty_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`invoice_id` text,
	`points` integer NOT NULL,
	`type` text NOT NULL,
	`reference` text NOT NULL,
	`expires_at` text,
	`created_at` text NOT NULL,
	`actor_id` text NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`actor_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_loyalty_transactions_customer_id_type_reference` ON `loyalty_transactions` (`customer_id`,`type`,`reference`);--> statement-breakpoint
CREATE TABLE `menu_item_modifiers` (
	`id` text PRIMARY KEY NOT NULL,
	`menu_item_id` text NOT NULL,
	`group_id` text NOT NULL,
	FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`group_id`) REFERENCES `modifier_groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_menu_item_modifiers_menu_item_id_group_id` ON `menu_item_modifiers` (`menu_item_id`,`group_id`);--> statement-breakpoint
CREATE TABLE `menu_items` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`name` text NOT NULL,
	`display_name` text,
	`category_id` text NOT NULL,
	`subcategory` text,
	`sku` text,
	`diet` text DEFAULT 'unspecified' NOT NULL,
	`price_paise` integer,
	`tax_profile_id` text,
	`station_id` text,
	`prep_minutes` integer,
	`available` integer DEFAULT 1 NOT NULL,
	`unavailable_until` text,
	`active` integer DEFAULT 1 NOT NULL,
	`signature` integer DEFAULT 0 NOT NULL,
	`channels_json` text NOT NULL,
	`description` text,
	`image_id` text,
	`sort` integer DEFAULT 0 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tax_profile_id`) REFERENCES `tax_profiles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "check_menu_items_0" CHECK(price_paise IS NULL OR price_paise >= 0)
);
--> statement-breakpoint
CREATE INDEX `idx_menu_items_location_id_category_id` ON `menu_items` (`location_id`,`category_id`);--> statement-breakpoint
CREATE TABLE `modifier_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`name` text NOT NULL,
	`required` integer DEFAULT 0 NOT NULL,
	`multiple` integer DEFAULT 0 NOT NULL,
	`min` integer DEFAULT 0 NOT NULL,
	`max` integer DEFAULT 1 NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `modifiers` (
	`id` text PRIMARY KEY NOT NULL,
	`group_id` text NOT NULL,
	`name` text NOT NULL,
	`price_paise` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `modifier_groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `mutation_guards` (
	`id` text PRIMARY KEY NOT NULL,
	`ok` integer NOT NULL,
	CONSTRAINT "check_mutation_guards_0" CHECK(ok = 1)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`entity_id` text,
	`created_at` text NOT NULL,
	`acknowledged_at` text,
	`acknowledged_by` text,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`acknowledged_by`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`menu_item_id` text NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_paise` integer NOT NULL,
	`modifier_paise` integer DEFAULT 0 NOT NULL,
	`modifiers_json` text DEFAULT '[]' NOT NULL,
	`note` text,
	`seat` text,
	`discount_paise` integer DEFAULT 0 NOT NULL,
	`discount_reason` text,
	`station_id` text,
	`tax_json` text DEFAULT 'null' NOT NULL,
	`sent_qty` integer DEFAULT 0 NOT NULL,
	`voided` integer DEFAULT 0 NOT NULL,
	`void_reason` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "check_order_items_0" CHECK(quantity > 0 AND sent_qty >= 0 AND sent_qty <= quantity),
	CONSTRAINT "check_order_items_1" CHECK(unit_paise >= 0 AND modifier_paise >= 0 AND discount_paise >= 0)
);
--> statement-breakpoint
CREATE INDEX `idx_order_items_order_id` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`number` text NOT NULL,
	`type` text NOT NULL,
	`source` text,
	`customer_id` text,
	`waiter_id` text,
	`created_by` text NOT NULL,
	`terminal_id` text,
	`status` text NOT NULL,
	`held` integer DEFAULT 0 NOT NULL,
	`guest_count` integer DEFAULT 1 NOT NULL,
	`notes` text,
	`subtotal_paise` integer DEFAULT 0 NOT NULL,
	`discount_json` text DEFAULT '{}' NOT NULL,
	`charges_json` text DEFAULT '{}' NOT NULL,
	`merged_into` text,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`waiter_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`terminal_id`) REFERENCES `terminals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_orders_location_id_number` ON `orders` (`location_id`,`number`);--> statement-breakpoint
CREATE INDEX `idx_orders_location_id_created_at` ON `orders` (`location_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_orders_customer_id` ON `orders` (`customer_id`);--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`invoice_id` text NOT NULL,
	`share_id` text,
	`shift_id` text,
	`method` text NOT NULL,
	`amount_paise` integer NOT NULL,
	`tendered_paise` integer,
	`change_paise` integer DEFAULT 0 NOT NULL,
	`reference` text,
	`actor_id` text NOT NULL,
	`terminal_id` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`share_id`) REFERENCES `bill_shares`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shift_id`) REFERENCES `shifts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`actor_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`terminal_id`) REFERENCES `terminals`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "check_payments_0" CHECK(amount_paise > 0 AND change_paise >= 0)
);
--> statement-breakpoint
CREATE INDEX `idx_payments_invoice_id` ON `payments` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `idx_payments_shift_id` ON `payments` (`shift_id`);--> statement-breakpoint
CREATE TABLE `printers` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`width` text DEFAULT '80' NOT NULL,
	`copies` integer DEFAULT 1 NOT NULL,
	`adapter` text DEFAULT 'browser' NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `purchase_items` (
	`id` text PRIMARY KEY NOT NULL,
	`purchase_id` text NOT NULL,
	`inventory_item_id` text NOT NULL,
	`quantity_milli` integer NOT NULL,
	`received_milli` integer DEFAULT 0 NOT NULL,
	`returned_milli` integer DEFAULT 0 NOT NULL,
	`unit_cost_paise` integer NOT NULL,
	`tax_bps` integer DEFAULT 0 NOT NULL,
	`discount_paise` integer DEFAULT 0 NOT NULL,
	`total_paise` integer NOT NULL,
	FOREIGN KEY (`purchase_id`) REFERENCES `purchases`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`supplier_id` text NOT NULL,
	`number` text NOT NULL,
	`supplier_invoice` text,
	`status` text NOT NULL,
	`date` text NOT NULL,
	`due_date` text,
	`total_paise` integer NOT NULL,
	`notes` text,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipe_items` (
	`id` text PRIMARY KEY NOT NULL,
	`recipe_id` text NOT NULL,
	`inventory_item_id` text NOT NULL,
	`quantity_milli` integer NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_recipe_items_recipe_id_inventory_item_id` ON `recipe_items` (`recipe_id`,`inventory_item_id`);--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` text PRIMARY KEY NOT NULL,
	`menu_item_id` text NOT NULL,
	`yield_qty` integer NOT NULL,
	`notes` text,
	`active` integer DEFAULT 1 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "check_recipes_0" CHECK(yield_qty > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_recipes_menu_item_id` ON `recipes` (`menu_item_id`);--> statement-breakpoint
CREATE TABLE `refunds` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`invoice_id` text NOT NULL,
	`shift_id` text,
	`amount_paise` integer NOT NULL,
	`method` text NOT NULL,
	`reason` text NOT NULL,
	`items_json` text NOT NULL,
	`actor_id` text NOT NULL,
	`approver_id` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shift_id`) REFERENCES `shifts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`actor_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`approver_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "check_refunds_0" CHECK(amount_paise > 0)
);
--> statement-breakpoint
CREATE INDEX `idx_refunds_invoice_id` ON `refunds` (`invoice_id`);--> statement-breakpoint
CREATE TABLE `reservations` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`customer_id` text,
	`table_id` text,
	`starts_at` text NOT NULL,
	`party_size` integer NOT NULL,
	`status` text NOT NULL,
	`notes` text,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`table_id`) REFERENCES `dining_tables`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `restaurants` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`permissions_json` text NOT NULL,
	`system` integer DEFAULT 0 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_roles_name` ON `roles` (`name`);--> statement-breakpoint
CREATE TABLE `sequences` (
	`id` text PRIMARY KEY NOT NULL,
	`value` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`staff_id` text NOT NULL,
	`terminal_id` text,
	`platform_id` text,
	`csrf_hash` text NOT NULL,
	`created_at` text NOT NULL,
	`last_seen_at` text NOT NULL,
	`expires_at` text NOT NULL,
	`locked` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`terminal_id`) REFERENCES `terminals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_sessions_staff_id` ON `sessions` (`staff_id`);--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`data_json` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_settings_location_id` ON `settings` (`location_id`);--> statement-breakpoint
CREATE TABLE `shifts` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`staff_id` text NOT NULL,
	`terminal_id` text NOT NULL,
	`status` text NOT NULL,
	`opening_paise` integer NOT NULL,
	`expected_paise` integer,
	`actual_paise` integer,
	`variance_paise` integer,
	`opened_at` text NOT NULL,
	`closed_at` text,
	`notes` text,
	`summary_json` text,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`terminal_id`) REFERENCES `terminals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `one_open_shift` ON `shifts` (`terminal_id`) WHERE "shifts"."status"='Open';--> statement-breakpoint
CREATE TABLE `staff` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`code` text NOT NULL,
	`role_id` text NOT NULL,
	`password_hash` text,
	`pin_hash` text,
	`platform_id` text,
	`active` integer DEFAULT 1 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_staff_email` ON `staff` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_staff_code` ON `staff` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_staff_platform_id` ON `staff` (`platform_id`);--> statement-breakpoint
CREATE TABLE `stations` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`name` text NOT NULL,
	`printer_id` text,
	`overdue_minutes` integer,
	`active` integer DEFAULT 1 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`printer_id`) REFERENCES `printers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stock_count_items` (
	`id` text PRIMARY KEY NOT NULL,
	`count_id` text NOT NULL,
	`inventory_item_id` text NOT NULL,
	`expected_milli` integer,
	`actual_milli` integer NOT NULL,
	`item_version` integer NOT NULL,
	`reason` text,
	FOREIGN KEY (`count_id`) REFERENCES `stock_counts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stock_counts` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`status` text NOT NULL,
	`notes` text,
	`created_by` text NOT NULL,
	`confirmed_by` text,
	`created_at` text NOT NULL,
	`confirmed_at` text,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`confirmed_by`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stock_movements` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`inventory_item_id` text NOT NULL,
	`type` text NOT NULL,
	`quantity_milli` integer NOT NULL,
	`balance_milli` integer NOT NULL,
	`cost_paise` integer,
	`reference` text NOT NULL,
	`reason` text NOT NULL,
	`actor_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`actor_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_stock_movements_inventory_item_id_type_reference` ON `stock_movements` (`inventory_item_id`,`type`,`reference`);--> statement-breakpoint
CREATE INDEX `idx_stock_movements_location_id_created_at` ON `stock_movements` (`location_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `supplier_payments` (
	`id` text PRIMARY KEY NOT NULL,
	`purchase_id` text NOT NULL,
	`amount_paise` integer NOT NULL,
	`method` text NOT NULL,
	`reference` text,
	`actor_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`purchase_id`) REFERENCES `purchases`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`actor_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`name` text NOT NULL,
	`contact` text,
	`phone` text,
	`email` text,
	`gstin` text,
	`address` text,
	`products` text,
	`notes` text,
	`active` integer DEFAULT 1 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `table_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`table_id` text NOT NULL,
	`order_id` text NOT NULL,
	`assigned_at` text NOT NULL,
	FOREIGN KEY (`table_id`) REFERENCES `dining_tables`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_table_assignments_table_id` ON `table_assignments` (`table_id`);--> statement-breakpoint
CREATE INDEX `idx_table_assignments_order_id` ON `table_assignments` (`order_id`);--> statement-breakpoint
CREATE TABLE `table_sections` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`name` text NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tax_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`name` text NOT NULL,
	`components_json` text NOT NULL,
	`inclusive` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `terminals` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'POS' NOT NULL,
	`device_hash` text,
	`active` integer DEFAULT 1 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `units` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`dimension` text NOT NULL,
	`factor` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wastage` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`inventory_item_id` text NOT NULL,
	`quantity_milli` integer NOT NULL,
	`cost_paise` integer,
	`reason` text NOT NULL,
	`actor_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`actor_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
