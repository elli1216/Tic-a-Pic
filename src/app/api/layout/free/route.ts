import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST() {
  try {
    const { data, error } = await supabaseAdmin
      .from('layouts')
      .select('*')
      .eq('type', 'free')
      .order('name', { ascending: true });

    if (error) {
      
      return NextResponse.json(
        { error: 'Failed to fetch layouts' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
