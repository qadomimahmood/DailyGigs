const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Allow connection from React Native / Expo Web
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_gig', (gigId) => {
        socket.join(gigId);
        console.log(`User ${socket.id} joined room: ${gigId}`);
    });

    socket.on('send_message', (messageData) => {
        // messageData: { gigId, text, senderId, ... }

        // Broadcast to everyone in the room (including sender, or exclude sender if preferred)
        io.to(messageData.gigId).emit('receive_message', messageData);

        console.log(`Message in ${messageData.gigId}: ${messageData.text}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('socket.io server running at http://localhost:3000');
});
