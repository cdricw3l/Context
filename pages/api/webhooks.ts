//pages/api/webhooks.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { prisma } from '../../lib/prisma';
import { useSession } from 'next-auth/react'; 
  


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

const buffer = (req: NextApiRequest): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    req.on('error', reject);
  });
};

const handleCheckoutSessionCompleted = async (session: Stripe.Checkout.Session) => {
  console.log('Handling checkout.session.completed');
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  try {
    const customer = await stripe.customers.retrieve(customerId);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    console.log('Creating subscription in DB:', subscription);
    await prisma.subscription.create({
      data: {
        id: subscription.id,
        userId: subscription.metadata.userId,
        plan: subscription.items.data[0].price.id,
        status: subscription.status.toUpperCase() as any,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        billingCycleAnchor: new Date(subscription.billing_cycle_anchor * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
        cancellationReason: subscription.cancellation_details?.reason || null,
      },
    });
    console.log('Subscription created successfully');
  } catch (error) {
    console.error('Error creating subscription:', error);
  }
};

const handleSubscriptionCreated = async (subscription: Stripe.Subscription) => {
 
  try {
    console.log('Creating subscription in DB:', subscription.id);
    await prisma.subscription.create({
      data: {
        id: subscription.id,
        userId: subscription.metadata.userId,
        plan: subscription.items.data[0].price.id,
        status: subscription.status.toUpperCase() as any,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        billingCycleAnchor: new Date(subscription.billing_cycle_anchor * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
        cancellationReason: subscription.cancellation_details?.reason || null,
      },
    });
    console.log('Subscription created successfully');
  } catch (error) {
    console.error('Error creating subscription:', error);
  }
};

const handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
  try {
    console.log('Updating subscription in DB:', subscription.id);
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: subscription.id },
    });

    if (!existingSubscription) {
      console.error('Subscription not found:', subscription.id);
      return;
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: subscription.status.toUpperCase() as any,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        billingCycleAnchor: new Date(subscription.billing_cycle_anchor * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
        cancellationReason: subscription.cancellation_details?.reason || null,
      },
    });
    console.log('Subscription updated successfully');
  } catch (error) {
    console.error('Error updating subscription:', error);
  }
};

const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  try {
    console.log('Deleting subscription in DB:', subscription.id);
    await prisma.subscription.delete({
      where: { id: subscription.id },
    });
    console.log('Subscription deleted successfully');
  } catch (error) {
    console.error('Error deleting subscription:', error);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method === 'POST') {
    console.log('Received Stripe webhook event');

    const sig = req.headers['stripe-signature'];
    console.log('Stripe signature:', sig);

    let event: Stripe.Event;

    try {
      const body = await buffer(req);
      const payload = body.toString('utf8');
      event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
      console.log('Event constructed:', event);
    } catch (err) {
      console.log(`❌ Error message: ${(err as Error).message}`);
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
      return;
    }

    console.log('✅ Success:', event.id);
    console.log('Event type:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      case 'customer.subscription.created':
        const subscriptionCreated = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscriptionCreated);
        break;
      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscriptionUpdated);
        break;
      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscriptionDeleted);
        break;
      default:
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
