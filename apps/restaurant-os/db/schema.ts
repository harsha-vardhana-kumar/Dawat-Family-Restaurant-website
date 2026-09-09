import {sqliteTable, text, integer, uniqueIndex, index, check} from 'drizzle-orm/sqlite-core';
import {sql} from 'drizzle-orm';

export const restaurants = sqliteTable("restaurants", {
  id: text('id').primaryKey(),
  name: text("name").notNull(),
  created_at: text("created_at").notNull()
});

export const locations = sqliteTable("locations", {
  id: text('id').primaryKey(),
  restaurant_id: text("restaurant_id").notNull().references(() => restaurants.id),
  name: text("name").notNull(),
  created_at: text("created_at").notNull()
});

export const settings = sqliteTable("settings", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  data_json: text("data_json").notNull(),
  version: integer("version").notNull().default(1),
  updated_at: text("updated_at").notNull()
},t=>[uniqueIndex("idx_settings_location_id").on(t.location_id)]);

export const roles = sqliteTable("roles", {
  id: text('id').primaryKey(),
  name: text("name").notNull(),
  permissions_json: text("permissions_json").notNull(),
  system: integer("system").notNull().default(0),
  version: integer("version").notNull().default(1)
},t=>[uniqueIndex("idx_roles_name").on(t.name)]);

export const staff = sqliteTable("staff", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  name: text("name").notNull(),
  email: text("email"),
  code: text("code").notNull(),
  role_id: text("role_id").notNull().references(() => roles.id),
  password_hash: text("password_hash"),
  pin_hash: text("pin_hash"),
  platform_id: text("platform_id"),
  active: integer("active").notNull().default(1),
  version: integer("version").notNull().default(1),
  created_at: text("created_at").notNull()
},t=>[uniqueIndex("idx_staff_email").on(t.email),uniqueIndex("idx_staff_code").on(t.code),uniqueIndex("idx_staff_platform_id").on(t.platform_id)]);

export const terminals = sqliteTable("terminals", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  name: text("name").notNull(),
  type: text("type").notNull().default("POS"),
  device_hash: text("device_hash"),
  active: integer("active").notNull().default(1),
  version: integer("version").notNull().default(1),
  created_at: text("created_at").notNull()
});

export const sessions = sqliteTable("sessions", {
  id: text('id').primaryKey(),
  staff_id: text("staff_id").notNull().references(() => staff.id),
  terminal_id: text("terminal_id").references(() => terminals.id),
  platform_id: text("platform_id"),
  csrf_hash: text("csrf_hash").notNull(),
  created_at: text("created_at").notNull(),
  last_seen_at: text("last_seen_at").notNull(),
  expires_at: text("expires_at").notNull(),
  locked: integer("locked").notNull().default(0)
},t=>[index("idx_sessions_staff_id").on(t.staff_id)]);

export const auth_attempts = sqliteTable("auth_attempts", {
  id: text('id').primaryKey(),
  count: integer("count").notNull(),
  window_start: integer("window_start").notNull()
});

export const approvals = sqliteTable("approvals", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  actor_id: text("actor_id").notNull().references(() => staff.id),
  approver_id: text("approver_id").notNull().references(() => staff.id),
  action: text("action").notNull(),
  entity_id: text("entity_id").notNull(),
  request_hash: text("request_hash").notNull(),
  expires_at: text("expires_at").notNull(),
  used_at: text("used_at")
});

export const shifts = sqliteTable("shifts", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  staff_id: text("staff_id").notNull().references(() => staff.id),
  terminal_id: text("terminal_id").notNull().references(() => terminals.id),
  status: text("status").notNull(),
  opening_paise: integer("opening_paise").notNull(),
  expected_paise: integer("expected_paise"),
  actual_paise: integer("actual_paise"),
  variance_paise: integer("variance_paise"),
  opened_at: text("opened_at").notNull(),
  closed_at: text("closed_at"),
  notes: text("notes"),
  summary_json: text("summary_json"),
  version: integer("version").notNull().default(1)
},t=>[uniqueIndex("one_open_shift").on(t.terminal_id).where(sql`${t.status}='Open'`)]);

export const table_sections = sqliteTable("table_sections", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  name: text("name").notNull(),
  sort: integer("sort").notNull().default(0),
  active: integer("active").notNull().default(1),
  version: integer("version").notNull().default(1)
});

