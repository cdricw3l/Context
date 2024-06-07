import React, { useState } from 'react';
import { useResponse } from '../context/ResponseContext';

type InputFormProps = {
  repoUrl: string;
  branches: string[];
  selectedBranch: string;
  setRepoUrl: React.Dispatch<React.SetStateAction<string>>;
  setSelectedBranch: React.Dispatch<React.SetStateAction<string>>;
  fetchRepoTree: () => void;
  fetchBranchTree: (branch: string) => void;
};

const InputForm: React.FC<InputFormProps> = ({
  repoUrl,
  branches,
  selectedBranch,
  setRepoUrl,
  setSelectedBranch,
  fetchRepoTree,
  fetchBranchTree,
}) => {
  const { response, setResponse, isTextView, setIsTextView } = useResponse();

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBranch = e.target.value;
    setSelectedBranch(newBranch);
    fetchBranchTree(newBranch);
  };

  const toggleTextView = () => {
    console.log(isTextView);
    setIsTextView(!isTextView);
  };

  return (
    <div className="flex flex-col p-4 space-y-4 rounded-sm shadow-lg">
      <div>
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="Enter GitHub Repository URL"
          className="p-2 border w-full border-gray-300 rounded-sm text-left text-black focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
        />
        <div className="flex flex-row justify-center space-x-4">
          <button
            onClick={fetchRepoTree}
            className="px-4 py-2 text-white bg-blue-500 rounded-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={toggleTextView}
            className="px-4 py-2 text-white bg-blue-500 rounded-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
          </button>
        </div>
        {branches.length > 0 && (
          <div className="flex justify-center">
            <select
              value={selectedBranch}
              onChange={handleBranchChange}
              className="p-2 border border-gray-300 rounded-sm text-center text-black focus:outline-none focus:ring-2 focus:ring-blue-600 w-full "
            >
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {response && <pre>{response}</pre>}
    </div>
  );
};

export default InputForm;
