import React, { useState, useRef, useEffect } from 'react';


interface TchatProps {
  messages: string[];
  onClearMessages: () => void;
}

function Tchat({ messages, onClearMessages }: TchatProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [currentOccurrenceIndex, setCurrentOccurrenceIndex] = useState<number>(0);
  const occurrencesRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (occurrencesRef.current[currentOccurrenceIndex]) {
      occurrencesRef.current[currentOccurrenceIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentOccurrenceIndex]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentOccurrenceIndex(0); // Reset to the first occurrence when the search term changes
  };

  const handleToggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    setSearchTerm('');
  };

  const nextOccurrence = () => {
    setCurrentOccurrenceIndex((prevIndex) =>
      prevIndex + 1 < occurrencesRef.current.length ? prevIndex + 1 : prevIndex
    );
  };

  const prevOccurrence = () => {
    setCurrentOccurrenceIndex((prevIndex) =>
      prevIndex - 1 >= 0 ? prevIndex - 1 : prevIndex
    );
  };

  const renderMessage = (message: string, index: number) => {
    let occurrenceIndex = 0;

    const formattedMessage = message.split('\n').map((line, idx) => {
      if (line.startsWith('```')) {
        return <pre key={idx} className="bg-gray-800 text-white p-2 rounded-md">{line.replace(/```/g, '')}</pre>;
      }

      // Highlight occurrences of the search term
      const parts = line.split(new RegExp(`(${searchTerm})`, 'gi'));
      return (
        <p key={idx}>
          {parts.map((part, i) => {
            if (part.toLowerCase() === searchTerm.toLowerCase()) {
              const occurrenceRef = (el: HTMLSpanElement | null) => {
                occurrencesRef.current[occurrenceIndex] = el;
                occurrenceIndex++;
              };

              return (
                <mark key={i} ref={occurrenceRef} className="bg-yellow-300">
                  {part}
                </mark>
              );
            }
            return part;
          })}
        </p>
      );
    });

    return (
      <div key={index} className="mb-2">
        {formattedMessage}
      </div>
    );
  };

  return (
    <div className="space-x-4 flex flex-col p-4 mt-4 h-5/6  rounded-md flex-auto overflow-y-auto overflow-x-scroll">
      <div className="flex flex-row items-center mb-4">
        {isSearchVisible && (
          <>
            <input
              type="text"
              className="flex-grow p-0 border border-gray-300 rounded-sm text-blue-600"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              type="button"
              onClick={prevOccurrence}
              className="ml-1 p-0 text-sm text-white r hover:bg-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextOccurrence}
              className="ml-1 p-0 text-sm text-white r hover:bg-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
              </svg>
            </button>
          </>
        )}
        <button
          type="button"
          onClick={handleToggleSearch}
          className="ml-1 p-0 text-sm text-white r hover:bg-gray-300"
        >
          {!isSearchVisible ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
            </svg>
          )}
        </button>
      </div>
      {messages.length === 0 ? (
        <div className="w-full p-2 rounded-md text-blue-600 overflow-y-auto max-h-64">
          
        </div>
      


            ) : (
              <>
                {messages.map((message, index) => renderMessage(message, index))}
              
                <div className="flex flex-col items-center   py-2">
                  <button
                    type="button"
                    className="place-content-center  rounded-sm hover:bg-slate-400 hover:text-slate-500 flex items-center mb-2"
                    onClick={onClearMessages}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </>
            )}

    </div>
  );
}

export default Tchat;
