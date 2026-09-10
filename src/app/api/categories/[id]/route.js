import { NextResponse } from 'next/server';
import { db } from '@/lib/db/index.js';
import { categories, products } from '@/lib/db/schema.js';
import { eq } from 'drizzle-orm';

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
 * GET /api/categories/[id]
 * Pobiera kategorię po ID lub slug
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const catId = parseInt(id, 10);
    const condition = !isNaN(catId) ? eq(categories.id, catId) : eq(categories.slug, id);

    const rows = await db.select().from(categories).where(condition).limit(1);
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Kategoria nie została odnaleziona.' },
        { status: 404 }
      );
    }

    // Pobierz produkty z tej kategorii
    const categoryProducts = await db
      .select()
      .from(products)
      .where(eq(products.categoryId, rows[0].id));

    return NextResponse.json({
      success: true,
      data: {
        ...rows[0],
        products: categoryProducts,
      },
    });
  } catch (error) {
    console.error(`Błąd GET /api/categories/[id]:`, error);
    return NextResponse.json(
      { success: false, error: 'Błąd pobierania kategorii.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/categories/[id]
 * Aktualizacja kategorii
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const catId = parseInt(id, 10);
    if (isNaN(catId)) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowe ID kategorii.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateData = {};

    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length < 2) {
        return NextResponse.json(
          { success: false, error: 'Nazwa kategorii musi mieć co najmniej 2 znaki.' },
          { status: 400 }
        );
      }
      updateData.name = body.name.trim();
    }

    if (body.slug !== undefined) {
      updateData.slug = slugify(body.slug);
    }

    if (body.sortOrder !== undefined || body.sort_order !== undefined) {
      updateData.sortOrder = parseInt(body.sortOrder || body.sort_order, 10) || 0;
    }

    if (body.imageUrl !== undefined || body.image_url !== undefined) {
      updateData.imageUrl = body.imageUrl || body.image_url || null;
    }

    const updated = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, catId))
      .returning();

    if (!updated || updated.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Kategoria nie istnieje.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kategoria zaktualizowana.',
      data: updated[0],
    });
  } catch (error) {
    console.error(`Błąd PUT /api/categories/[id]:`, error);
    return NextResponse.json(
      { success: false, error: 'Błąd aktualizacji kategorii: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id]
 * Usunięcie kategorii
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const catId = parseInt(id, 10);
    if (isNaN(catId)) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowe ID kategorii.' },
        { status: 400 }
      );
    }

    // Odpięcie kategorii od produktów przed usunięciem
    await db
      .update(products)
      .set({ categoryId: null })
      .where(eq(products.categoryId, catId));

    const deleted = await db
      .delete(categories)
      .where(eq(categories.id, catId))
      .returning();

    if (!deleted || deleted.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Kategoria nie została odnaleziona.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kategoria została usunięta.',
      deletedId: catId,
    });
  } catch (error) {
    console.error(`Błąd DELETE /api/categories/[id]:`, error);
    return NextResponse.json(
      { success: false, error: 'Błąd usuwania kategorii: ' + error.message },
      { status: 500 }
    );
  }
}
