// app/components/TreeBlock.tsx

import React, { useState } from 'react';

interface TreeBlockProps {
  onClearItems: () => void;
  onAggregateAndCopy: () => void;
  totalMessages: number;
  totalFiles: number;
  totalTreeSize: number;
  totalSize: number;
  projectName: string;
  branchName: string;
}

const TreeBlock: React.FC<TreeBlockProps> = ({
  onClearItems,
  onAggregateAndCopy,
  totalMessages,
  totalFiles,
  totalTreeSize,
  totalSize,
  projectName,
  branchName,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleAggregateAndCopy = () => {
    onAggregateAndCopy();
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="p-4 rounded shadow-md bg-green-400 text-white flex flex-col justify-center items-center">
      <div className="flex-grow text-center">
        <h2 className="text-2xl font-bold">Context</h2>
      </div>
      <div className="flex justify-between w-full mt-4">
        <h2 className="text-2xl font-bold">↓</h2>
        <h2 className="text-2xl font-bold">↓</h2>
        <h2 className="text-2xl font-bold">↓</h2>
      </div>
      <div className="mt-4 text-center flex flex-wrap justify-center text-xs space-x-2">
        <p><strong>Project Name:</strong> {projectName}</p>
        <p><strong>Branch:</strong> {branchName}</p>
        <p><strong>Total Messages:</strong> {totalMessages}</p>
        <p><strong>Total Files Selected:</strong> {totalFiles}</p>
        <p><strong>Total Tree Size:</strong> {totalTreeSize - 4} characters</p>
        <p><strong>Total Size:</strong> {totalSize - 4} characters</p>
      </div>
      <div className="flex flex-row space-x-4 mt-4">
        <button 
          onClick={onClearItems} 
          className="p-2 text-white rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
        <button 
          onClick={handleAggregateAndCopy} 
          className="p-2 bg-gradient-to-r from-blue-500 to-transparent bg-green-500 hover:bg-blue-600 text-white rounded"
        >
          Aggregate and Copy
        </button>
      </div>
      {copySuccess && <p className="text-green-500 mt-2 text-sm">Data copied to clipboard!</p>}
    </div>
  );
};

export default TreeBlock;
