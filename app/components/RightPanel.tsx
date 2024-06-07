// app/components/RightPanel.tsx

import React, { useState, useEffect } from 'react';
import { useResponse } from '../context/ResponseContext';
import { FileDetail } from '../utils/types';

export default function RightPanel() {
  const { messages, setMessages, fileDetails, setFileDetails, treeData, textTree } = useResponse();
  const [messageText, setMessageText] = useState('');
  const [totalSize, setTotalSize] = useState(0);
  const [aggregationSuccess, setAggregationSuccess] = useState(false);
  const [showProjectOverview, setShowProjectOverview] = useState(false);
  const [items, setItems] = useState<(string | FileDetail)[]>([]);

  useEffect(() => {
    // Initialiser l'ordre des éléments avec les messages et les fichiers sélectionnés
    setItems([...messages, ...fileDetails]);
  }, [messages, fileDetails]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const handleAddMessage = () => {
    if (messageText.trim() !== '') {
      setItems((prevItems) => [...prevItems, messageText]);
      setMessages((prevMessages) => [...prevMessages, messageText]);
      setMessageText('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setMessages(newItems.filter(item => typeof item === 'string') as string[]);
    setFileDetails(newItems.filter(item => typeof item !== 'string') as FileDetail[]);
    setShowProjectOverview(false);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const [removed] = newItems.splice(index, 1);
    newItems.splice(direction === 'up' ? index - 1 : index + 1, 0, removed);
    setItems(newItems);

    // Mise à jour des messages et des fichiers
    setMessages(newItems.filter(item => typeof item === 'string') as string[]);
    setFileDetails(newItems.filter(item => typeof item !== 'string') as FileDetail[]);
  };

  const handleAggregateAndCopy = () => {
    const aggregatedData = `
      Tree Structure:
      ${textTree}
      File Details and Messages:
      ${items.map(item => typeof item === 'string'
        ? `Message: ${item}`
        : `File: ${item.fileName}\nContent:\n${item.fileContent.substring(0, 500)}`).join('\n\n')}
    `;

    navigator.clipboard.writeText(aggregatedData)
      .then(() => {
        setAggregationSuccess(true);
        setShowProjectOverview(true);
      })
      .catch(() => setAggregationSuccess(false));
  };

  useEffect(() => {
    // Calculer la taille totale des objets
    const totalFileSize = items.filter(item => typeof item !== 'string').reduce((acc, file) => acc + (file as FileDetail).fileContent.length, 0);
    const totalTreeSize = JSON.stringify(treeData).length;
    setTotalSize(totalFileSize + totalTreeSize);
  }, [items, treeData]);

  return (
    <div className="flex flex-col h-screen p-4 space-y-4">
      <h2 className="text-lg font-bold">Context Aggregation</h2>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-md font-semibold mb-2">Add Message</h3>
          <input
            type="text"
            value={messageText}
            onChange={handleMessageChange}
            className="w-full p-2 border border-gray-300 rounded text-black"
            placeholder="Enter your message"
          />
          <button onClick={handleAddMessage} className="mt-4 p-2 bg-blue-500 text-white rounded">
            Add Message
          </button>
        </div>

        {items.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded shadow-md flex justify-between items-center ${typeof item === 'string' ? 'bg-blue-300 text-black' : 'bg-yellow-300 text-black'}`}
          >
            <div className="flex-grow">
              {typeof item === 'string' ? item : item.fileName}
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => moveItem(index, 'up')}
                className="mr-2 p-1 bg-gray-500 text-white rounded"
                disabled={index === 0}
              >
                ↑
              </button>
              <button
                onClick={() => moveItem(index, 'down')}
                className="mr-2 p-1 bg-gray-500 text-white rounded"
                disabled={index === items.length - 1}
              >
                ↓
              </button>
              <button
                onClick={() => handleRemoveItem(index)}
                className="p-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showProjectOverview && (
        <div className="bg-purple-300 p-4 rounded shadow-md mt-4">
          <h3 className="text-md font-semibold mb-2">Project Overview</h3>
          <p>Total Files Selected: {items.filter(item => typeof item !== 'string').length}</p>
          <p>Total Tree Size: {JSON.stringify(treeData).length} characters</p>
          <p>Total Size: {totalSize} characters</p>
        </div>
      )}

      <button onClick={handleAggregateAndCopy} className="mt-8 p-2 bg-green-500 text-white rounded">
        Aggregate and Copy
      </button>
      {aggregationSuccess && <p className="text-green-500 mt-2">Data copied to clipboard!</p>}
    </div>
  );
}