export const dining_tables = sqliteTable("dining_tables", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  section_id: text("section_id").references(() => table_sections.id),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull(),
  status: text("status").notNull().default("Available"),
  sort: integer("sort").notNull().default(0),
  active: integer("active").notNull().default(1),
  version: integer("version").notNull().default(1)
},t=>[uniqueIndex("idx_dining_tables_location_id_name").on(t.location_id,t.name),check("check_dining_tables_0",sql`capacity > 0`)]);

export const customers = sqliteTable("customers", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  birthday: text("birthday"),
  anniversary: text("anniversary"),
  notes: text("notes"),
  active: integer("active").notNull().default(1),
  version: integer("version").notNull().default(1),
  created_at: text("created_at").notNull()
},t=>[uniqueIndex("idx_customers_location_id_phone").on(t.location_id,t.phone)]);

export const reservations = sqliteTable("reservations", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  customer_id: text("customer_id").references(() => customers.id),
  table_id: text("table_id").references(() => dining_tables.id),
  starts_at: text("starts_at").notNull(),
  party_size: integer("party_size").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
  version: integer("version").notNull().default(1)
});

export const categories = sqliteTable("categories", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  name: text("name").notNull(),
  sort: integer("sort").notNull().default(0),
  active: integer("active").notNull().default(1),
  version: integer("version").notNull().default(1)
});

export const printers = sqliteTable("printers", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  width: text("width").notNull().default("80"),
  copies: integer("copies").notNull().default(1),
  adapter: text("adapter").notNull().default("browser"),
  active: integer("active").notNull().default(1),
  version: integer("version").notNull().default(1)
});

export const stations = sqliteTable("stations", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  name: text("name").notNull(),
  printer_id: text("printer_id").references(() => printers.id),
  overdue_minutes: integer("overdue_minutes"),
  active: integer("active").notNull().default(1),
  version: integer("version").notNull().default(1)
});

export const tax_profiles = sqliteTable("tax_profiles", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  name: text("name").notNull(),
  components_json: text("components_json").notNull(),
  inclusive: integer("inclusive").notNull().default(0),
  active: integer("active").notNull().default(1),
  version: integer("version").notNull().default(1)
});

export const menu_items = sqliteTable("menu_items", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  name: text("name").notNull(),
  display_name: text("display_name"),
  category_id: text("category_id").notNull().references(() => categories.id),
  subcategory: text("subcategory"),
  sku: text("sku"),
  diet: text("diet").notNull().default("unspecified"),
  price_paise: integer("price_paise"),
  tax_profile_id: text("tax_profile_id").references(() => tax_profiles.id),
  station_id: text("station_id").references(() => stations.id),
  prep_minutes: integer("prep_minutes"),
  available: integer("available").notNull().default(1),
  unavailable_until: text("unavailable_until"),
  active: integer("active").notNull().default(1),
  signature: integer("signature").notNull().default(0),
  channels_json: text("channels_json").notNull(),
  description: text("description"),
  image_id: text("image_id"),
  sort: integer("sort").notNull().default(0),
  version: integer("version").notNull().default(1),
  created_at: text("created_at").notNull()
},t=>[index("idx_menu_items_location_id_category_id").on(t.location_id,t.category_id),check("check_menu_items_0",sql`price_paise IS NULL OR price_paise >= 0`)]);

export const modifier_groups = sqliteTable("modifier_groups", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  name: text("name").notNull(),
  required: integer("required").notNull().default(0),
  multiple: integer("multiple").notNull().default(0),
  min: integer("min").notNull().default(0),
  max: integer("max").notNull().default(1),
  active: integer("active").notNull().default(1),
  version: integer("version").notNull().default(1)
});

export const modifiers = sqliteTable("modifiers", {
  id: text('id').primaryKey(),
  group_id: text("group_id").notNull().references(() => modifier_groups.id),
  name: text("name").notNull(),
  price_paise: integer("price_paise").notNull().default(0),
  active: integer("active").notNull().default(1),
  version: integer("version").notNull().default(1)
});

