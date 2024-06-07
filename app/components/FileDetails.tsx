import React from 'react';
import { File } from '../utils/types';

interface FileDetailsProps {
  file: File;
  onRemove: () => void;
  onCopy: () => void;
}

const FileDetails: React.FC<FileDetailsProps> = ({ file, onRemove, onCopy }) => {
  return (
    <div className="p-4  shadow rounded-xl text-gray-800 mb-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Details for {file.name}</h2>
        <div className="space-x-2">
          <button onClick={onCopy} className="bg-blue-500 text-white px-2 py-1 rounded">Copy</button>
          <button onClick={onRemove} className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
        </div>
      </div>
      <p><strong>Extension:</strong> {file.extension}</p>
      <div className="mt-4">
        <strong>Imports:</strong>
        <ul className="list-disc list-inside">
          {file.imports.map((imp, index) => (
            <li key={index}>{imp}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <strong>CSS:</strong>
        <ul className="list-disc list-inside">
          {file.css.map((css, index) => (
            <li key={index}>{css}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <strong>Exports:</strong>
        <ul className="list-disc list-inside">
          {file.exports.map((exp, index) => (
            <li key={index}>{exp}</li>
          ))}
        </ul>
      </div>
      
    </div>
  );
};

export default FileDetails;
