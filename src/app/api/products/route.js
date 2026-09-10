import { NextResponse } from 'next/server';
import { db } from '@/lib/db/index.js';
import { products } from '@/lib/db/schema.js';
import { getProducts } from '@/lib/db/queries.js';

export const dynamic = 'force-dynamic';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-ąćęłńóśźż]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * GET /api/products
 * Filtry: search, category, availability, manufacturer, featured, sort, limit, offset
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const availability = searchParams.get('availability') || '';
    const manufacturer = searchParams.get('manufacturer') || '';
    const featuredParam = searchParams.get('featured');
    const featured = featuredParam !== null ? featuredParam === 'true' || featuredParam === '1' : null;
    const sort = searchParams.get('sort') || 'newest';
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    const limit = limitParam ? parseInt(limitParam, 10) : null;
    const offset = offsetParam ? parseInt(offsetParam, 10) : null;

    const data = await getProducts({
      search,
      category,
      availability,
      manufacturer,
      featured,
      sort,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error('Błąd GET /api/products:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd pobierania produktów' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Tworzenie nowego produktu z walidacją po stronie serwera (gotowe pod panel admina)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const errors = [];

    // Walidacja nazwy
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      errors.push('Nazwa produktu jest wymagana i musi mieć co najmniej 2 znaki.');
    }

    // Walidacja ceny
    let price = null;
    if (body.price !== undefined && body.price !== null && body.price !== '') {
      const numPrice = parseFloat(body.price);
      if (isNaN(numPrice) || numPrice < 0) {
        errors.push('Cena musi być poprawną liczbą dodatnią lub pusta.');
      } else {
        price = Math.round(numPrice * 100) / 100;
      }
    }

    // Walidacja dostępności
    const validStatuses = ['available', 'low', 'unavailable', 'on_order'];
    const availability = body.availability || 'available';
    if (!validStatuses.includes(availability)) {
      errors.push(`Status dostępności musi być jednym z: ${validStatuses.join(', ')}.`);
    }

    // Walidacja ilości
    let quantity = null;
    if (body.quantity !== undefined && body.quantity !== null && body.quantity !== '') {
      const numQty = parseInt(body.quantity, 10);
      if (isNaN(numQty) || numQty < 0) {
        errors.push('Ilość musi być nieujemną liczbą całkowitą.');
      } else {
        quantity = numQty;
      }
    }

    // Walidacja kategorii
    let categoryId = null;
    if (body.categoryId || body.category_id) {
      const parsedCat = parseInt(body.categoryId || body.category_id, 10);
      if (!isNaN(parsedCat)) {
        categoryId = parsedCat;
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Generowanie sluga
    const baseSlug = slugify(body.name);
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newProduct = {
      name: body.name.trim(),
      slug: body.slug ? slugify(body.slug) : slug,
      description: body.description ? body.description.trim() : null,
      categoryId,
      manufacturer: body.manufacturer ? body.manufacturer.trim() : null,
      price,
      availability,
      quantity,
      quantityLabel: body.quantityLabel || body.quantity_label || null,
      imageUrl: body.imageUrl || body.image_url || null,
      isFeatured: Boolean(body.isFeatured || body.is_featured),
    };

    const inserted = await db.insert(products).values(newProduct).returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Produkt został pomyślnie dodany.',
        data: inserted[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Błąd POST /api/products:', error);
    return NextResponse.json(
      { success: false, error: 'Nie udało się dodać produktu: ' + error.message },
      { status: 500 }
    );
  }
}
