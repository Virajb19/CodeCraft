"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpSocketServer = setUpSocketServer;
function setUpSocketServer(io) {
    io.use((socket, next) => {
        const { roomId } = socket.handshake.auth;
        if (!roomId) {
            return next(new Error('Invalid room'));
        }
        const rooms = Array.from(socket.rooms);
        rooms.forEach(room => {
            if (room !== socket.id) {
                socket.leave(room);
            }
        });
        socket.join(roomId);
        socket.room = roomId;
        next();
    });
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        const roomId = socket.handshake.auth.roomId;
        socket.on('code:change', (code) => {
            socket.to(roomId).emit('code:change', code);
        });
        socket.on('join:room', (participant) => {
            socket.to(roomId).emit('join:room', participant);
        });
        socket.on('leave:room', (participant) => {
            socket.to(roomId).emit('leave:room', participant);
        });
        socket.on('delete:room', () => {
            socket.to(roomId).emit('delete:room');
        });
    });
}
