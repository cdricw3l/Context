// pages/api/auth/checkout_sessions.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { priceId, email } = req.body;
    console.log("Price ID: ", priceId, "Email: ", email);
    try {
      // Créez la session de paiement Stripe
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        automatic_tax: { enabled: true },
        metadata: {
          email,
        },
      });
      res.status(200).json({ url: session.url });
    } catch (err) {
      const error = err as Stripe.errors.StripeError;
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
