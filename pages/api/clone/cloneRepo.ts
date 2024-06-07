import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  status: string;
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { repoUrl, branch, accessToken } = req.body;

    // Appel à votre backend Rocket pour cloner le dépôt
    try {
      const response = await fetch('http://localhost:8000/api/cloneRepo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl, branch, accessToken }),
      });

      const data = await response.json();
      if (response.ok) {
        //console.log("Data received: ", data);
        res.status(200).json(data);
      } else {
        res.status(500).json({ status: 'error', message: data.message });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to connect to backend' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