export const menu_item_modifiers = sqliteTable("menu_item_modifiers", {
  id: text('id').primaryKey(),
  menu_item_id: text("menu_item_id").notNull().references(() => menu_items.id),
  group_id: text("group_id").notNull().references(() => modifier_groups.id)
},t=>[uniqueIndex("idx_menu_item_modifiers_menu_item_id_group_id").on(t.menu_item_id,t.group_id)]);

export const orders = sqliteTable("orders", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  number: text("number").notNull(),
  type: text("type").notNull(),
  source: text("source"),
  customer_id: text("customer_id").references(() => customers.id),
  waiter_id: text("waiter_id").references(() => staff.id),
  created_by: text("created_by").notNull().references(() => staff.id),
  terminal_id: text("terminal_id").references(() => terminals.id),
  status: text("status").notNull(),
  held: integer("held").notNull().default(0),
  guest_count: integer("guest_count").notNull().default(1),
  notes: text("notes"),
  subtotal_paise: integer("subtotal_paise").notNull().default(0),
  discount_json: text("discount_json").notNull().default("{}"),
  charges_json: text("charges_json").notNull().default("{}"),
  merged_into: text("merged_into"),
  version: integer("version").notNull().default(1),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull()
},t=>[uniqueIndex("idx_orders_location_id_number").on(t.location_id,t.number),index("idx_orders_location_id_created_at").on(t.location_id,t.created_at),index("idx_orders_customer_id").on(t.customer_id)]);

export const table_assignments = sqliteTable("table_assignments", {
  id: text('id').primaryKey(),
  table_id: text("table_id").notNull().references(() => dining_tables.id),
  order_id: text("order_id").notNull().references(() => orders.id),
  assigned_at: text("assigned_at").notNull()
},t=>[uniqueIndex("idx_table_assignments_table_id").on(t.table_id),index("idx_table_assignments_order_id").on(t.order_id)]);

export const order_items = sqliteTable("order_items", {
  id: text('id').primaryKey(),
  order_id: text("order_id").notNull().references(() => orders.id),
  menu_item_id: text("menu_item_id").notNull().references(() => menu_items.id),
  name: text("name").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull(),
  unit_paise: integer("unit_paise").notNull(),
  modifier_paise: integer("modifier_paise").notNull().default(0),
  modifiers_json: text("modifiers_json").notNull().default("[]"),
  note: text("note"),
  seat: text("seat"),
  discount_paise: integer("discount_paise").notNull().default(0),
  discount_reason: text("discount_reason"),
  station_id: text("station_id").references(() => stations.id),
  tax_json: text("tax_json").notNull().default("null"),
  sent_qty: integer("sent_qty").notNull().default(0),
  voided: integer("voided").notNull().default(0),
  void_reason: text("void_reason"),
  created_at: text("created_at").notNull()
},t=>[index("idx_order_items_order_id").on(t.order_id),check("check_order_items_0",sql`quantity > 0 AND sent_qty >= 0 AND sent_qty <= quantity`),check("check_order_items_1",sql`unit_paise >= 0 AND modifier_paise >= 0 AND discount_paise >= 0`)]);

export const kots = sqliteTable("kots", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  order_id: text("order_id").notNull().references(() => orders.id),
  station_id: text("station_id").references(() => stations.id),
  number: text("number").notNull(),
  status: text("status").notNull(),
  created_by: text("created_by").notNull().references(() => staff.id),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
  version: integer("version").notNull().default(1)
},t=>[index("idx_kots_location_id_status").on(t.location_id,t.status),index("idx_kots_order_id").on(t.order_id)]);

export const kot_items = sqliteTable("kot_items", {
  id: text('id').primaryKey(),
  kot_id: text("kot_id").notNull().references(() => kots.id),
  order_item_id: text("order_item_id").notNull().references(() => order_items.id),
  quantity: integer("quantity").notNull(),
  snapshot_json: text("snapshot_json").notNull()
});

export const sequences = sqliteTable("sequences", {
  id: text('id').primaryKey(),
  value: integer("value").notNull()
});

