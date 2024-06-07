import React, { useState } from 'react';

interface SprechProps {
  onSendMessage: (message: string, body: any) => void;
}

function Sprech({ onSendMessage }: SprechProps) {
  const [currentMessage, setCurrentMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: "corrige les faute d'orthographe et traduit en anglais retourne uniquement le message source avec les modification." },
        { role: 'user', content: currentMessage },
      ],
    };

    onSendMessage(currentMessage, body);
    setCurrentMessage('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="flex-3 px-2 py-2 rounded-md mt-8 flex-grow">
      <form className="space-x-4 flex flex-row" onSubmit={handleSubmit}>
        <textarea
          className="w-full dark:bg-blue-950 dark:text-white p-2 rounded-sm text-blue-600"
          placeholder="Entrez votre message ici..."
          rows={4}
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex flex-col items-center">
          <button
            type="submit"
            className="place-content-center text-red-500 rounded-sm hover:bg-slate-400 hover:text-slate-500 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
            </svg>
          </button>

          <button
            type="submit"
            className="text-blue-500 rounded-sm hover:bg-slate-400 hover:text-slate-500 flex items-center my-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M9 2.25a.75.75 0 0 1 .75.75v1.506a49.384 49.384 0 0 1 5.343.371.75.75 0 1 1-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 0 1-2.97 6.323c.318.384.65.753 1 1.107a.75.75 0 0 1-1.07 1.052A18.902 18.902 0 0 1 9 13.687a18.823 18.823 0 0 1-5.656 4.482.75.75 0 0 1-.688-1.333 17.323 17.323 0 0 0 5.396-4.353A18.72 18.72 0 0 1 5.89 8.598a.75.75 0 0 1 1.388-.568A17.21 17.21 0 0 0 9 11.224a17.168 17.168 0 0 0 2.391-5.165 48.04 48.04 0 0 0-8.298.307.75.75 0 0 1-.186-1.489 49.159 49.159 0 0 1 5.343-.371V3A.75.75 0 0 1 9 2.25ZM15.75 9a.75.75 0 0 1 .68.433l5.25 11.25a.75.75 0 1 1-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 0 1-1.36-.634l5.25-11.25A.75.75 0 0 1 15.75 9Zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Sprech;
