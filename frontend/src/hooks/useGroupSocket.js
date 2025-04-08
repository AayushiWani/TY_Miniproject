import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { SOCKET_URL } from '@/utils/constant';
import { toast } from 'sonner';

const useGroupSocket = (groupId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (groupId) {
      const newSocket = io(SOCKET_URL, {
        query: { groupId },
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('Socket connected successfully');
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        toast.error('Failed to connect to chat server');
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        newSocket.close();
      };
    }
  }, [groupId]);

  return socket;
};

export default useGroupSocket;
