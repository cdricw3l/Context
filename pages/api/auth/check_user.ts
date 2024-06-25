import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
    console.log('session:', session);
  if (!session || !session.user?.email) {
    return res.status(401).json({ exists: false });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (user) {
    return res.status(200).json({ exists: true });
  } else {
    return res.status(404).json({ exists: false });
  }
}
