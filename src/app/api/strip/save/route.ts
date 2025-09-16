import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for backend operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, layout_id, strip_image_data, photo_urls, metadata } =
      body;

    // Validate required input
    if (!session_id || !layout_id || !strip_image_data || !photo_urls) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: session_id, layout_id, strip_image_data, and photo_urls',
        },
        { status: 400 }
      );
    }

    // Validate photo_urls is an array with up to 4 photos
    if (
      !Array.isArray(photo_urls) ||
      photo_urls.length === 0 ||
      photo_urls.length > 4
    ) {
      return NextResponse.json(
        { error: 'photo_urls must be an array with 1-4 photo URLs' },
        { status: 400 }
      );
    }

    // Convert base64 strip image to blob
    const base64Data = strip_image_data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate unique filename for the strip
    const timestamp = Date.now();
    const filename = `${session_id}/strip-${timestamp}.png`;

    // Upload strip image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('strips')
      .upload(filename, buffer, {
        contentType: 'image/png',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload strip image' },
        { status: 500 }
      );
    }

    // Get public URL for the strip image
    const {
      data: { publicUrl },
    } = supabase.storage.from('strips').getPublicUrl(filename);

    // Save strip metadata to database
    const { data: stripRecord, error: dbError } = await supabase
      .from('user_strips')
      .insert({
        session_id,
        layout_id,
        strip_image_url: publicUrl,
        photo_urls: photo_urls, // JSONB array
        metadata: metadata || {}, // JSONB object, default to empty if not provided
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Try to delete the uploaded strip image on database error
      await supabase.storage.from('strips').remove([filename]);
      return NextResponse.json(
        { error: 'Failed to save strip metadata' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      strip: stripRecord,
    });
  } catch (error) {
    console.error('Error in strip save route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
