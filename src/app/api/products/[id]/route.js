import { NextResponse } from 'next/server';
import { db } from '@/lib/db/index.js';
import { products } from '@/lib/db/schema.js';
import { getProductById } from '@/lib/db/queries.js';
import { eq, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products/[id]
 * Pobiera pojedynczy produkt po ID lub slug
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Produkt nie został odnaleziony.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(`Błąd GET /api/products/[id]:`, error);
    return NextResponse.json(
      { success: false, error: 'Błąd pobierania produktu.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/[id] (lub PATCH)
 * Aktualizacja produktu z walidacją danych (dla panelu admina)
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const prodId = parseInt(id, 10);
    if (isNaN(prodId)) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowe ID produktu.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const errors = [];
    const updateData = {
      updatedAt: sql`(datetime('now'))`,
    };

    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length < 2) {
        errors.push('Nazwa produktu musi mieć co najmniej 2 znaki.');
      } else {
        updateData.name = body.name.trim();
      }
    }

    if (body.description !== undefined) {
      updateData.description = body.description ? body.description.trim() : null;
    }

    if (body.manufacturer !== undefined) {
      updateData.manufacturer = body.manufacturer ? body.manufacturer.trim() : null;
    }

    if (body.price !== undefined) {
      if (body.price === null || body.price === '') {
        updateData.price = null;
      } else {
        const p = parseFloat(body.price);
        if (isNaN(p) || p < 0) {
          errors.push('Cena musi być liczbą dodatnią lub pusta.');
        } else {
          updateData.price = Math.round(p * 100) / 100;
        }
      }
    }

    if (body.availability !== undefined) {
      const validStatuses = ['available', 'low', 'unavailable', 'on_order'];
      if (!validStatuses.includes(body.availability)) {
        errors.push(`Status dostępności musi być jednym z: ${validStatuses.join(', ')}.`);
      } else {
        updateData.availability = body.availability;
      }
    }

    if (body.quantity !== undefined) {
      if (body.quantity === null || body.quantity === '') {
        updateData.quantity = null;
      } else {
        const q = parseInt(body.quantity, 10);
        if (isNaN(q) || q < 0) {
          errors.push('Ilość musi być nieujemną liczbą całkowitą.');
        } else {
          updateData.quantity = q;
        }
      }
    }

    if (body.quantityLabel !== undefined || body.quantity_label !== undefined) {
      updateData.quantityLabel = body.quantityLabel || body.quantity_label || null;
    }

    if (body.categoryId !== undefined || body.category_id !== undefined) {
      const c = parseInt(body.categoryId || body.category_id, 10);
      updateData.categoryId = !isNaN(c) ? c : null;
    }

    if (body.imageUrl !== undefined || body.image_url !== undefined) {
      updateData.imageUrl = body.imageUrl || body.image_url || null;
    }

    if (body.isFeatured !== undefined || body.is_featured !== undefined) {
      const val = body.isFeatured !== undefined ? body.isFeatured : body.is_featured;
      updateData.isFeatured = Boolean(val);
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const updated = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, prodId))
      .returning();

    if (!updated || updated.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Produkt nie istnieje.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Produkt został zaktualizowany.',
      data: updated[0],
    });
  } catch (error) {
    console.error(`Błąd PUT /api/products/[id]:`, error);
    return NextResponse.json(
      { success: false, error: 'Błąd aktualizacji produktu: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Usunięcie produktu
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const prodId = parseInt(id, 10);
    if (isNaN(prodId)) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowe ID produktu.' },
        { status: 400 }
      );
    }

    const deleted = await db
      .delete(products)
      .where(eq(products.id, prodId))
      .returning();

    if (!deleted || deleted.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Produkt nie został odnaleziony.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Produkt został pomyślnie usunięty.',
      deletedId: prodId,
    });
  } catch (error) {
    console.error(`Błąd DELETE /api/products/[id]:`, error);
    return NextResponse.json(
      { success: false, error: 'Błąd usuwania produktu: ' + error.message },
      { status: 500 }
    );
  }
}
