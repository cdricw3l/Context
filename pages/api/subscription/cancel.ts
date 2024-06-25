// pages/api/subscription/cancel.ts
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

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.subscriptionId) {
      return res.status(404).json({ error: 'User or subscription not found' });
    }

    await stripe.subscriptions.del(user.subscriptionId);

    await prisma.subscription.update({
      where: { id: user.subscriptionId },
      data: {
        status: 'CANCELED',
      },
    });

    res.status(200).json({ message: 'Subscription canceled successfully' });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
}
