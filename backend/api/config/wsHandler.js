import { subscriber } from './redisClient.js';
import { getClient } from './wsManager.js';
import { WebSocket } from 'ws';

export const startRedisListener = async () => {
    try {
        await subscriber.subscribe('user-updates', (message) => {
            const { userId, type, data } = JSON.parse(message);
            // Look up the right WebSocket client
            const ws = getClient(userId);

            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type, data }));
            }
        });
    } catch (err) {
        console.error(err);
    }
};
