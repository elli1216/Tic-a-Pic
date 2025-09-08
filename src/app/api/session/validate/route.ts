import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use anon key for public session validation
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

    // Check if session exists in database
    const { error } = await supabase
      .from('sessions')
      .select('session_id')
      .eq('session_id', session_id)
      .limit(1)
      .single();

    if (error) {
      // Session not found or other error
      return NextResponse.json({ valid: false });
    }

    // Session exists
    return NextResponse.json({ valid: true });

  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}