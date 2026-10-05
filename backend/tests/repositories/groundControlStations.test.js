import { describe, it, expect, vi, beforeEach } from 'vitest';
import { gcsRepository } from '#repositories/groundControlStations';

const fakePool = {
    // the mock function
    query: vi.fn(),
};

const testRepository = gcsRepository(fakePool);
const mockQuery = (expected) => {
    // configure the mock function to return the expected
    fakePool.query.mockResolvedValue(expected);
};
describe('createGCS', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should insert a GCS record and return the newly inserted gcs_id', async () => {
        const expected = { rows: [{ gcs_id: 1 }] };
        mockQuery(expected);
        const result = await testRepository.createGCS(1, {
            lat: 34.05,
            lng: -118.25,
            alt: 100,
        });

        expect(fakePool.query).toHaveBeenCalledOnce();
        expect(fakePool.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO ground_control_stations'),
            [1, 34.05, -118.25, 100]
        );

        expect(result).toEqual(expected.rows[0]);
    });

    it('should pass the correct user_id and coordinates to the query', async () => {
        const expected = {
            rows: [{ gcs_id: 1, latitude: 51.5, longitude: -0.12, alt: 50 }],
        };
        mockQuery(expected);
        await testRepository.createGCS(1, { lat: 51.5, lng: -0.12, alt: 50 });

        const [, params] = fakePool.query.mock.calls[0];
        expect(params).toEqual([1, 51.5, -0.12, 50]);
    });
});

describe('getAllUsersGCS', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return all GCS records for a given user', async () => {
        const expected = {
            rows: [
                {
                    gcs_id: 1,
                    user_id: 5,
                    latitude: 34.05,
                    longitude: -118.25,
                    altitude: 100,
                    created_at: '2026-01-01',
                },
                {
                    gcs_id: 2,
                    user_id: 5,
                    latitude: 36.17,
                    longitude: -115.14,
                    altitude: 200,
                    created_at: '2026-01-02',
                },
            ],
        };
        mockQuery(expected);

        const result = await testRepository.getAllUsersGCS(1);

        expect(fakePool.query).toHaveBeenCalledOnce();
        expect(fakePool.query).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM ground_control_stations'),
            [1]
        );
        expect(result).toEqual(expected.rows);
    });
});

describe('deleteGCS', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should delete a GCS record by gcs_id and return the affected row', async () => {
        const expected = {
            rows: [
                {
                    gcs_id: 1,
                    user_id: 5,
                    latitude: 34.05,
                    longitude: -118.25,
                    altitude: 100,
                    created_at: '2026-01-01',
                },
            ],
        };
        mockQuery(expected);

        const result = await testRepository.deleteGCS(1);

        expect(fakePool.query).toHaveBeenCalledOnce();
        expect(fakePool.query).toHaveBeenCalledWith(
            expect.stringContaining('DELETE FROM ground_control_stations'),
            [1]
        );
        expect(result).toEqual(expected.rows[0]);
    });
});
