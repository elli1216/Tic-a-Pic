import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('visitor_stats')
      .select('total_visitors, active_now')
      .single();

    if (error) {
      console.error('Visitor stats fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch visitor stats' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      total_visitors: data?.total_visitors || 0,
      active_now: data?.active_now || 0,
    });
  } catch (error) {
    console.error('Visitor stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
