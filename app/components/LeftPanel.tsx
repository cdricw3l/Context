// app/components/LeftPanel.tsx

import React, { useState } from 'react';
import { useResponse } from '../context/ResponseContext';
import FileContentDetails from './FileContentDetails';
import Tchat from './Tchat';
import Sprech from './Sprech';

export default function LeftPanel() {
  const { fileDetails, setFileDetails, selectedView, setSelectedView } = useResponse();
  const [isMinimizedView, setIsMinimizedView] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');

  const handleRemoveFile = (index: number) => {
    setFileDetails((prevDetails) => prevDetails.filter((_, i) => i !== index));
  };

  const handleCopyFile = (content: string, view: boolean) => {
    if (view) {
      content = content.replace(/\s+/g, '/'); // Remplace les espaces et les sauts de ligne par un /
    }
    navigator.clipboard.writeText(content);
  };

  const handleSendMessage = async (message: string, body: any, isButton: boolean) => {
    setMessages((prevMessages) => [...prevMessages, `User: ${message}`]);

    try {
      const response = await fetch('../../api/Chat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error('Error fetching data from the server');
        return;
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      if (isButton) {
        // Update the text area with the response if the call was made by button
        setCurrentMessage(assistantMessage);
      } else {
        // Update the chat with the response if the call was made by Enter key
        setMessages((prevMessages) => [...prevMessages, `Assistant: ${assistantMessage}`]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClearMessages = () => {
    console.log('Clearing messages');
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-4 space-y-2 text-white">
        <button
          onClick={() => setShowChatPanel((prev) => !prev)}
          className="border border-blue-500 bg-gradient-to-r from-blue-500 to-transparent bg-green-500 p-2 rounded"
        >
          Switch to {showChatPanel ? 'File Details' : 'Chat'}
        </button>
      </div>
      {!showChatPanel && (
        <div className="flex flex-row space-x-2 p-4">
          <button
            className={`border border-blue-500 bg-gradient-to-r from-blue-500 to-transparent bg-green-500 p-2 rounded ${selectedView === 'all' ? 'border-red-500' : ''}`}
            onClick={() => setSelectedView('all')}
          >
            All
          </button>
          <button
            className={`border border-blue-500 bg-gradient-to-r from-blue-500 to-transparent bg-green-500 p-2 rounded ${selectedView === 'import' ? 'border-red-500' : ''}`}
            onClick={() => setSelectedView('import')}
          >
            Import
          </button>
          <button
            className={`border border-blue-500 bg-gradient-to-r from-blue-500 to-transparent bg-green-500 p-2 rounded ${selectedView === 'css' ? 'border-red-500' : ''}`}
            onClick={() => setSelectedView('css')}
          >
            CSS
          </button>
          
        </div>
      )}
      <div className="flex-grow overflow-y-auto p-4">
        {showChatPanel ? (
          <div className="flex flex-col h-full p-6 max-h-screen">
            <Tchat messages={messages} onClearMessages={handleClearMessages} />
            <Sprech
              onSendMessage={(message, body) => handleSendMessage(message, body, true)}
              setCurrentMessage={setCurrentMessage}
              currentMessage={currentMessage}
            />
          </div>
        ) : (
          fileDetails.length > 0 ? (
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
                fileDetail={fileDetail.fileDetail} // Passer fileDetail ici
                extension={fileDetail.extension}
              />
            ))
          ) : (
            <div className="text-white">Select a file to view its details.</div>
          )
        )}
      </div>
    </div>
  );
}
