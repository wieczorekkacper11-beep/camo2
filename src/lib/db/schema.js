import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ---------- Categories ----------
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  imageUrl: text('image_url'),
  sortOrder: integer('sort_order').default(0),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
});

// ---------- Products ----------
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  categoryId: integer('category_id').references(() => categories.id),
  manufacturer: text('manufacturer'),
  price: real('price'), // NULL = "Cena dostępna w sklepie"
  availability: text('availability').default('available'), // available | low | unavailable | on_order
  quantity: integer('quantity'), // dokładna ilość — widoczna tylko w panelu admina
  quantityLabel: text('quantity_label'), // dużo | mała ilość | brak — opcja ręczna
  imageUrl: text('image_url'),
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

// ---------- Settings ----------
export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value'),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

// ---------- Users (admin) ----------
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
});
