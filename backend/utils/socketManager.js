let io;

export const initSocketServer = (socketServer) => {
  io = socketServer;
  return io;
};

export const getSocketServer = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export const emitToGroup = (groupId, event, data) => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  io.to(groupId).emit(event, data);
};
