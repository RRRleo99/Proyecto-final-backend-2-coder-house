import { Server } from 'socket.io';

let io;

export const initWebSocket = (httpServer) => {
  io = new Server(httpServer);

  io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    // Ejemplo: recibir un mensaje y reenviarlo a todos
    socket.on('mensaje', data => {
      io.emit('mensajeLogs', data);
    });

    // Otros eventos personalizados...
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error('WebSocket no inicializado');
  }
  return io;
};