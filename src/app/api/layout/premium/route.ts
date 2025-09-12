import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { premium_code } = body;

    if (!premium_code || typeof premium_code !== 'string') {
      return NextResponse.json(
        { error: 'Premium code is required' },
        { status: 400 }
      );
    }

    // First validate the premium code using service_role key
    const { data: codeData, error: codeError } = await supabaseAdmin
      .from('premium_codes')
      .select('code, is_active, expires_at')
      .eq('code', premium_code.trim().toUpperCase())
      .single();

    if (codeError || !codeData) {
      // Invalid code - return empty array (don't expose reason)
      return NextResponse.json([]);
    }

    // Check if code is active
    if (!codeData.is_active) {
      return NextResponse.json([]);
    }

    // Check if code is expired (if expires_at is set)
    if (codeData.expires_at) {
      const expiresAt = new Date(codeData.expires_at);
      const now = new Date();
      if (now > expiresAt) {
        return NextResponse.json([]);
      }
    }

    // Code is valid, fetch premium layouts
    const { data: layouts, error: layoutError } = await supabaseAdmin
      .from('layouts')
      .select('*')
      .eq('type', 'premium')
      .order('name', { ascending: true });

    if (layoutError) {
      console.error('Premium layouts fetch error:', layoutError);
      return NextResponse.json(
        { error: 'Failed to fetch premium layouts' },
        { status: 500 }
      );
    }

    return NextResponse.json(layouts || []);
  } catch (error) {
    console.error('Premium layouts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
