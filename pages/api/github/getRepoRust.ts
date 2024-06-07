import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  status: string;
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  
  if (req.method === 'POST') {
    const { repoUrl } = req.body;
    console.log("Request received: ", req.body);


    // Appel à votre backend Rocket pour cloner le dépôt
    try {
      const response = await fetch('http://127.0.0.1:8000/api/repoTreeFromUrl', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: repoUrl}),
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
