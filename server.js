import express from 'express'
const app = express();
import http from "http";
import { Server } from "socket.io"
const server = http.createServer(app);

const io = new Server(server);

const userSocketMap = {};

function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}


io.on('connection',(socket)=>{
    console.log('socket connected',socket.id);

    socket.on('join', ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({socketId})=>{
        io.to(socketId).emit('joined',{
            clients,
            username,
            socketId : socket.id,

        });
    });
});

  
socket.on('code-change', ({ roomId, code }) => {
    socket.in(roomId).emit('code-change', { code });
});

socket.on('sync-code', ({ socketId, code }) => {
    io.to(socketId).emit('sync-code', { code });
});

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit('disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));