import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate source
    if (!source || !['homepage', 'success-page'].includes(source)) {
      return NextResponse.json(
        { error: "Source must be 'homepage' or 'success-page'" },
        { status: 400 }
      );
    }

    // Insert email subscription
    const { data, error } = await supabaseAdmin
      .from('email_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        source,
        subscribed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505') {
        return NextResponse.json({ success: true }); // Don't expose that email already exists
      }

      console.error('Email subscription error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
