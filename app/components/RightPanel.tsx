import React, { useState, useEffect } from 'react';
import { useResponse } from '../context/ResponseContext';
import { FileDetail } from '../utils/types';
import TreeBlock from './TreeBlock';
import { aggregateData } from '../utils/aggregateData';

export default function RightPanel() {
  const { messages, setMessages, fileDetails, setFileDetails, treeData, textTree, projectName, branchName, isMinimizedView, selectedViews } = useResponse();
  const [messageText, setMessageText] = useState('');
  const [aggregationSuccess, setAggregationSuccess] = useState(false);
  const [items, setItems] = useState<(string | FileDetail)[]>(['TREE']);
  const [aggregatedContexts, setAggregatedContexts] = useState<{ id: number; data: string; details: (string | FileDetail)[] }[]>([]);
  const [totalMessagesSize, setTotalMessagesSize] = useState(0);
  const [totalFilesSize, setTotalFilesSize] = useState(0);
  const [totalTreeSize, setTotalTreeSize] = useState(0);
  const [contextId, setContextId] = useState(1);
  const [selectedContextId, setSelectedContextId] = useState<number | null>(null);

  useEffect(() => {
    // Initialiser l'ordre des éléments avec les messages et les fichiers sélectionnés
    setItems(['TREE', ...messages, ...fileDetails]);
    setTotalTreeSize(JSON.stringify(treeData).length);
  }, [messages, fileDetails, treeData]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const handleAddMessage = () => {
    if (messageText.trim() !== '') {
      setItems((prevItems) => [...prevItems, messageText]);
      setMessages((prevMessages) => [...prevMessages, messageText]);
      setTotalMessagesSize((prevSize) => prevSize + messageText.length);
      setMessageText('');
    }
  };

  const handleRemoveItem = (index: number) => {
    if (items[index] === 'TREE') return;
    const newItems = items.filter((_, i) => i !== index);

    if (typeof items[index] === 'string') {
      setTotalMessagesSize((prevSize) => prevSize - (items[index] as string).length);
    } else {
      setTotalFilesSize((prevSize) => prevSize - (items[index] as FileDetail).fileContent.length);
    }

    setItems(newItems);
    setMessages(newItems.filter(item => typeof item === 'string' && item !== 'TREE') as string[]);
    setFileDetails(newItems.filter(item => typeof item !== 'string') as FileDetail[]);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (items[index] === 'TREE') return;
    const newItems = [...items];
    const [removed] = newItems.splice(index, 1);
    newItems.splice(direction === 'up' ? index - 1 : index + 1, 0, removed);
    setItems(newItems);

    // Mise à jour des messages et des fichiers
    setMessages(newItems.filter(item => typeof item === 'string' && item !== 'TREE') as string[]);
    setFileDetails(newItems.filter(item => typeof item !== 'string') as FileDetail[]);
  };

  const handleAggregateAndCopy = () => {
    const aggregatedData = aggregateData(items, textTree, isMinimizedView, selectedViews);

    navigator.clipboard.writeText(aggregatedData)
      .then(() => {
        setAggregationSuccess(true);
        const newContext = {
          id: contextId,
          data: aggregatedData,
          details: [...items],
        };
        setAggregatedContexts((prevContexts) => [...prevContexts, newContext]);
        console.log(aggregatedContexts)
        setContextId((prevId) => prevId + 1);
        handleClearItems(); // Clear items after aggregation
      })
      .catch(() => setAggregationSuccess(false));
  };

  const handleClearItems = () => {
    setItems(['TREE']);
    setMessages([]);
    setFileDetails([]);
    setTotalMessagesSize(0);
    setTotalFilesSize(0);
    setTotalTreeSize(0);
  };

  const handleSelectContext = (id: number) => {
    setSelectedContextId(id === selectedContextId ? null : id);
  };

  const handleDeleteContext = (id: number) => {
    setAggregatedContexts((prevContexts) => {
      const updatedContexts = prevContexts.filter(context => context.id !== id).map((context, index) => ({
        ...context,
        id: index + 1
      }));
      return updatedContexts;
    });
    if (selectedContextId === id) {
      setSelectedContextId(null);
    }
    setContextId(prevId => prevId - 1);
  };

  const totalMessages = items.filter(item => typeof item === 'string').length - 1; // Exclude 'TREE'
  const totalFiles = items.filter(item => typeof item !== 'string').length;
  const calculatedTotalSize = totalMessagesSize + totalFilesSize + totalTreeSize;

  return (
    <div className="flex flex-col h-screen p-4 space-y-4 overflow-x-auto">
      <h2 className="text-2xl font-bold text-center">Context Block</h2>
      <div className="space-y-4">

        {aggregatedContexts.length > 0 || selectedContextId !== null && (
          <button
            onClick={() => setSelectedContextId(null)}
            className="p-2 bg-gradient-to-r from-blue-500 to-transparent bg-green-500 hover:bg-blue-600 text-white rounded"
          >
            Create New Context
          </button>
        )}

        {selectedContextId !== null &&(
          <button
            onClick={() => setSelectedContextId(null)}
            className="p-2 bg-gradient-to-r from-blue-500 to-transparent bg-green-500 hover:bg-blue-600 text-white rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
            </svg>

          </button>

        )}
        
        

        {selectedContextId === null ? (
          <div>
            <div className="p-4 rounded shadow-xl">
              <h3 className="text-md font-semibold mb-2">Message</h3>
              <input
                type="text"
                value={messageText}
                onChange={handleMessageChange}
                className="w-full p-2 rounded text-black"
                placeholder="Enter your message"
              />
              <div className='flex flex-row justify-between'>
                <button onClick={handleAddMessage} className="mt-4 p-2 bg-gradient-to-r from-blue-500 to-transparent bg-green-500 hover:bg-blue-600 text-white rounded mx-4">
                  Add Message to Context
                </button>
                <button onClick={handleAggregateAndCopy} className="mt-4 p-2 bg-gradient-to-r from-blue-500 to-transparent bg-green-500 hover:bg-blue-600 text-white rounded mx-4">
                  Aggregate and Copy
                </button>
              </div>
            </div>

            {items.map((item, index) => (
              item === 'TREE' ? (
                <TreeBlock
                  key={index}
                  onClearItems={handleClearItems}
                  onAggregateAndCopy={handleAggregateAndCopy}
                  totalMessages={totalMessages}
                  totalFiles={totalFiles}
                  totalTreeSize={totalTreeSize}
                  totalSize={calculatedTotalSize}
                  projectName={projectName}
                  branchName={branchName}
                />
              ) : (
                <div
                  key={index}
                  className={`p-4 rounded shadow-md flex justify-between items-center ${typeof item === 'string' ? 'bg-gradient-to-r from-blue-300 to-purple-400 text-blue-800' : 'bg-gradient-to-r from-yellow-300 to-purple-400 text-blue-800'}`}
                >
                  <div className="flex-grow text-center">
                    <div className='flex-col flex'>
                      {typeof item === 'string' && item != 'TREE' ? 'Message: ' : typeof item === 'string' && item === 'TREE' ? 'Arboressance ' : 'File'}
                      {typeof item === 'string' && item === 'TREE' ? ' ' : typeof item === 'string' && item != 'TREE' ? item : item.fileName}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      className="mr-2 p-1 text-white rounded"
                      disabled={index === 0 || items[index] === 'TREE'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      className="mr-2 p-1 text-white rounded"
                      disabled={index === items.length - 1 || items[index] === 'TREE'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="p-1 text-white rounded"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          aggregatedContexts.find(context => context.id === selectedContextId)?.details.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded shadow-md flex justify-between items-center ${typeof item === 'string' ? 'bg-gradient-to-r from-blue-300 to-purple-400 text-blue-800' : 'bg-gradient-to-r from-yellow-300 to-purple-400 text-blue-800'}`}
            >
              <div className="flex-grow text-center">
                <div className='flex-col flex'>
                  {typeof item === 'string' && item != 'TREE' ? 'Message: ' : typeof item === 'string' && item === 'TREE' ? 'Arboressance ' : 'File'}
                  {typeof item === 'string' && item === 'TREE' ? ' ' : typeof item === 'string' && item != 'TREE' ? item : item.fileName}
                </div>
              </div>
            </div>
          ))
        )}

        {aggregatedContexts.map((context) => (
          <div
            key={context.id}
            className="p-4 rounded shadow-md flex justify-between items-center bg-gradient-to-r from-green-300 to-purple-400 text-blue-800 cursor-pointer"
            onClick={() => handleSelectContext(context.id)}
          >
            <div className="flex-grow text-center">
              Aggregated Context {context.id}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleDeleteContext(context.id); }}
              className="p-1 text-white rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
