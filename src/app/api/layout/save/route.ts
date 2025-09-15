import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, name, config_json } = body;

    // Validate required fields
    if (!session_id || typeof session_id !== 'string') {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Layout name is required' },
        { status: 400 }
      );
    }

    if (!config_json || typeof config_json !== 'string') {
      return NextResponse.json(
        { error: 'Layout configuration is required' },
        { status: 400 }
      );
    }

    // Validate that session_id exists
    const { data: sessionData, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .select('session_id')
      .eq('session_id', session_id)
      .single();

    if (sessionError || !sessionData) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Validate that config_json is valid JSON
    try {
      JSON.parse(config_json);
    } catch {
      return NextResponse.json(
        { error: 'Invalid layout configuration' },
        { status: 400 }
      );
    }

    // Save the user layout
    const { error } = await supabaseAdmin
      .from('user_layouts')
      .insert({
        session_id,
        name: name.trim(),
        config_json,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Save layout error:', error);
      return NextResponse.json(
        { error: 'Failed to save layout' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save layout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
