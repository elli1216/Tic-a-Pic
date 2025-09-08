import { NextResponse } from 'next/server';
import { supabaseAnon } from '@/lib/supabase-admin';
import { Layout } from '@/shared/types/TYPES';

export async function POST() {
  try {
    const { data, error } = await supabaseAnon
      .from('layouts')
      .select('*')
      .eq('type', 'free')
      .order('name', { ascending: true });

    if (error) {
      console.error('Free layouts fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch layouts' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Free layouts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
