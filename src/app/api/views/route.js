import { NextResponse } from 'next/server';
import { db } from '@/lib/db/index.js';
import { pageViews } from '@/lib/db/schema.js';
import { eq, desc, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// Zapewnia ze tabela istnieje (tworzy jesli nie)
async function ensureTable() {
  try {
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS page_views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        count INTEGER NOT NULL DEFAULT 0
      )
    `);
  } catch {}
}

/**
 * POST /api/views - zlicza jedno wejscie na strone (wywolywane przez layout)
 */
export async function POST() {
  try {
    await ensureTable();
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const existing = await db.select().from(pageViews).where(eq(pageViews.date, today)).limit(1);

    if (existing.length > 0) {
      await db.update(pageViews)
        .set({ count: existing[0].count + 1 })
        .where(eq(pageViews.date, today));
    } else {
      await db.insert(pageViews).values({ date: today, count: 1 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/views - zwraca statystyki odwiedzin (tylko dla admina)
 */
export async function GET() {
  try {
    await ensureTable();

    // Ostatnie 30 dni
    const rows = await db.select()
      .from(pageViews)
      .orderBy(desc(pageViews.date))
      .limit(30);

    const total = rows.reduce((sum, r) => sum + r.count, 0);

    // Dzisiaj
    const today = new Date().toISOString().slice(0, 10);
    const todayRow = rows.find(r => r.date === today);
    const todayCount = todayRow?.count || 0;

    // Ten tydzien (ostatnie 7 dni)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const weekCount = rows.filter(r => r.date >= weekAgo).reduce((sum, r) => sum + r.count, 0);

    return NextResponse.json({
      success: true,
      data: {
        today: todayCount,
        week: weekCount,
        month: total,
        daily: rows.reverse(), // od najstarszych do najnowszych (dla wykresu)
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
