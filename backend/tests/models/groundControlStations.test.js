import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    createGCS,
    getAllUsersGCS,
    deleteGCS,
} from '../../api/models/groundControlStations';

const mockQuery = vi.hoisted(() => vi.fn());

vi.mock('../../db/index.js', () => {
    return {
        pool: {
            query: mockQuery,
        },
    };
});

describe('createGCS', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should insert a GCS record and return the newly inserted row', async () => {
        const mockResult = {
            rows: [
                { gcs_id: 1, latitude: 34.05, longitude: -118.25, alt: 300 },
            ],
        };
        mockQuery.mockResolvedValue(mockResult);

        const result = await createGCS(1, {
            lat: 34.05,
            lng: -118.25,
            alt: 100,
        });

        expect(mockQuery).toHaveBeenCalledOnce();
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO ground_control_stations'),
            [1, 34.05, -118.25, 100]
        );
        expect(result).toEqual(mockResult);
    });

    it('should pass the correct user_id and coordinates to the query', async () => {
        mockQuery.mockResolvedValue({
            rows: [{ gcs_id: 1, latitude: 51.5, longitude: -0.12, alt: 50 }],
        });

        await createGCS(1, { lat: 51.5, lng: -0.12, alt: 50 });

        const [, params] = mockQuery.mock.calls[0];
        expect(params).toEqual([1, 51.5, -0.12, 50]);
    });
});

describe('getAllUsersGCS', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return all GCS records for a given user', async () => {
        const mockResult = {
            rows: [
                {
                    gcs_id: 1,
                    user_id: 5,
                    latitude: 34.05,
                    longitude: -118.25,
                    altitude: 100,
                },
                {
                    gcs_id: 2,
                    user_id: 5,
                    latitude: 36.17,
                    longitude: -115.14,
                    altitude: 200,
                },
            ],
        };
        mockQuery.mockResolvedValue(mockResult);

        const result = await getAllUsersGCS(1);

        expect(mockQuery).toHaveBeenCalledOnce();
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM ground_control_stations'),
            [1]
        );
        expect(result).toEqual(mockResult);
    });
});

describe('deleteGCS', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should delete a GCS record by gcs_id', async () => {
        const mockResult = { rowCount: 1 };
        mockQuery.mockResolvedValue(mockResult);

        const result = await deleteGCS(1);

        expect(mockQuery).toHaveBeenCalledOnce();
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('DELETE FROM ground_control_stations'),
            [1]
        );
        expect(result).toEqual(mockResult);
    });
});
