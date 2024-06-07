// app/components/NavBar.tsx

import React, { useState, useEffect } from 'react';
import Logo from '../data/logo.svg';
import Tree from './Tree';
import { useResponse } from '../context/ResponseContext';
import InputForm from './InputForm';
import ErrorMessage from './ErrorMessage';
import Loading from './Loading';
import ButtonLogout from './ButtonLogout';
import ButtonCopy from './ButtonCopy';
import { FileNode, FileDetail } from '../utils/types';
import { fetchRepoTree } from '../utils/apiUtils';
import { generateTextTree } from '../utils/treeUtils';
import Footer from './Footer'; // Assurez-vous d'importer le composant Footer
import path from 'path';

const NavBar: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const { setFileDetails, treeData, setTreeData, userTreeState, setUserTreeState, isTextView, setIsTextView, messages, fileDetails, textTree, setTextTree } = useResponse();
  const [aggregationSuccess, setAggregationSuccess] = useState(false);

  const fetchTree = async () => {
    await fetchRepoTree(repoUrl, 'main', setTreeData, setBranches, setError);
    setLoading(false);
  };

  const fetchFileContent = async (sha: string, fileName: string) => {
    console.log("Fetching content for file SHA: ", sha);
    try {
      const extend = path.extname(fileName);
      const res = await fetch('api/github/getFileContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl, sha, extend }),
      });
      const data = await res.json();

      if (res.ok) {
        const newFileDetail: FileDetail = {
          fileName,
          fileContent: data.isBinary ? "Binary file cannot be displayed" : data.content,
          fileContentMinimized: data.isBinary ? "Binary file cannot be displayed" : data.content.replace(/\n/g, ' '),
          isBinary: data.isBinary,
        };

        setFileDetails((prevDetails) => [...prevDetails, newFileDetail]);
      } else {
        setError(data.message);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const fetchBranchTree = async (branch: string) => {
    console.log(branch);
    await fetchRepoTree(repoUrl, branch, setTreeData, setBranches, setError);
    setLoading(false);
  };

  useEffect(() => {
    if (treeData) {
      const textTree = generateTextTree(treeData);
      setTextTree(textTree);
    }
  }, [treeData, setTextTree]);

  useEffect(() => {
    if (branches.length > 0 && !selectedBranch) {
      setSelectedBranch(branches[0]);
    }
  }, [branches]);

  const handleTreeToggle = (node: FileNode) => {
    if (node.children) {
      node.isOpen = !node.isOpen;
      setUserTreeState({ ...userTreeState } as FileNode); // Mettre à jour l'état de l'arborescence de l'utilisateur
    }
  };

  const handleFileClick = (sha: string, fileName: string) => {
    console.log(`File clicked: ${fileName} with SHA: ${sha}`);
    fetchFileContent(sha, fileName);
  };

  const handleAggregateAndCopy = () => {
    const aggregatedData = `
      Branch Name: ${selectedBranch}
      Tree Structure:
      ${textTree}
      File Details:
      ${fileDetails.map(file => `File: ${file.fileName}\nContent:\n${file.fileContent}`).join('\n\n')}
      Messages:
      ${messages.join('\n')}
    `;
    navigator.clipboard.writeText(aggregatedData)
      .then(() => setAggregationSuccess(true))
      .catch(() => setAggregationSuccess(false));
  };

  return (
    <div className="flex flex-col h-full min-h-screen">
      <div className="flex flex-col flex-grow p-4">
        <div className="flex justify-center space-x-5 p-4">
          <Logo />
          <ButtonLogout />
        </div>
        <div className="justify-center p-4 w-full">
          <InputForm
            repoUrl={repoUrl}
            branches={branches}
            selectedBranch={selectedBranch}
            setRepoUrl={setRepoUrl}
            setSelectedBranch={setSelectedBranch}
            fetchRepoTree={fetchTree}
            fetchBranchTree={fetchBranchTree}
          />
        </div>

        {loading && <Loading />}

        <div className="py-1 px-1 w-full overflow-y-scroll flex-grow" style={{ maxHeight: 'calc(50vh - 5rem)' }}>
          <div className="flex flex-col">
            <div className="text-blue-600 w-full">
              <div className="flex flex-col p-2 justify-center items-center">
                {isTextView && <ButtonCopy textToCopy={textTree} />}
                <button onClick={handleAggregateAndCopy} className="mt-4 p-2 bg-green-500 text-white rounded">
                  Aggregate and Copy
                </button>
                {aggregationSuccess && <p className="text-green-500 mt-2">Data copied to clipboard!</p>}
              </div>
              {error && <ErrorMessage error={error} />}
              {isTextView ? (
                <pre className="mt-4 p-4 border text-white border-gray-300 rounded">
                  {textTree}
                </pre>
              ) : (
                <ul className="text-left py-4 text-white text-sm">
                  {treeData && (
                    <Tree
                      node={treeData}
                      onToggle={handleTreeToggle}
                      onFileClick={handleFileClick}
                    />
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bottom-0">
        <Footer />
      </div>
    </div>
  );
};

export default NavBar;
