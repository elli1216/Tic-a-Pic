import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-07-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Generate random premium code (e.g., "TAP-7X9K-P2MN")
function generatePremiumCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = [];

  // First segment: 3 chars
  let segment1 = '';
  for (let i = 0; i < 3; i++) {
    segment1 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  segments.push(segment1);

  // Second segment: 4 chars
  let segment2 = '';
  for (let i = 0; i < 4; i++) {
    segment2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  segments.push(segment2);

  // Third segment: 4 chars
  let segment3 = '';
  for (let i = 0; i < 4; i++) {
    segment3 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  segments.push(segment3);

  return segments.join('-');
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
      throw new Error('Missing signature or endpoint secret');
    }

    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: Error | unknown) {
    if (err instanceof Error) {
      console.error('Webhook signature verification failed:', err.message);
    } else {
      console.error('Webhook signature verification failed:', err);
    }
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Generate unique premium code
      let premiumCode: string;
      let attempts = 0;
      const maxAttempts = 5;

      do {
        premiumCode = generatePremiumCode();
        attempts++;

        // Check if code already exists
        const { error: existingError } = await supabaseAdmin
          .from('premium_codes')
          .select('code')
          .eq('code', premiumCode)
          .single();

        if (!existingError) break;

        if (attempts >= maxAttempts) {
          throw new Error('Failed to generate unique premium code');
        }
      } while (attempts < maxAttempts);

      // Calculate expiration date (30 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Save premium code to database
      const { error } = await supabaseAdmin.from('premium_codes').insert({
        code: premiumCode,
        is_active: true,
        payment_id: paymentIntent.id,
        email: paymentIntent.receipt_email || null,
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      });

      if (error) {
        console.error('Failed to save premium code:', error);
        return NextResponse.json(
          { error: 'Failed to save premium code' },
          { status: 500 }
        );
      }

      console.log(
        `Premium code generated: ${premiumCode} for payment ${paymentIntent.id}`
      );

      // TODO: Send email with premium code if email is available
      // This could be implemented with a service like SendGrid, Resend, etc.
      if (paymentIntent.receipt_email) {
        console.log(
          `TODO: Send premium code ${premiumCode} to ${paymentIntent.receipt_email}`
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
