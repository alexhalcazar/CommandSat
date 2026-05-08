import { pushJob } from '#services/satellites.service';
import { redisClient } from '../../api/config/redisClient';
import { describe, beforeEach, expect, vi, it } from 'vitest';

// mock Redis client
vi.mock('../../api/config/redisClient', () => ({
    redisClient: {
        lPush: vi.fn(),
    },
}));

describe('pushJob', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should enqueue a job into Redis with correct payload', async () => {
        const userId = 'user123';
        const gcs = { lat: 34.05, lng: -118.25 };

        await pushJob(userId, gcs);

        expect(redisClient.lPush).toHaveBeenCalledTimes(1);
        expect(redisClient.lPush).toHaveBeenCalledWith(
            'satellite_jobs',
            JSON.stringify({ userId, gcs })
        );
    });
});
