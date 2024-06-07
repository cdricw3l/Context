import React, { useState, useEffect } from 'react';
import { Directory, File } from '../utils/types';

interface NavFileProps {
  structure: Directory;
  onFileSelect: (file: File) => void;
}

const NavFile: React.FC<NavFileProps> = ({ structure, onFileSelect }) => {
  const [filter, setFilter] = useState<string>('');
  const [openDirectories, setOpenDirectories] = useState<Set<string>>(new Set());

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleDirectoryToggle = (directoryPath: string) => {
    setOpenDirectories((prev) => {
      const newOpenDirectories = new Set(prev);
      if (newOpenDirectories.has(directoryPath)) {
        newOpenDirectories.delete(directoryPath);
      } else {
        newOpenDirectories.add(directoryPath);
      }
      return newOpenDirectories;
    });
  };

  const filteredChildren = (children: (File | Directory)[]) => {
    return children.filter(child => child.name.toLowerCase().includes(filter.toLowerCase()));
  };

  const renderStructure = (directory: Directory, path: string) => {
    const isOpen = openDirectories.has(path);

    return (
      <ul className="pl-4">
        {filteredChildren(directory.children).map(child => {
          const childPath = `${path}/${child.name}`;

          return (
            <li key={childPath} className="mb-2">
              {child.type === 'directory' ? (
                <>
                  <span
                    onClick={() => handleDirectoryToggle(childPath)}
                    className="cursor-pointer text-white"
                  >
                    {isOpen ? '📂' : '📁'} <strong>{child.name}</strong>
                  </span>
                  {isOpen && renderStructure(child as Directory, childPath)}
                </>
              ) : (
                <span
                  onClick={() => onFileSelect(child as File)}
                  className="cursor-pointer text-white hover:underline"
                >
                  📄 {child.name}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="p-4 overflow-scroll h-screen fixed">
      <input
        type="text"
        className="w-full p-2 border text-black border-gray-300 rounded mb-4"
        placeholder="Filter"
        value={filter}
        onChange={handleFilterChange}
      />
      {renderStructure(structure, '')}
    </div>
  );
};

export default NavFile;
