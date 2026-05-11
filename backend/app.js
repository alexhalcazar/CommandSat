import express from 'express';
import 'dotenv/config';
import satelliteRouter from '#routes/satellites.routes';
import auth from '#routes/auth';
import authMiddleware from './api/middleware/jwt.js';
import http from 'http';
import { WebSocketServer } from 'ws';
import { addClient, removeClient } from './api/config/wsManager.js';
import { startRedisListener } from './api/config/wsHandler.js';

const app = express();
const port = 3000;

const server = http.createServer(app);
// attach WebSocket server
const wss = new WebSocketServer({ server });

(async () => {
    try {
        await startRedisListener();
        console.log('Redis listener started');
    } catch (err) {
        console.error('Failed to start Redis listener:', err);
        process.exit(1); // don't let the app run without the listener
    }
})();

wss.on('connection', (socket, request) => {
    console.log('Client connected!');
    const params = new URLSearchParams(request.url.split('?')[1]);
    const userId = params.get('userId');

    addClient(userId, socket);

    socket.on('close', () => {
        removeClient(userId);
    });
});

app.use(express.json());
app.use('/api/satellites', authMiddleware, satelliteRouter);
app.use('/api/auth', auth);

server.listen(port, () => {
    console.log(`Server is now listening on port ${port}`);
});
