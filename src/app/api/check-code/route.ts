import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("premium_codes")
      .select("code, is_active, expires_at")
      .eq("code", code.trim().toUpperCase())
      .single();

    if (error || !data) {
      // Don't leak whether code exists or not
      return NextResponse.json({ valid: false });
    }

    // Check if code is active
    if (!data.is_active) {
      return NextResponse.json({ valid: false });
    }

    // Check if code is expired (if expires_at is set)
    if (data.expires_at) {
      const expiresAt = new Date(data.expires_at);
      const now = new Date();
      if (now > expiresAt) {
        return NextResponse.json({ valid: false });
      }
    }

    return NextResponse.json({
      valid: true,
      expires_at: data.expires_at || undefined,
    });
  } catch (error) {
    console.error("Check code error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}