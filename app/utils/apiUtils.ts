import axios from 'axios';
import { FileNode } from './types';
import { buildTree } from './treeUtils';
import { FormEvent } from 'react';


export const fetchRepoTree = async (
  repoUrl: string,
  branch: string,
  setTreeData: (data: FileNode | null) => void,
  setBranches: (branches: string[]) => void,
  setSelectedBranch: (branch: string) => void,
  setDefaultBranch: (branch: string) => void,
  setError: (error: string) => void
) => {
  try {
    const response = await axios.post('/api/github/getRepoDetails', {
      repoUrl,
      branch,
    });
    const { tree, branches, commits, contributors, stars, forks, defaultBranch } = response.data;

    setTreeData(buildTree(tree.tree));
    setBranches(branches);
    setSelectedBranch(branch || defaultBranch); // Use branch from parameter or default branch
    setDefaultBranch(defaultBranch); // Set default branch

    return { commits, contributors, stars, forks };
  } catch (error: any) {
    setError(error.message);
  }
};

// utils/apiUtils.ts


export const fetchRepoData = async (
  e: FormEvent,
  repoUrl: string,
  scriptPath: string,
  setOutput: (output: string) => void
) => {
  e.preventDefault();
  console.log('Form submitted with:', { repoUrl, scriptPath });

  try {
    const response = await fetch('/api/clone/cloneRepo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ repoUrl, scriptPath }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from server:', errorData);
      setOutput(`Error: ${errorData.message}`);
      return;
    }

    const data = await response.json();
    console.log('Response from server:', data);
    setOutput(data.data);
  } catch (error:any) {
    console.error('Error during fetch:', error);
    setOutput(`Error: ${error.message}`);
  }
};
