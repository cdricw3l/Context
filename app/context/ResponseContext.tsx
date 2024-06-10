'use client';

import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { FileNode, Directory, FileDetail } from '../utils/types';

type SelectedView = 'all' | 'Import / Export' | 'css';

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
  fileDetails: FileDetail[];
  setFileDetails: React.Dispatch<React.SetStateAction<FileDetail[]>>;
  messages: string[];
  setMessages: React.Dispatch<React.SetStateAction<string[]>>;
  textTree: string;
  setTextTree: React.Dispatch<React.SetStateAction<string>>;
  projectName: string;
  setProjectName: React.Dispatch<React.SetStateAction<string>>;
  branchName: string;
  setBranchName: React.Dispatch<React.SetStateAction<string>>;
  treeFetched: boolean;
  setTreeFetched: React.Dispatch<React.SetStateAction<boolean>>;
  selectedViews: Record<string, SelectedView>;
  setSelectedViews: Dispatch<SetStateAction<Record<string, SelectedView>>>;
  extension: string;
  setExtension: React.Dispatch<React.SetStateAction<string>>;
  isMinimizedView: boolean;
  setIsMinimizedView: React.Dispatch<React.SetStateAction<boolean>>;
  aggregatedContent: Record<string, string>;
  setAggregatedContent: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  plan: string; // add plan to context
  setPlan: React.Dispatch<React.SetStateAction<string>>;
  showModal: boolean; // add showModal to context
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [fileDetails, setFileDetails] = useState<FileDetail[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [textTree, setTextTree] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const [branchName, setBranchName] = useState<string>('');
  const [treeFetched, setTreeFetched] = useState<boolean>(false);
  const [selectedViews, setSelectedViews] = useState<Record<string, SelectedView>>({});
  const [extension, setExtension] = useState<string>('');
  const [isMinimizedView, setIsMinimizedView] = useState(false);
  const [aggregatedContent, setAggregatedContent] = useState<Record<string, string>>({});
  const [plan, setPlan] = useState('free'); // default plan
  const [showModal, setShowModal] = useState(false); // default modal state

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
        fileDetails,
        setFileDetails,
        messages,
        setMessages,
        textTree,
        setTextTree,
        projectName,
        setProjectName,
        branchName,
        setBranchName,
        treeFetched,
        setTreeFetched,
        selectedViews,
        setSelectedViews,
        extension,
        setExtension,
        isMinimizedView,
        setIsMinimizedView,
        aggregatedContent,
        setAggregatedContent,
        plan,
        setPlan,
        showModal,
        setShowModal,
      }}
    >
      {children}
    </ResponseContext.Provider>
  );
};
