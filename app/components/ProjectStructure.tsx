import React, { useState } from 'react';
import { Directory, File, ProjectStructureProps } from '../utils/types';
import NavFile from './Navfile';
import FileDetails from './FileDetails';
import { copyToClipboard } from '../utils/clipboardUtils';

const ProjectStructure: React.FC<ProjectStructureProps> = ({ structure }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (file: File) => {
    setSelectedFiles(prevFiles => [...prevFiles, file]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  const handleRemoveAllFile = () => {
    setSelectedFiles([]);
  };
  const handleCopyFiles = () => {
    copyToClipboard(selectedFiles);
  };

  return (
    <div className="flex p-4 h-screen">
      <div className="w-64 h-full ">
        <NavFile structure={structure} onFileSelect={handleFileSelect} />
      </div>
      <div className="w-2/3 pl-4 ">
        <div className='flex flex-row space-x-2'>
          <button 
            onClick={handleCopyFiles} 
            className="bg-blue-500 text-white px-2 py-1 rounded mb-4"
          >
            Copy
          </button>
          <button 
            onClick={handleRemoveAllFile} 
            className="bg-red-500 text-white px-2 py-1 rounded mb-4"
          >
            Delete All
          </button>
        </div>
        <div className='overflow-y-auto'>
          {selectedFiles.length === 0 ? (
            <p>Select a file to see details</p>
          ) : (
            selectedFiles.map((file, index) => (
              <FileDetails
                key={index}
                file={file}
                onRemove={() => handleRemoveFile(index)}
                onCopy={() => handleCopyFiles()}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectStructure;
