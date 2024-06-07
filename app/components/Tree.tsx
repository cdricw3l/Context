import React, { useState } from 'react';
import { FileNode } from '../utils/types';
import path from 'path';

interface TreeProps {
  node: FileNode | null;
  onToggle: (node: FileNode) => void;
  onFileClick: (sha: string, fileName: string) => void; // Mettez à jour la signature de la fonction
}

const Tree: React.FC<TreeProps> = ({ node, onToggle, onFileClick }) => {
  
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [allOpen, setAllOpen] = useState(false);

  if (!node) return null;

  const handleToggleAll = () => {
    setAllOpen(!allOpen);
  };

  const renderTree = (node: FileNode) => (
    <div key={node.path} style={{ paddingLeft: '20px' }}>
      {node.type === 'tree' ? (
        <div onClick={() => onToggle(node)} style={{ cursor: 'pointer' }}>
          {allOpen || node.isOpen ? '📂' : '📁'} {node.name}
        </div>
      ) : (
        <div
          onClick={() => handleFileClick(node)}
          style={{
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            backgroundColor: node === selectedFile ? 'green' : 'transparent',
            color: node === selectedFile ? 'white' : 'inherit',
            padding: '5px 10px',
            borderRadius: '4px',
          }}
        >
          📄 {node.name}
        </div>
      )}
      {(allOpen || node.isOpen) && node.children && (
        <div>
          {node.children.map((childNode) => renderTree(childNode))}
        </div>
      )}
    </div>
  );

  const handleFileClick = (node: FileNode) => {
    setSelectedFile(node === selectedFile ? null : node);
    if (node.type === 'blob' && node.sha) {
      onFileClick(node.sha, node.name ); // Passez le SHA et le nom du fichier
    }
  };

  return (
    <div>
      <button onClick={handleToggleAll}>
        {allOpen ? 'Close All' : 'Open All'}
      </button>
      {renderTree(node)}
    </div>
  );
};

export default Tree;
