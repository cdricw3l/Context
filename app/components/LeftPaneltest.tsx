import React, { useState } from 'react';
import siteMeta from '../../public/static/data';
import { useResponse } from '../context/ResponseContext';
import { FileNode, TreeElement } from '../utils/types';
import { buildTree, generateTextTree } from '../utils/treeUtils';
import Tree from './Tree';

export default function LeftPanel() {

  const [error, setError] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [accessToken, setAccessToken] = useState('');
  const { response, setResponse, treeData, setTreeData, userTreeState, setUserTreeState, isTextView, setIsTextView } = useResponse();
  const [isClean, setClean] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState(siteMeta.leftBar[0]);

  const fetchRepoTree = async () => {
    setError('');
    setResponse(null);
    try {
      console.log("Fetching tree for repo: ", repoUrl);
      const res = await fetch('api/clone/cloneRepo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl, branch: "main", accessToken }),
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

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    console.log("Selected option: ", option);
  };

  const handleTreeToggle = (node: FileNode) => {
    /*if (node.children) {
      node.isOpen = !node.isOpen;
      setUserTreeState({ ...userTreeState }); // Update the user tree state
    }*/
  };

  return (
    <div className="flex flex-auto flex-col h-full p-6 max-h-screen">
      <div className="flex flex-auto flex-row justify-center px-2 py-2">
        {siteMeta.leftBar.map((df, index) => (
          <button
            key={index}
            onClick={() => handleOptionChange(df)}
            className={`p-2 m-2 text-sm ${
              selectedOption === df
                ? 'bg-blue-700 text-white'
                : 'bg-blue-500 text-gray-300'
            } rounded-md hover:bg-blue-700 hover:text-white transition-colors duration-300`}
          >
            {df}
          </button>
        ))}
      </div>

      <div className="flex flex-row mx-2 justify-center ">
        <button
          type="submit"
          onClick={fetchRepoTree}
          className="place-content-center text-red-500 rounded-sm hover:bg-slate-400 hover:text-slate-500 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
          </svg>
        </button>
        <input
          type="text"
          className="text-black bg-red-300"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="Enter GitHub Repository URL"
        />

        <input
          type="text"
          className="text-black bg-blue-300 "
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          placeholder="Enter GitHub Access Token"
        />

        <button
          type="submit"
          onCopy={() => { setResponse(null); setTreeData(null); setUserTreeState(null); }}
          onClick={() => {
            setResponse(null);
            setTreeData(null);
            setUserTreeState(null);
          }}
          className="mt-2 text-gray-500 rounded-sm hover:bg-slate-400 hover:text-slate-500 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>

      
      <div className="border border-gray-300 overflow-x-scroll h-screen">
        {selectedOption === 'Tree' ? (
          <Tree node={treeData} onToggle={handleTreeToggle} />
        ) : (
          <pre>
            {isClean ? JSON.stringify(response, null, 0) : JSON.stringify(response, null, 2)}
          </pre>
        )}
      </div>
      
    </div>
  );
}
