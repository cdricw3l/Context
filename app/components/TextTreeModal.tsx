// app/components/TextTreeModal.tsx

import React from 'react';
import { copyToClipboard } from '../utils/clipboardUtils';

interface TextTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  textTree: string;
}

const TextTreeModal: React.FC<TextTreeModalProps> = ({ isOpen, onClose, textTree }) => {
  if (!isOpen) return null;

  const handleCopy = () => {
    copyToClipboard(textTree);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white border border-gray-300 p-4 rounded-lg shadow-lg z-10 max-w-max w-full h-2/3 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Tree Structure</h1>
          <div className="space-x-2">
            <button
                onClick={handleCopy} 
                className="px-2 py-2 bg-gradient-to-r from-blue-700 to-transparent via-cyan-500 bg-green-500 text-white rounded-sm hover:bg-blue-700 "
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                </svg>
            </button>
            <button 
                onClick={onClose} 
                className="px-2 py-2 bg-gradient-to-r from-blue-700 to-transparent via-cyan-500 bg-green-500 text-white rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>

            </button>
          </div>
        </div>
        <pre className="bg-gray-100 text-blue-500 rounded overflow-x-auto">{textTree}</pre>
      </div>
    </div>
  );
};

export default TextTreeModal;
