// app/components/FileContentDetails.tsx

import React, { useState } from 'react';
import { useResponse } from '../context/ResponseContext';
import Modal from './Modal';

interface FileContentDetailsProps {
  fileName: string;
  fileContent: string;
  fileContentMinimized: string;
  isMinimizedView: boolean;
  setIsMinimizedView: (value: boolean) => void;
  onRemove: () => void;
  onCopy: () => void;
  fileDetail: {
    imports: string[];
    exports: string[];
    css: string[];
    
  };
  extension: string;
  
}

const FileContentDetails: React.FC<FileContentDetailsProps> = ({
  fileName,
  fileContent,
  fileContentMinimized,
  isMinimizedView,
  setIsMinimizedView,
  onRemove,
  onCopy,
  fileDetail,
  extension,
  
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedView } = useResponse();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleToggleView = () => {
    console.log('isMinimizedView:', isMinimizedView);
    setIsMinimizedView(!isMinimizedView);
  };

   let contentToDisplay: string | undefined;
   console.log("extens0000ion "+ extension)
  
   if(extension === '.ts' || extension === '.js' || extension === '.tsx' || extension === '.jsx' || extension === '.css'){
    if (selectedView === 'import' && fileDetail) {
    
      contentToDisplay = fileDetail?.imports.join('\n');
    } else if (selectedView === 'css') {
      if(fileDetail?.css.length > 0){
        contentToDisplay = fileDetail?.css.join('\n');
      }else{
        contentToDisplay = 'No CSS DATA';
      }
      
    } else {
      contentToDisplay = isMinimizedView ? fileContentMinimized : fileContent;
    }

   } else {
    
    contentToDisplay = isMinimizedView ? fileContentMinimized : fileContent;

   }

  return (
    <div className="p-4 shadow-2xl rounded-xl text-gray-800 mb-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Details for {fileName}</h2>
        <div className="space-x-2">
          <button onClick={onCopy} className="px-2 py-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
            </svg>
          </button>
          <button onClick={handleOpenModal} className="px-2 py-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </button>
          <button onClick={onRemove} className="px-2 py-1 rounded-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <button onClick={handleToggleView} className="px-2 py-1 rounded-sm">
            {isMinimizedView ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="mt-4">
        <strong>Content:</strong>
        <div className="p-2 mt-2 rounded max-h-64 overflow-y-auto">
          <pre>{contentToDisplay}</pre>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          title={`Details for ${fileName}`}
          content={contentToDisplay}
          onClose={handleCloseModal}
          onCopy={onCopy}
        />
      )}
    </div>
  );
};

export default FileContentDetails;
