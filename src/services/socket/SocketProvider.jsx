import React, { useEffect, useState } from 'react';
import { SocketContext } from './SocketContext';
import { useAuth } from '../../context/authContext';
import io from 'socket.io-client';

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userDetails } = useAuth();
  console.log(userDetails);

  const socketServer = import.meta.env.VITE_SERVER;

  useEffect(() => {
    //userDetails is null on first render
    if (!userDetails) return;

    const newSocket = io(socketServer, {
      query: {
        user: userDetails.firstName,
      },
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [userDetails]);

  const value = { socket };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
