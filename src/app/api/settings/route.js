import { NextResponse } from 'next/server';
import { getSettingsMap, setSetting } from '@/lib/db/queries.js';
import { getSession } from '@/lib/auth.js';

export const dynamic = 'force-dynamic';

/**
 * GET /api/settings
 * Pobiera mapę wszystkich ustawień sklepu
 */
export async function GET() {
  try {
    const settings = await getSettingsMap();
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Błąd GET /api/settings:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd pobierania ustawień.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/settings
 * Aktualizuje podane ustawienia (wymaga sesji admina)
 */
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Brak uprawnień. Zaloguj się.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowe dane wejściowe.' },
        { status: 400 }
      );
    }

    // Aktualizujemy każdy przekazany klucz
    for (const [key, value] of Object.entries(body)) {
      if (typeof key === 'string' && key.trim() !== '') {
        await setSetting(key.trim(), value);
      }
    }

    const updated = await getSettingsMap();

    return NextResponse.json({
      success: true,
      message: 'Ustawienia zostały pomyślnie zaktualizowane.',
      data: updated,
    });
  } catch (error) {
    console.error('Błąd POST /api/settings:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd zapisu ustawień: ' + error.message },
      { status: 500 }
    );
  }
}
