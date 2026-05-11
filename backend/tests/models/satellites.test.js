import { describe, it, expect, vi, beforeEach } from 'vitest';
import { insertSatellites } from '../../api/models/satellites';

const satellites = [
    {
        gcs_id: 1,
        satid: 4821,
        satname: 'Osiris-1',
        launch_date: '2022-03-15',
        satlat: 34.2571,
        satlng: -118.429,
        satalt: 408.7,
        velocity: 7.66,
        last_contact_time: '2026-05-09 14:32:00',
        signal_strength: 87.4,
        battery_level: 92.1,
        mode: 'Normal',
        updated_at: '2026-05-09 15:00:00',
    },
    {
        gcs_id: 2,
        satid: 2201,
        satname: 'COMET-1',
        launch_date: '2024-06-22',
        satlat: 90.3215,
        satlng: 18.213,
        satalt: 500.2,
        velocity: 9.46,
        last_contact_time: '2026-05-06 10:12:00',
        signal_strength: 90.2,
        battery_level: 94.3,
        mode: 'Normal',
        updated_at: '2026-05-06 10:12:00',
    },
];

const mockQuery = vi.hoisted(() => vi.fn());

vi.mock('../../db/index.js', () => {
    return {
        pool: {
            query: mockQuery,
        },
    };
});

beforeEach(() => {
    mockQuery.mockReset();
});

describe('insertSatellites', () => {
    it('should insert a list of satellites and return newly inserted rows', async () => {
        const mockResult = {
            rows: [
                {
                    satellite_id: 1,
                    gcs_id: 1,
                    satid: 4821,
                    satname: 'Osiris-1',
                    launch_date: '2022-03-15',
                    satlat: 34.2571,
                    satlng: -118.429,
                    satalt: 408.7,
                    velocity: 7.66,
                    last_contact_time: '2026-05-09 14:32:00',
                    signal_strength: 87.4,
                    battery_level: 92.1,
                    mode: 'Normal',
                    updated_at: '2026-05-09 15:00:00',
                },
                {
                    satellite_id: 2,
                    gcs_id: 2,
                    satid: 2201,
                    satname: 'COMET-1',
                    launch_date: '2024-06-22',
                    satlat: 90.3215,
                    satlng: 18.213,
                    satalt: 500.2,
                    velocity: 9.46,
                    last_contact_time: '2026-05-06 10:12:00',
                    signal_strength: 90.2,
                    battery_level: 94.3,
                    mode: 'Normal',
                    updated_at: '2026-05-06 10:12:00',
                },
            ],
        };

        mockQuery.mockResolvedValue(mockResult);

        const result = await insertSatellites(1, satellites);

        expect(result).toEqual(mockResult);
    });
});
