import { pgTable, serial, varchar, text, timestamp, integer, decimal, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";

export const USER_ROLES = ["user", "admin"] as const;
export const userRoleEnum = pgEnum("user_role", USER_ROLES);

// USER AUTH: akun untuk register dan login
export const UserAuth = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true,}).defaultNow().notNull(),
});

// CATEGORIES
export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
});

// PRODUCTS
export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categoriesTable.id, { onDelete: "set null" }),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url"),
  imagePublicId: varchar("image_public_id", { length: 255 }),
  createdAt: timestamp("created_at", {withTimezone: true}).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", {withTimezone: true}).defaultNow().notNull(),
});

// SAVED PRODUCTS
export const savedProductsTable = pgTable("saved_products",{
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => UserAuth.id, { onDelete: "cascade" }),
    productId: integer("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", {withTimezone: true}).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("saved_products_user_product_unique").on(
      table.userId,
      table.productId
    ),
  ]
);

// CART ITEMS
export const cartItemsTable = pgTable("cart_items", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => UserAuth.id, { onDelete: "cascade" }),
    productId: integer("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at", {withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", {withTimezone: true}).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("cart_items_user_product_unique").on(
      table.userId,
      table.productId
    ),
  ]
);
