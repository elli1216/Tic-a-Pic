import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Feedback } from '@/shared/types/TYPES';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, message, session_id } = body;

    // Validate required fields
    if (!type || !['bug', 'feature'].includes(type)) {
      return NextResponse.json(
        { error: "Type must be 'bug' or 'feature'" },
        { status: 400 }
      );
    }

    if (
      !message ||
      typeof message !== 'string' ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get device info from request headers
    const userAgent = request.headers.get('user-agent') || '';
    const deviceInfo = {
      userAgent,
      platform: userAgent.includes('Mobile') ? 'mobile' : 'desktop',
    };

    // Save feedback
    const { error } = await supabaseAdmin
      .from('feedback')
      .insert({
        type,
        message: message.trim(),
        session_id: session_id || null,
        device_info: deviceInfo,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Feedback save error:', error);
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
