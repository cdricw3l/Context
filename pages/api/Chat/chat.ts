import type { NextApiRequest, NextApiResponse } from 'next';

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(`${process.env.NEXT_PUBLIC_API_URL}`);
  if (req.method === 'POST') {
    const { model, messages }: ChatCompletionRequest = req.body;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model, messages }),
      });
        
      if (!response.ok) {
        res.status(response.status).json({ error: 'Error fetching data from the Rust server' });
        return;
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.log("erreur 500")
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
