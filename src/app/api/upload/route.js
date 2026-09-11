import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth.js';

export const dynamic = 'force-dynamic';

/**
 * POST /api/upload
 * Odbiera plik (np. po przycięciu w ImageCropperModal) i zwraca
 * data URL (base64), który jest zapisywany bezpośrednio w bazie SQLite.
 * Dzięki temu zdjęcia NIE znikają po restarcie/deploymencie na Render.com.
 */
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Musisz być zalogowany, aby wgrywać zdjęcia.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'Nie przesłano żadnego pliku.' },
        { status: 400 }
      );
    }

    // Limit wielkości pliku do 8MB (po kompresji w przeglądarce powinno być dużo mniej)
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Plik jest zbyt duży (maks. 8MB). Przytnij zdjęcie w kadrowniku.' },
        { status: 400 }
      );
    }

    // Ustal typ MIME
    const mimeType = file.type && file.type.startsWith('image/')
      ? file.type
      : 'image/jpeg';

    // Konwertuj do base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      message: 'Zdjęcie zostało pomyślnie wgrane!',
    });
  } catch (error) {
    console.error('Błąd uploadu zdjęcia:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd podczas wgrywania zdjęcia: ' + error.message },
      { status: 500 }
    );
  }
}
