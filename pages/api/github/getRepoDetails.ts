import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import fs from 'fs';

type Data = {
  tree?: any;
  branches?: string[];
  commits?: number;
  contributors?: { login: string; contributions: number }[];
  stars?: number;
  forks?: number;
  defaultBranch?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { repoUrl, branch } = req.body;
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
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const repoApiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    console.log("repoApiUrl:", repoApiUrl);

    // Get default branch
    const repoBranchResponse = await axios.get(repoApiUrl, { headers });
    const defaultBranch = repoBranchResponse.data.default_branch;
    console.log("defaultBranch:", defaultBranch);
    const branchToUse = branch || defaultBranch;

    // Get branch information, branches, commits, contributors, and repo details in parallel
    const [
      branchResponse,
      branchesResponse,
      commitsResponse,
      contributorsResponse,
      repoResponse
    ] = await Promise.all([
      axios.get(`https://api.github.com/repos/${owner}/${repo}/branches/${branchToUse}`, { headers }),
      axios.get(`https://api.github.com/repos/${owner}/${repo}/branches`, { headers }),
      axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers }),
      axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`, { headers }),
      axios.get(repoApiUrl, { headers })
    ]);

    const treeSha = branchResponse.data.commit.sha;
    const branches = branchesResponse.data.map((branch: any) => branch.name);

    // Calculate the number of commits
    const commits = commitsResponse.headers['link']
      ? parseInt(commitsResponse.headers['link'].match(/&page=(\d+)>; rel="last"/)[1])
      : 1;

    // Get contributors data
    const contributors = contributorsResponse.data.map((contributor: any) => ({
      login: contributor.login,
      contributions: contributor.contributions,
    }));

    // Get repository details
    const { stargazers_count, forks_count } = repoResponse.data;

    // Get repository tree
    const treeResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`, { headers });
    fs.writeFileSync('tree.json', JSON.stringify(treeResponse.data, null, 2));

    res.status(200).json({
      tree: treeResponse.data,
      branches,
      commits,
      contributors,
      stars: stargazers_count,
      forks: forks_count,
      defaultBranch,
    });
  } catch (error: any) {
    console.log(error.message)
    res.status(500).json({ error: error.message });
  }
}
