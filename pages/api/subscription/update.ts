// pages/api/subscription/update.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { newPlan } = req.body;
  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.subscriptionId) {
      return res.status(404).json({ error: 'User or subscription not found' });
    }

    const subscription = await stripe.subscriptions.update(user.subscriptionId, {
      items: [{
        id: user.stripeSubscriptionItemId,
        price: newPlan,
      }],
    });

    await prisma.subscription.update({
      where: { id: user.subscriptionId },
      data: {
        plan: newPlan,
        status: subscription.status.toUpperCase() as any,
      },
    });

    res.status(200).json({ message: 'Subscription updated successfully' });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
}
