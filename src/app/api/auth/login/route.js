import { NextResponse } from 'next/server';
import { loginAdmin } from '@/lib/auth.js';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Wprowadź login i hasło.' },
        { status: 400 }
      );
    }

    const result = await loginAdmin(username, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Zalogowano pomyślnie.',
      username: result.username,
    });
  } catch (error) {
    console.error('Błąd logowania:', error);
    return NextResponse.json(
      { success: false, error: 'Nieprawidłowy login lub hasło.' },
      { status: 500 }
    );
  }
}
