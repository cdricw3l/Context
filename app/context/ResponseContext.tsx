'use client';

import React, { createContext, useContext, useState } from 'react';
import { FileNode, Directory } from '../utils/types';

interface ResponseContextProps {
  response: any;
  setResponse: React.Dispatch<React.SetStateAction<any>>;
  treeData: FileNode | null;
  setTreeData: React.Dispatch<React.SetStateAction<FileNode | null>>;
  userTreeState: FileNode | null;
  setUserTreeState: React.Dispatch<React.SetStateAction<FileNode | null>>;
  isTextView: boolean;
  setIsTextView: React.Dispatch<React.SetStateAction<boolean>>;
  structure: Directory | null;
  setStructure: React.Dispatch<React.SetStateAction<Directory | null>>;
}

const ResponseContext = createContext<ResponseContextProps | undefined>(undefined);

export const useResponse = () => {
  const context = useContext(ResponseContext);
  if (!context) {
    throw new Error('useResponse must be used within a ResponseProvider');
  }
  return context;
};

export const ResponseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [response, setResponse] = useState<any>(null);
  const [treeData, setTreeData] = useState<FileNode | null>(null);
  const [userTreeState, setUserTreeState] = useState<FileNode | null>(null);
  const [isTextView, setIsTextView] = useState<boolean>(false);
  const [structure, setStructure] = useState<Directory | null>(null);

  return (
    <ResponseContext.Provider
      value={{
        response,
        setResponse,
        treeData,
        setTreeData,
        userTreeState,
        setUserTreeState,
        isTextView,
        setIsTextView,
        structure,
        setStructure,
      }}
    >
      {children}
    </ResponseContext.Provider>
  );
};
