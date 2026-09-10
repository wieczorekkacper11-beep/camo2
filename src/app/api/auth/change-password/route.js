import { NextResponse } from 'next/server';
import { getSession, changeAdminPassword } from '@/lib/auth.js';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/change-password
 * Zmiana hasła zalogowanego administratora
 */
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Musisz być zalogowany, aby zmienić hasło.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, error: 'Podaj aktualne hasło.' },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Nowe hasło musi mieć co najmniej 6 znaków.' },
        { status: 400 }
      );
    }

    const result = await changeAdminPassword(session.userId, currentPassword, newPassword);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Hasło zostało pomyślnie zmienione.',
    });
  } catch (error) {
    console.error('Błąd zmiany hasła:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd serwera podczas zmiany hasła.' },
      { status: 500 }
    );
  }
}
