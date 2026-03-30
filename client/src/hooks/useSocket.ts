import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [fallNotifications, setFallNotifications] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    socketRef.current = io('/', {
      transports: ['websocket'],
      auth: { token },
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('fallEvent', (data: any) => {
      setFallNotifications(prev => [data, ...prev].slice(0, 50));
    });

    socketRef.current.on('fallEventUpdated', (data: any) => {
      setFallNotifications(prev =>
        prev.map(n => n.event?.id === data.eventId ? { ...n, event: { ...n.event, status: data.status } } : n)
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const clearNotification = (index: number) => {
    setFallNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllNotifications = () => {
    setFallNotifications([]);
  };

  return {
    socket: socketRef.current,
    isConnected,
    fallNotifications,
    clearNotification,
    clearAllNotifications,
  };
}
