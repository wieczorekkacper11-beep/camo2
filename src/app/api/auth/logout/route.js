import { NextResponse } from 'next/server';
import { logoutAdmin } from '@/lib/auth.js';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await logoutAdmin();
    return NextResponse.json({ success: true, message: 'Wylogowano.' });
  } catch (error) {
    console.error('Błąd wylogowania:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd wylogowania.' },
      { status: 500 }
    );
  }
}
