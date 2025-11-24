const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for development (change in production)
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store messages in memory (in production, use a database)
// Limit to last 100 messages to prevent memory issues
const MAX_MESSAGES = 100;
const messages = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send existing messages to new user
  socket.emit('messages', messages);

  // Handle new message
  socket.on('message', (data) => {
    try {
      const message = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...data,
        timestamp: new Date().toISOString()
      };
      messages.push(message);
      
      // Keep only last MAX_MESSAGES messages
      if (messages.length > MAX_MESSAGES) {
        messages.shift();
      }
      
      // Broadcast to all clients
      io.emit('message', message);
    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('stop-typing', () => {
    socket.broadcast.emit('stop-typing');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all interfaces

httpServer.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`Server is accessible from network on port ${PORT}`);
});

