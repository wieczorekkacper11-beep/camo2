import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSession } from '@/lib/auth.js';

export const dynamic = 'force-dynamic';

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

    // Limit wielkości pliku do 15MB
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Plik jest zbyt duży (maks. 15MB).' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsFolder = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsFolder)) {
      fs.mkdirSync(uploadsFolder, { recursive: true });
    }

    // Rozszerzenie pliku
    const originalName = file.name || 'image.jpg';
    let ext = path.extname(originalName).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
    if (!allowedExts.includes(ext)) {
      ext = '.jpg';
    }

    const uniqueName = `camo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;
    const targetFilePath = path.join(uploadsFolder, uniqueName);

    fs.writeFileSync(targetFilePath, buffer);

    const publicUrl = `/api/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueName,
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
