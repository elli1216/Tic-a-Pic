import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Generate random 12-char session ID (e.g., "A1B2-C3D4-E5F6")
function generateSessionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = [];

  for (let i = 0; i < 3; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }

  return segments.join('-');
}

export async function POST(request: NextRequest) {
  try {
    // Get nickname from request body (optional)
    const body = await request.json().catch(() => ({}));
    const { nickname } = body;

    // Get device info from request headers
    const userAgent = request.headers.get('user-agent') || '';
    const deviceInfo = {
      userAgent,
      platform: request.headers.get('sec-ch-ua-platform') || 'unknown',
    };

    // Generate unique session ID
    let sessionId: string;
    let attempts = 0;
    const maxAttempts = 5;

    do {
      sessionId = generateSessionId();
      attempts++;

      // Check if session ID already exists
      const { data: existing } = await supabaseAdmin
        .from('sessions')
        .select('session_id')
        .eq('session_id', sessionId)
        .single();

      if (!existing) break;

      if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique session ID');
      }
    } while (attempts < maxAttempts);

    // Create session in database
    const { error } = await supabaseAdmin.from('sessions').insert({
      session_id: sessionId,
      nickname: nickname || null,
      device_info: deviceInfo,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Session creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ session_id: sessionId });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
