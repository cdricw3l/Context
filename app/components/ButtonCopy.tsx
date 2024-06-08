// app/components/ButtonCopy.tsx

import React, { useState } from 'react';
import { copyToClipboard } from '../utils/clipboardUtils';
import TextTreeModal from './TextTreeModal';

interface ButtonCopyProps {
  textToCopy: string;
  textTree: string; // Ajoutez cette prop pour passer l'arborescence
}

const ButtonCopy: React.FC<ButtonCopyProps> = ({ textToCopy, textTree }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-row  ">
      <div>
        <button
          onClick={() => copyToClipboard(textToCopy)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-transparent bg-green-500 hover:bg-blue-600 text-white rounded-sm   shadow-xl mr-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
          </svg>
        </button>
        <button 
          onClick={handleOpenModal} 
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-transparent bg-green-500 hover:bg-blue-600 text-white  rounded-sm   shadow-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </button>
        <TextTreeModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          textTree={textTree} 
        />
      </div>
    </div>
  );
};

export default ButtonCopy;
