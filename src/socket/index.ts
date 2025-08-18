// src/socket/index.ts
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config';

type SocketUserData = { userId: string };

// in-memory presence map; for scale, swap with Redis
const onlineUsers = new Map<string, number>(); // userId -> connection count

const setOnline = (io: Server, userId: string) => {
  const count = (onlineUsers.get(userId) || 0) + 1;
  onlineUsers.set(userId, count);
  if (count === 1) {
    io.emit('presence:online', { userId }); // broadcast
  }
};

const setOffline = (io: Server, userId: string) => {
  const count = (onlineUsers.get(userId) || 1) - 1;
  if (count <= 0) {
    onlineUsers.delete(userId);
    io.emit('presence:offline', { userId });
  } else {
    onlineUsers.set(userId, count);
  }
};

export const setupSocket = (io: Server) => {
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];
      if (!token) return next(new Error('No token'));
      const decoded = jwt.verify(token, config.jwt_token_secret!) as any;
      (socket as any).user = { userId: decoded.id } as SocketUserData;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const { userId } = (socket as any).user as SocketUserData;

    socket.join(`user:${userId}`);
    setOnline(io, userId);

    // optional presence pulls
    socket.on('presence:who', (userIds: string[]) => {
      const present = userIds.filter((id) => onlineUsers.has(id));
      socket.emit('presence:list', { online: present });
    });

    // typing indicators remain
    socket.on('typing', ({ to }: { to: string }) => {
      io.to(`user:${to}`).emit('typing', { from: userId });
    });

    socket.on('disconnect', () => {
      socket.leave(`user:${userId}`);
      setOffline(io, userId);
    });
  });
};
