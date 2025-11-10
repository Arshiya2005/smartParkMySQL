import { io } from "../server.js"

export const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on('register-user', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`Registered user ${userId} to socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    for (const [userId, sockId] of connectedUsers.entries()) {
      if (sockId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
  console.log("connected user");
});