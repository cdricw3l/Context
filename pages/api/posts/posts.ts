import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'rustbook/fr');
console.log("Currfewwfewfent working directory: ", process.cwd());
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  if (typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);

  

  try {
    if (!fs.existsSync(fullPath)) {
      console.log("File not found: ", fullPath);
      return res.status(404).json({ error: 'Post not found' });
    }

    console.log("File exists: ", fullPath);

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    

    res.status(200).json({ data, content });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read post' });
  }
}
