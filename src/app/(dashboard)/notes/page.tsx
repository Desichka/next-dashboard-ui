"use client";

import React, { useState, useEffect } from 'react';

const NotesPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    const fetchQuickNotes = async () => {
      try {
        const response = await fetch('/api/quick-notes');
        if (response.ok) {
          const data = await response.json();
          setMessages(data.map((note: { content: any; }) => note.content));
        } else {
          console.error('Error fetching quick notes:', response.status);
        }
      } catch (error) {
        console.error('Error fetching quick notes:', error);
      }
    };

    fetchQuickNotes();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      try {
        const response = await fetch('/api/quick-notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: newMessage }),
        });

        if (response.ok) {
          setMessages([...messages, newMessage]);
          setNewMessage('');
        } else {
          console.error('Error saving quick note:', response.status);
          alert(`Error saving quick note: ${response.status}`);
        }
      } catch (error) {
        console.error('Error saving quick note:', error);
        alert(`Error saving quick note: ${error}`);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <h2>Quick Chat</h2>
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          {messages.map((message, index) => (
            <div key={index} style={{ backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '5px', marginBottom: '5px' }}>
              {message}
            </div>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={newMessage}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            style={{ marginRight: '10px' }}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
      {/* Add your notes content here */}
    </div>
  );
};

export default NotesPage;
