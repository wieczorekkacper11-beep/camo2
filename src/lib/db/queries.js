import { db } from './index.js';
import { categories, products } from './schema.js';
import { eq, like, or, and, asc, desc, sql } from 'drizzle-orm';

/**
 * Pobiera wszystkie kategorie z liczbą przypisanych produktów
 */
export async function getCategories() {
  try {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        imageUrl: categories.imageUrl,
        sortOrder: categories.sortOrder,
        createdAt: categories.createdAt,
        productCount: sql`count(${products.id})`.mapWith(Number),
      })
      .from(categories)
      .leftJoin(products, eq(categories.id, products.categoryId))
      .groupBy(categories.id)
      .orderBy(asc(categories.sortOrder), asc(categories.name));

    return result;
  } catch (error) {
    console.error('Błąd pobierania kategorii:', error);
    return [];
  }
}

/**
 * Pobiera kategorię po slug
 */
export async function getCategoryBySlug(slug) {
  try {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error('Błąd pobierania kategorii po slug:', error);
    return null;
  }
}

/**
 * Pobiera listę unikalnych producentów
 */
export async function getManufacturers() {
  try {
    const rows = await db
      .selectDistinct({ manufacturer: products.manufacturer })
      .from(products)
      .where(sql`${products.manufacturer} IS NOT NULL AND ${products.manufacturer} != ''`)
      .orderBy(asc(products.manufacturer));

    return rows.map((r) => r.manufacturer);
  } catch (error) {
    console.error('Błąd pobierania producentów:', error);
    return [];
  }
}

/**
 * Pobiera produkty według zadanych filtrów
 */
export async function getProducts({
  search = '',
  category = '',
  availability = '',
  manufacturer = '',
  featured = null,
  sort = 'newest',
  limit = null,
  offset = null,
} = {}) {
  try {
    const conditions = [];

    // Wyszukiwanie frazy
    if (search && search.trim() !== '') {
      const s = `%${search.trim().toLowerCase()}%`;
      conditions.push(
        or(
          like(sql`lower(${products.name})`, s),
          like(sql`lower(${products.description})`, s),
          like(sql`lower(${products.manufacturer})`, s)
        )
      );
    }

    // Kategoria (slug lub ID)
    if (category && category.trim() !== '') {
      const catNum = parseInt(category, 10);
      if (!isNaN(catNum)) {
        conditions.push(eq(products.categoryId, catNum));
      } else {
        // Po slug
        const cat = await getCategoryBySlug(category.trim());
        if (cat) {
          conditions.push(eq(products.categoryId, cat.id));
        } else {
          // Nie ma takiej kategorii - zwróć pusto
          return [];
        }
      }
    }

    // Dostępność
    if (availability && availability.trim() !== '') {
      conditions.push(eq(products.availability, availability.trim()));
    }

    // Producent
    if (manufacturer && manufacturer.trim() !== '') {
      conditions.push(eq(products.manufacturer, manufacturer.trim()));
    }

    // Polecane
    if (featured !== null) {
      conditions.push(eq(products.isFeatured, featured ? 1 : 0));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Sortowanie
    let orderBy;
    switch (sort) {
      case 'name_asc':
        orderBy = asc(products.name);
        break;
      case 'name_desc':
        orderBy = desc(products.name);
        break;
      case 'price_asc':
        // Ceny NULL na końcu
        orderBy = sql`CASE WHEN ${products.price} IS NULL THEN 1 ELSE 0 END, ${products.price} ASC`;
        break;
      case 'price_desc':
        // Ceny NULL na końcu
        orderBy = sql`CASE WHEN ${products.price} IS NULL THEN 1 ELSE 0 END, ${products.price} DESC`;
        break;
      case 'newest':
      default:
        orderBy = desc(products.id);
        break;
    }

    let query = db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        manufacturer: products.manufacturer,
        price: products.price,
        availability: products.availability,
        quantity: products.quantity,
        quantityLabel: products.quantityLabel,
        imageUrl: products.imageUrl,
        isFeatured: products.isFeatured,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(whereClause)
      .orderBy(orderBy);

    if (limit) {
      query = query.limit(limit);
    }
    if (offset) {
      query = query.offset(offset);
    }

    const rows = await query;
    return rows;
  } catch (error) {
    console.error('Błąd pobierania produktów:', error);
    return [];
  }
}

/**
 * Pobiera pojedynczy produkt po ID lub slug
 */
export async function getProductById(idOrSlug) {
  try {
    const id = parseInt(idOrSlug, 10);
    const condition = !isNaN(id)
      ? eq(products.id, id)
      : eq(products.slug, idOrSlug);

    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        manufacturer: products.manufacturer,
        price: products.price,
        availability: products.availability,
        quantity: products.quantity,
        quantityLabel: products.quantityLabel,
        imageUrl: products.imageUrl,
        isFeatured: products.isFeatured,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(condition)
      .limit(1);

    return rows[0] || null;
  } catch (error) {
    console.error('Błąd pobierania produktu:', error);
    return null;
  }
}

/**
 * Pobiera polecane produkty (np. na stronę główną)
 */
export async function getFeaturedProducts(limit = 6) {
  return getProducts({ featured: true, limit });
}


/**
 * Pobiera mapę wszystkich ustawień sklepu
 */
export async function getSettingsMap() {
  try {
    const { settings } = await import('./schema.js');
    const rows = await db.select().from(settings);
    const map = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }
    return map;
  } catch (error) {
    console.error('Błąd pobierania ustawień:', error);
    return {};
  }
}

/**
 * Aktualizuje lub wstawia ustawienie
 */
export async function setSetting(key, value) {
  try {
    const { settings } = await import('./schema.js');
    const existing = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(settings)
        .set({
          value: value !== null && value !== undefined ? String(value) : null,
          updatedAt: sql`(datetime('now'))`,
        })
        .where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({
        key,
        value: value !== null && value !== undefined ? String(value) : null,
      });
    }
    return true;
  } catch (error) {
    console.error('Błąd zapisu ustawienia ' + key + ':', error);
    throw error;
  }
}
