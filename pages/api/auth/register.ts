// pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '../../../app/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const user = await createUser(email, password);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: 'User already exists' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}