export const invoices = sqliteTable("invoices", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  order_id: text("order_id").notNull().references(() => orders.id),
  number: text("number").notNull(),
  subtotal_paise: integer("subtotal_paise").notNull(),
  discount_paise: integer("discount_paise").notNull(),
  tax_paise: integer("tax_paise").notNull(),
  charges_paise: integer("charges_paise").notNull(),
  round_paise: integer("round_paise").notNull(),
  total_paise: integer("total_paise").notNull(),
  snapshot_json: text("snapshot_json").notNull(),
  finalized_by: text("finalized_by").notNull().references(() => staff.id),
  finalized_at: text("finalized_at").notNull()
},t=>[uniqueIndex("idx_invoices_order_id").on(t.order_id),uniqueIndex("idx_invoices_number").on(t.number),index("idx_invoices_location_id_finalized_at").on(t.location_id,t.finalized_at),check("check_invoices_0",sql`total_paise >= 0`)]);

export const bill_shares = sqliteTable("bill_shares", {
  id: text('id').primaryKey(),
  invoice_id: text("invoice_id").notNull().references(() => invoices.id),
  label: text("label").notNull(),
  amount_paise: integer("amount_paise").notNull(),
  allocation_json: text("allocation_json").notNull(),
  active: integer("active").notNull().default(1),
  created_at: text("created_at").notNull()
});

export const payments = sqliteTable("payments", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  invoice_id: text("invoice_id").notNull().references(() => invoices.id),
  share_id: text("share_id").references(() => bill_shares.id),
  shift_id: text("shift_id").references(() => shifts.id),
  method: text("method").notNull(),
  amount_paise: integer("amount_paise").notNull(),
  tendered_paise: integer("tendered_paise"),
  change_paise: integer("change_paise").notNull().default(0),
  reference: text("reference"),
  actor_id: text("actor_id").notNull().references(() => staff.id),
  terminal_id: text("terminal_id").references(() => terminals.id),
  created_at: text("created_at").notNull()
},t=>[index("idx_payments_invoice_id").on(t.invoice_id),index("idx_payments_shift_id").on(t.shift_id),check("check_payments_0",sql`amount_paise > 0 AND change_paise >= 0`)]);

export const refunds = sqliteTable("refunds", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  invoice_id: text("invoice_id").notNull().references(() => invoices.id),
  shift_id: text("shift_id").references(() => shifts.id),
  amount_paise: integer("amount_paise").notNull(),
  method: text("method").notNull(),
  reason: text("reason").notNull(),
  items_json: text("items_json").notNull(),
  actor_id: text("actor_id").notNull().references(() => staff.id),
  approver_id: text("approver_id").references(() => staff.id),
  created_at: text("created_at").notNull()
},t=>[index("idx_refunds_invoice_id").on(t.invoice_id),check("check_refunds_0",sql`amount_paise > 0`)]);

export const invoice_events = sqliteTable("invoice_events", {
  id: text('id').primaryKey(),
  invoice_id: text("invoice_id").notNull().references(() => invoices.id),
  action: text("action").notNull(),
  reason: text("reason").notNull(),
  actor_id: text("actor_id").notNull().references(() => staff.id),
  created_at: text("created_at").notNull()
});

export const cash_movements = sqliteTable("cash_movements", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  shift_id: text("shift_id").notNull().references(() => shifts.id),
  type: text("type").notNull(),
  amount_paise: integer("amount_paise").notNull(),
  reason: text("reason").notNull(),
  reference: text("reference"),
  actor_id: text("actor_id").notNull().references(() => staff.id),
  created_at: text("created_at").notNull()
});

export const coupons = sqliteTable("coupons", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  code: text("code").notNull(),
  type: text("type").notNull(),
  value: integer("value").notNull(),
  starts_at: text("starts_at"),
  ends_at: text("ends_at"),
  min_paise: integer("min_paise").notNull().default(0),
  active: integer("active").notNull().default(1),
  version: integer("version").notNull().default(1)
},t=>[uniqueIndex("idx_coupons_code").on(t.code)]);

export const units = sqliteTable("units", {
  id: text('id').primaryKey(),
  name: text("name").notNull(),
  dimension: text("dimension").notNull(),
  factor: integer("factor").notNull()
});

export const inventory_items = sqliteTable("inventory_items", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  unit_id: text("unit_id").notNull().references(() => units.id),
  quantity_milli: integer("quantity_milli"),
  minimum_milli: integer("minimum_milli"),
  reorder_milli: integer("reorder_milli"),
  average_cost_paise: integer("average_cost_paise"),
  active: integer("active").notNull().default(1),
  version: integer("version").notNull().default(1),
  created_at: text("created_at").notNull()
});

