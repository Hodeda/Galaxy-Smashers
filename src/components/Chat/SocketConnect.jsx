import React, { useEffect, useState } from 'react';
import { SocketContext } from './SocketContext';
import io from 'socket.io-client';

const URL = import.meta.env.VITE_SERVER;
const socket = io(URL);

const SocketProvider = ({ children }) => {
  const [alert, setAlert] = useState(false);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [alertEvents, setAlertEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      console.log('connected');
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log('disconnected');
      setIsConnected(false);
    }

    function onFooEvent(value) {
      console.log('msgs received', value);
      setAlertEvents((prev) => [value, ...prev]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('test', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('test', onFooEvent);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, alert, setAlert, alertEvents, setAlertEvents }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;