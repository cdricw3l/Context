import React, { useState } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';

interface ModalProps {
  title: string;
  content: string;
  onClose: () => void;
  onCopy: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, content, onClose, onCopy }) => {
  const [isLarge, setIsLarge] = useState(false);

  const handleCopyAndClose = () => {
    onCopy();
    onClose();
  };

  const ext: string = title.split('.').pop() as string;

  const toggleSize = () => {
    setIsLarge(!isLarge);
  };

  const modalStyle = {
    minWidth: isLarge ? '75%' : '50%',
    maxWidth: '90%',
    minHeight: isLarge ? '75%' : '50%',
    maxHeight: '90%',
    overflowY: 'auto' as 'auto'
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div
        className="border border-white bg-opacity-40 p-4 rounded-lg shadow-lg z-10 bg-white"
        style={modalStyle}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl text-white font-bold">{title}</h1>
          <div className="space-x-2">
            <button onClick={toggleSize} className="text-white border border-white hover:bg-gray-300 px-3 py-1 rounded">
              {isLarge ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M12 4v16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m0 0H4m5 0v5m0-5V4m0 8h11" />
                </svg>
              )}
            </button>
            <button onClick={onClose} className="text-white border border-white hover:bg-gray-300 px-3 py-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button onClick={handleCopyAndClose} className="text-white border border-white hover:bg-gray-300 px-3 py-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9Z" />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <CopyBlock
            text={content}
            language={ext}
            showLineNumbers={true}
            theme={dracula}
            codeBlock
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
