import { NextResponse } from 'next/server';
import { db } from '@/lib/db/index.js';
import { news } from '@/lib/db/schema.js';
import { desc, eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth.js';

export const dynamic = 'force-dynamic';

async function ensureTable() {
  try {
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        image_url TEXT,
        is_pinned INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);
  } catch {}
}

/** GET /api/news - publiczne, zwraca aktualnosci */
export async function GET() {
  try {
    await ensureTable();
    const rows = await db.select().from(news).orderBy(desc(news.isPinned), desc(news.createdAt)).limit(20);
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/** POST /api/news - tylko admin, tworzy nowy post */
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: 'Brak uprawnien.' }, { status: 401 });

    await ensureTable();
    const body = await request.json();

    if (!body.title || body.title.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Tytul jest wymagany.' }, { status: 400 });
    }

    const inserted = await db.insert(news).values({
      title: body.title.trim(),
      content: body.content ? body.content.trim() : null,
      imageUrl: body.imageUrl || null,
      isPinned: body.isPinned ? 1 : 0,
    }).returning();

    return NextResponse.json({ success: true, data: inserted[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