export const recipes = sqliteTable("recipes", {
  id: text('id').primaryKey(),
  menu_item_id: text("menu_item_id").notNull().references(() => menu_items.id),
  yield_qty: integer("yield_qty").notNull(),
  notes: text("notes"),
  active: integer("active").notNull().default(1),
  version: integer("version").notNull().default(1)
},t=>[uniqueIndex("idx_recipes_menu_item_id").on(t.menu_item_id),check("check_recipes_0",sql`yield_qty > 0`)]);

export const recipe_items = sqliteTable("recipe_items", {
  id: text('id').primaryKey(),
  recipe_id: text("recipe_id").notNull().references(() => recipes.id),
  inventory_item_id: text("inventory_item_id").notNull().references(() => inventory_items.id),
  quantity_milli: integer("quantity_milli").notNull()
},t=>[uniqueIndex("idx_recipe_items_recipe_id_inventory_item_id").on(t.recipe_id,t.inventory_item_id)]);

export const stock_movements = sqliteTable("stock_movements", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  inventory_item_id: text("inventory_item_id").notNull().references(() => inventory_items.id),
  type: text("type").notNull(),
  quantity_milli: integer("quantity_milli").notNull(),
  balance_milli: integer("balance_milli").notNull(),
  cost_paise: integer("cost_paise"),
  reference: text("reference").notNull(),
  reason: text("reason").notNull(),
  actor_id: text("actor_id").notNull().references(() => staff.id),
  created_at: text("created_at").notNull()
},t=>[uniqueIndex("idx_stock_movements_inventory_item_id_type_reference").on(t.inventory_item_id,t.type,t.reference),index("idx_stock_movements_location_id_created_at").on(t.location_id,t.created_at)]);

export const stock_counts = sqliteTable("stock_counts", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  status: text("status").notNull(),
  notes: text("notes"),
  created_by: text("created_by").notNull().references(() => staff.id),
  confirmed_by: text("confirmed_by").references(() => staff.id),
  created_at: text("created_at").notNull(),
  confirmed_at: text("confirmed_at"),
  version: integer("version").notNull().default(1)
});

export const stock_count_items = sqliteTable("stock_count_items", {
  id: text('id').primaryKey(),
  count_id: text("count_id").notNull().references(() => stock_counts.id),
  inventory_item_id: text("inventory_item_id").notNull().references(() => inventory_items.id),
  expected_milli: integer("expected_milli"),
  actual_milli: integer("actual_milli").notNull(),
  item_version: integer("item_version").notNull(),
  reason: text("reason")
});

export const wastage = sqliteTable("wastage", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  inventory_item_id: text("inventory_item_id").notNull().references(() => inventory_items.id),
  quantity_milli: integer("quantity_milli").notNull(),
  cost_paise: integer("cost_paise"),
  reason: text("reason").notNull(),
  actor_id: text("actor_id").notNull().references(() => staff.id),
  created_at: text("created_at").notNull()
});

export const suppliers = sqliteTable("suppliers", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  name: text("name").notNull(),
  contact: text("contact"),
  phone: text("phone"),
  email: text("email"),
  gstin: text("gstin"),
  address: text("address"),
  products: text("products"),
  notes: text("notes"),
  active: integer("active").notNull().default(1),
  version: integer("version").notNull().default(1),
  created_at: text("created_at").notNull()
});

export const purchases = sqliteTable("purchases", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  supplier_id: text("supplier_id").notNull().references(() => suppliers.id),
  number: text("number").notNull(),
  supplier_invoice: text("supplier_invoice"),
  status: text("status").notNull(),
  date: text("date").notNull(),
  due_date: text("due_date"),
  total_paise: integer("total_paise").notNull(),
  notes: text("notes"),
  created_by: text("created_by").notNull().references(() => staff.id),
  created_at: text("created_at").notNull(),
  version: integer("version").notNull().default(1)
});

