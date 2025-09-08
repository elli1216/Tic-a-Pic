import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id } = body;

    // Validate input
    if (!session_id || typeof session_id !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Invalid session_id format' },
        { status: 400 }
      );
    }

    // Validate session_id format (XXXX-XXXX-XXXX)
    const sessionIdRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!sessionIdRegex.test(session_id)) {
      return NextResponse.json(
        { valid: false, error: 'Invalid session_id format' },
        { status: 400 }
      );
    }

    // Check if session exists in database and get session data
    const { data, error } = await supabaseAdmin
      .from('sessions')
      .select('session_id, nickname, created_at')
      .eq('session_id', session_id)
      .limit(1)
      .single();

    if (error) {
      // Session not found or other error
      return NextResponse.json({ valid: false });
    }

    // Session exists - return session data
    return NextResponse.json({
      valid: true,
      session: {
        session_id: data.session_id,
        nickname: data.nickname || null,
        created_at: data.created_at,
      },
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
