import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const session_id = searchParams.get('session_id');

    if (!session_id) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      );
    }

    // Fetch strips for the session, including layout information
    const { data: strips, error } = await supabaseClient
      .from('user_strips')
      .select(
        `
        *,
        layouts:layout_id (
          name,
          type,
          config_json,
          thumbnail_url
        )
      `
      )
      .eq('session_id', session_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch strips' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      strips: strips || [],
    });
  } catch (error) {
    console.error('Error in strip list route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
