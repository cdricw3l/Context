import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { extractFileData } from '../extractStructure/extractStructure';

type Data = {
  content?: string;
  import?: string[];
  export?: string[];
  css?: string[];
  isBinary?: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = process.env.GITHUB_TOKEN;
  if (!accessToken) {
    return res.status(500).json({ error: 'GitHub access token is not set' });
  }

  const { repoUrl, sha, extend } = req.body;

  if (!repoUrl || typeof repoUrl !== 'string') {
    return res.status(400).json({ error: 'Repository URL is required' });
  }

  if (!sha || typeof sha !== 'string') {
    return res.status(400).json({ error: 'SHA is required' });
  }

  console.log("Request body: ", req.body);
  try {
    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
    };

    const repoPath = repoUrl.replace('https://github.com/', '');
    const cleanRepoUrl = repoPath.replace(/\.git$/, '');
    console.log("Repo path: ", repoPath);
    const blobUrl = `https://api.github.com/repos/${cleanRepoUrl}/git/blobs/${sha}`;

    console.log("Blob URL: ", blobUrl);
    const blobResponse = await axios.get(blobUrl, { headers });
    const contentBase64 = blobResponse.data.content;
    const decode = atob(contentBase64);
  
    // E  ssayer de décoder le contenu en texte
    const content = decode;
    let isBinary = false;
   

    let fileDetail;
    try {
      //console.log("Content: ", content);
      console.log("Extend: ", extend);
      fileDetail = extractFileData(decode, extend);
      console.log("File detail: ", fileDetail);
    } catch (error) {
      console.log("Error: ", error);
    }

    res.status(200).json({ content, isBinary, ...fileDetail });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
