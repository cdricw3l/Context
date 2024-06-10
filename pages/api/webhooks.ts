import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { prisma } from '../../lib/prisma'; // Assurez-vous que votre prisma client est correctement configuré

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false, // Désactiver le bodyParser pour traiter le corps brut
  },
};

// Middleware pour convertir le req.body en buffer brut
function rawBodyBuffer(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  const chunks: Buffer[] = [];
  req.on('data', (chunk) => {
    chunks.push(chunk);
  });
  req.on('end', () => {
    req.body = Buffer.concat(chunks);
    next();
  });
}

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    rawBodyBuffer(req, res, async () => {
      const sig = req.headers['stripe-signature']!;
      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err) {
        console.error(`❌ Error message: ${Stripe.errors.StripeAPIError}`);
        res.status(400).send(`Webhook Error: ${Stripe.errors.StripeAPIError}`);
        return;
      }

      console.log('✅ Success:', event.id);

      switch (event.type) {
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
          console.warn(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  PAST_DUE = "PAST_DUE",
  UNPAID = "UNPAID",
  INCOMPLETE = "INCOMPLETE",
}

const handleSubscriptionCreated = async (subscription: Stripe.Subscription) => {
  try {
    console.log('Creating subscription in DB:', subscription.id);
    await prisma.subscription.create({
      data: {
        id: subscription.id,
        userId: subscription.metadata.userId,
        plan: subscription.items.data[0].price.id,
        status: subscription.status.toUpperCase() as SubscriptionStatus,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
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
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: subscription.status.toUpperCase() as SubscriptionStatus,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
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

export default webhookHandler;
