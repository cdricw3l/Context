// app/components/LeftPanel.tsx
import React, { useState } from 'react';
import { useResponse } from '../context/ResponseContext';
import FileContentDetails from './FileContentDetails';

export default function LeftPanel() {
  const [isMinimizedView, setIsMinimizedView] = useState(false);
  const { fileDetails, setFileDetails } = useResponse();

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
      <div className="w-full p-4 overflow-y-auto">
        {fileDetails.length > 0 ? (
          fileDetails.map((fileDetail, index) => (
            <FileContentDetails
              key={index}
              fileName={fileDetail.fileName}
              fileContent={fileDetail.fileContent}
              fileContentMinimized={fileDetail.fileContentMinimized}
              isMinimizedView={isMinimizedView}
              onRemove={() => handleRemoveFile(index)}
              onCopy={() => handleCopyFile(fileDetail.fileContent, isMinimizedView)}
              setIsMinimizedView={setIsMinimizedView}
            />
          ))
        ) : (
          <div className="text-gray-500">Select a file to view its content</div>
        )}
      </div>
    </div>
  );
}
