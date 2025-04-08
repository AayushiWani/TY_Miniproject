import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (token) => {
  if (!socket) {
    socket = io('http://localhost:8000', {
      auth: {
        token
      }
    });
  }
  return socket;
};

export const joinGroup = (groupId) => {
  if (socket) {
    socket.emit('join-group', groupId);
  }
};

export const leaveGroup = (groupId) => {
  if (socket) {
    socket.emit('leave-group', groupId);
  }
};

export const sendMessage = (groupId, message) => {
  if (socket) {
    socket.emit('new-message', {
      groupId,
      message
    });
  }
};

export const sendJobAlert = (groupId, alert) => {
  if (socket) {
    socket.emit('new-job-alert', {
      groupId,
      alert
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
