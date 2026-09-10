import { NextResponse } from 'next/server';
import { db } from '@/lib/db/index.js';
import { categories } from '@/lib/db/schema.js';
import { getCategories } from '@/lib/db/queries.js';

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
 * GET /api/categories
 * Pobiera wszystkie kategorie z liczbą produktów
 */
export async function GET() {
  try {
    const data = await getCategories();
    return NextResponse.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error('Błąd GET /api/categories:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd pobierania kategorii.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Tworzenie nowej kategorii
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const errors = [];

    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      errors.push('Nazwa kategorii jest wymagana i musi mieć co najmniej 2 znaki.');
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const slug = body.slug ? slugify(body.slug) : slugify(body.name);
    const sortOrder = body.sortOrder || body.sort_order ? parseInt(body.sortOrder || body.sort_order, 10) : 0;
    const imageUrl = body.imageUrl || body.image_url || null;

    const inserted = await db
      .insert(categories)
      .values({
        name: body.name.trim(),
        slug,
        sortOrder,
        imageUrl,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Kategoria została dodana.',
        data: inserted[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Błąd POST /api/categories:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd dodawania kategorii: ' + error.message },
      { status: 500 }
    );
  }
}
