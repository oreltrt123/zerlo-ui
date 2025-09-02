import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/supabase/server';

declare module 'stripe' {

}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-07-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_ruDX5wvsOSPjkqiD6dHUwTB0NolxyQvq';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        await supabase.from('subscriptions').upsert({
          user_id: session.metadata?.userId,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer as string,
          status: subscription.status,
          // current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          // current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        // const invoice = event.data.object as Stripe.Invoice;
        // if (invoice) {

        //   await supabase.from('subscriptions').update({
        //     status: subscription.status,
        //     // current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        //     // current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        //   }).eq('stripe_subscription_id', subscription.id);
        // }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase.from('subscriptions').update({
          status: subscription.status,
          // current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          // current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        }).eq('stripe_subscription_id', subscription.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}