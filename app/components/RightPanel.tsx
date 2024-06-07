import React, { useState } from 'react';
import Tchat from './Recherche';
import Sprech from './Sprech';

export default function RightPanel() {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');

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
    <div className="flex flex-auto flex-col h-full p-6 max-h-screen">
      <Tchat messages={messages} onClearMessages={handleClearMessages} />
      <Sprech 
        onSendMessage={(message, body) => handleSendMessage(message, body, true)}
        setCurrentMessage={setCurrentMessage} 
        currentMessage={currentMessage} 
      />
    </div>
  );
}