export const purchase_items = sqliteTable("purchase_items", {
  id: text('id').primaryKey(),
  purchase_id: text("purchase_id").notNull().references(() => purchases.id),
  inventory_item_id: text("inventory_item_id").notNull().references(() => inventory_items.id),
  quantity_milli: integer("quantity_milli").notNull(),
  received_milli: integer("received_milli").notNull().default(0),
  returned_milli: integer("returned_milli").notNull().default(0),
  unit_cost_paise: integer("unit_cost_paise").notNull(),
  tax_bps: integer("tax_bps").notNull().default(0),
  discount_paise: integer("discount_paise").notNull().default(0),
  total_paise: integer("total_paise").notNull()
});

export const goods_receipts = sqliteTable("goods_receipts", {
  id: text('id').primaryKey(),
  purchase_id: text("purchase_id").notNull().references(() => purchases.id),
  type: text("type").notNull(),
  items_json: text("items_json").notNull(),
  amount_paise: integer("amount_paise").notNull(),
  reason: text("reason"),
  actor_id: text("actor_id").notNull().references(() => staff.id),
  created_at: text("created_at").notNull()
});

export const supplier_payments = sqliteTable("supplier_payments", {
  id: text('id').primaryKey(),
  purchase_id: text("purchase_id").notNull().references(() => purchases.id),
  amount_paise: integer("amount_paise").notNull(),
  method: text("method").notNull(),
  reference: text("reference"),
  actor_id: text("actor_id").notNull().references(() => staff.id),
  created_at: text("created_at").notNull()
});

export const attachments = sqliteTable("attachments", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  name: text("name").notNull(),
  mime: text("mime").notNull(),
  size: integer("size").notNull(),
  object_key: text("object_key").notNull(),
  uploaded_by: text("uploaded_by").notNull().references(() => staff.id),
  created_at: text("created_at").notNull()
});

export const expenses = sqliteTable("expenses", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  amount_paise: integer("amount_paise").notNull(),
  date: text("date").notNull(),
  category: text("category").notNull(),
  method: text("method").notNull(),
  description: text("description").notNull(),
  attachment_id: text("attachment_id").references(() => attachments.id),
  shift_id: text("shift_id").references(() => shifts.id),
  status: text("status").notNull(),
  authorized_by: text("authorized_by").notNull().references(() => staff.id),
  created_at: text("created_at").notNull(),
  version: integer("version").notNull().default(1)
});

export const loyalty_transactions = sqliteTable("loyalty_transactions", {
  id: text('id').primaryKey(),
  customer_id: text("customer_id").notNull().references(() => customers.id),
  invoice_id: text("invoice_id").references(() => invoices.id),
  points: integer("points").notNull(),
  type: text("type").notNull(),
  reference: text("reference").notNull(),
  expires_at: text("expires_at"),
  created_at: text("created_at").notNull(),
  actor_id: text("actor_id").notNull().references(() => staff.id)
},t=>[uniqueIndex("idx_loyalty_transactions_customer_id_type_reference").on(t.customer_id,t.type,t.reference)]);

export const audit_logs = sqliteTable("audit_logs", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  actor_id: text("actor_id").notNull().references(() => staff.id),
  actor_name: text("actor_name").notNull(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entity_id: text("entity_id").notNull(),
  old_json: text("old_json"),
  new_json: text("new_json"),
  reason: text("reason"),
  approver_id: text("approver_id"),
  terminal_id: text("terminal_id"),
  session_id: text("session_id"),
  created_at: text("created_at").notNull()
},t=>[index("idx_audit_logs_location_id_created_at").on(t.location_id,t.created_at)]);

export const idempotency = sqliteTable("idempotency", {
  id: text('id').primaryKey(),
  actor_id: text("actor_id").notNull().references(() => staff.id),
  action: text("action").notNull(),
  request_hash: text("request_hash").notNull(),
  response_json: text("response_json").notNull(),
  created_at: text("created_at").notNull()
});

export const mutation_guards = sqliteTable("mutation_guards", {
  id: text('id').primaryKey(),
  ok: integer("ok").notNull()
},()=>[check("check_mutation_guards_0",sql`ok = 1`)]);

export const notifications = sqliteTable("notifications", {
  id: text('id').primaryKey(),
  location_id: text("location_id").notNull().references(() => locations.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  entity_id: text("entity_id"),
  created_at: text("created_at").notNull(),
  acknowledged_at: text("acknowledged_at"),
  acknowledged_by: text("acknowledged_by").references(() => staff.id)
});
