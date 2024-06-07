import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Data = {
  branches?: string[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { repoUrl } = req.body;
  const token = process.env.GITHUB_TOKEN;

  if (!repoUrl || typeof repoUrl !== 'string') {
    return res.status(400).json({ error: 'Repository URL is required' });
  }

  const cleanRepoUrl = repoUrl.replace(/\.git$/, '');
  const parts = cleanRepoUrl.split('/');
  if (parts.length < 2) {
    return res.status(400).json({ error: 'Invalid Repository URL' });
  }
  const owner = parts[parts.length - 2];
  const repo = parts[parts.length - 1];

  try {
    const branchesUrl = `https://api.github.com/repos/${owner}/${repo}/branches`;
    const branchesResponse = await axios.get(branchesUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const branches = branchesResponse.data.map((branch: any) => branch.name);
    res.status(200).json({ branches });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
