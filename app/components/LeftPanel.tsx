import React, { useState, useEffect } from 'react';
import { useResponse } from '../context/ResponseContext';
import { FileNode, TreeElement } from '../utils/types';
import Tree from './Tree';
import FileContentDetails from './FileContentDetails';
import { buildTree } from '../utils/treeUtils';
import path from 'path';


interface FileDetail {
  fileName: string;
  fileContent: string;
  fileContentMinimized: string;
  isBinary: boolean;
  
}

export default function LeftPanel() {
  const [error, setError] = useState('');
  const [repoUrl, setRepoUrl] = useState('https://github.com/jhonny-jane-w3l/Context.git');
  const [branch, setBranch] = useState('main');
  const [accessToken, setAccessToken] = useState('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');
  const { response, setResponse, treeData, setTreeData, userTreeState, setUserTreeState } = useResponse();
  const [selectedOption, setSelectedOption] = useState('global');
  const [fileDetails, setFileDetails] = useState<FileDetail[]>([]);
  const [isMinimizedView, setIsMinimizedView] = useState(false); // New state

  const fetchRepoTree = async () => {
    console.log("Fetching tree for repo: ", repoUrl);
    setError('');
    setResponse(null);
    try {
      const res = await fetch('/api/clone/cloneRepo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl, branch, accessToken }),
      });
      const data = await res.json();

      if (res.ok) {
        console.log("Data received: ", data);
        setResponse(data);
        const treeData = buildTree(data.tree as TreeElement[]);
        setTreeData(treeData);
        setUserTreeState(treeData);  // Initialize the user tree state
      } else {
        setError(data.message);
      }
    } catch (error: any) {
      setError(error.message);
    }
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
        body: JSON.stringify({ repoUrl, sha, accessToken , extend}),
      });
      const data = await res.json();

      if (res.ok) {
        const newFileDetail: FileDetail = {
          fileName,
          fileContent: data.isBinary ? "Binary file cannot be displayed" : data.content,
          fileContentMinimized: data.isBinary ? "Binary file cannot be displayed" : data.content.replace(/\n/g, ' '),
          isBinary: data.isBinary
        };
          
        setFileDetails((prevDetails) => [...prevDetails, newFileDetail]);
      } else {
        setError(data.message);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleOptionChange = async (option: string) => {
    setSelectedOption(option);
    if (option === 'global') {
      fetchRepoTree();
    }
  };

  const handleTreeToggle = (node: FileNode) => {
    if (node.children) {
      node.isOpen = !node.isOpen;
      setUserTreeState({ ...userTreeState }); // Update the user tree state
    }
  };

  const handleRemoveFile = (index: number) => {
    setFileDetails((prevDetails) => prevDetails.filter((_, i) => i !== index));
  };

  const handleCopyFile = (content: string, view: boolean) => {
    if (view) {
      content = content.replace(/\s+/g, '/'); // Remplace les espaces et les sauts de ligne par un /
    }
    navigator.clipboard.writeText(content);
    
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r border-gray-300 overflow-y-auto">
        <div className="flex flex-col h-full p-6">
          <div className="flex flex-row justify-center px-2 py-2">
            <button
              onClick={() => handleOptionChange('global')}
              className={`p-2 m-2 text-sm ${
                selectedOption === 'global' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-gray-300'
              } rounded-md hover:bg-blue-700 hover:text-white transition-colors duration-300`}
            >
              Global
            </button>
          </div>

          <div className="flex-grow overflow-y-auto">
            {selectedOption === 'global' && (
              <ul className="text-left py-4 text-white text-sm">
                {treeData && <Tree node={treeData} onToggle={handleTreeToggle} onFileClick={fetchFileContent} />}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="w-2/3 p-4 overflow-y-auto">
        {fileDetails.length > 0 ? (
          fileDetails.map((fileDetail, index) => (
            <FileContentDetails
              key={index}
              fileName={fileDetail.fileName}
              fileContent={fileDetail.fileContent}
              fileContentMinimized={fileDetail.fileContentMinimized}
              isMinimizedView={isMinimizedView} // Pass the state
              onRemove={() => handleRemoveFile(index)}
              onCopy={() => handleCopyFile(fileDetail.fileContent,isMinimizedView)}
              setIsMinimizedView={setIsMinimizedView} // Pass the setter
            />
          ))
        ) : (
          <div className="text-gray-500">Select a file to view its content</div>
        )}
      </div>
    </div>
  );
}
