import React, { useEffect, useState } from 'react';
import { useSocket } from '../../../services/socket';
import { Button } from '@mui/material';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      // Listen for incoming messages
      socket.on('chat', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
    return () => {
      if (socket) {
        socket.off('chat');
      }
    };
  }, [socket]);

  const sendMessage = () => {
    if (socket && newMessage.trim() !== '') {
      socket.emit('chat', newMessage);
      setNewMessage('');
    }
  };

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  // on enter
  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleClick(e);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div>
      <input
        type="text"
        onChange={handleChange}
        placeholder="..."
        value={newMessage}
        onKeyDown={handleEnter}
      />
      <Button onClick={handleClick}>Send</Button>
      {messages && messages.map((msg) => <div key={msg.id}>{msg}</div>)}
    </div>
  );
}
