import { NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabase-admin';
import { Sticker } from '@/shared/types/TYPES';

export async function GET() {
  try {
    // Get list of stickers from Supabase Storage
    const { data: defaultStickers, error: defaultError } =
      await supabaseAnon.storage.from('stickers').list('default', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' },
      });

    const { data: uploadedStickers, error: uploadedError } =
      await supabaseAnon.storage.from('stickers').list('uploaded', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (defaultError && defaultError.message !== 'The resource was not found') {
      console.error('Default stickers fetch error:', defaultError);
    }

    if (
      uploadedError &&
      uploadedError.message !== 'The resource was not found'
    ) {
      console.error('Uploaded stickers fetch error:', uploadedError);
    }

    const stickers: Sticker[] = [];

    // Process default stickers
    if (defaultStickers) {
      for (const file of defaultStickers) {
        if (file.name && !file.name.includes('/')) {
          const { data } = supabaseAnon.storage
            .from('stickers')
            .getPublicUrl(`default/${file.name}`);

          stickers.push({
            id: `default-${file.name}`,
            name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
            url: data.publicUrl,
            category: 'default',
          });
        }
      }
    }

    // Process uploaded stickers
    if (uploadedStickers) {
      for (const file of uploadedStickers) {
        if (file.name && !file.name.includes('/')) {
          const { data } = supabaseAnon.storage
            .from('stickers')
            .getPublicUrl(`uploaded/${file.name}`);

          stickers.push({
            id: `uploaded-${file.name}`,
            name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
            url: data.publicUrl,
            category: 'uploaded',
          });
        }
      }
    }

    return NextResponse.json(stickers);
  } catch (error) {
    console.error('Sticker list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
