import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8000';
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      setConnectionError(reason);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
      setConnectionError(error.message);
    });

    // Market data events
    newSocket.on('price_update', (data) => {
      console.log('Price update received:', data);
      // Handle price updates
    });

    newSocket.on('signal_update', (data) => {
      console.log('Signal update received:', data);
      // Handle signal updates
    });

    newSocket.on('portfolio_update', (data) => {
      console.log('Portfolio update received:', data);
      // Handle portfolio updates
    });

    newSocket.on('trade_executed', (data) => {
      console.log('Trade executed:', data);
      // Handle trade execution notifications
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  // Emit events
  const emitEvent = (event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  // Subscribe to symbol updates
  const subscribeToSymbol = (symbol) => {
    emitEvent('subscribe_symbol', { symbol });
  };

  // Unsubscribe from symbol updates
  const unsubscribeFromSymbol = (symbol) => {
    emitEvent('unsubscribe_symbol', { symbol });
  };

  // Request real-time data
  const requestRealtimeData = (symbols) => {
    emitEvent('request_realtime_data', { symbols });
  };

  const value = {
    socket,
    isConnected,
    connectionError,
    emitEvent,
    subscribeToSymbol,
    unsubscribeFromSymbol,
    requestRealtimeData
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
