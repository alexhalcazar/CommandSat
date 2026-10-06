import { describe, it, expect, vi, beforeEach } from 'vitest';
import { satelliteRepository } from '#repositories/satellites';

const satellites = [
    {
        gcs_id: 1,
        satid: 4821,
        satname: 'Osiris-1',
        launchDate: '2022-03-15',
        satlat: 34.2571,
        satlng: -118.429,
        satalt: 408.7,
        velocity: 7.66,
        recorded_at: '2026-05-09 14:32:00',
        signal_strength: 87.4,
        battery_level: 92.1,
        mode: 'Normal',
        updated_at: '2026-05-09 15:00:00',
    },
    {
        gcs_id: 2,
        satid: 2201,
        satname: 'COMET-1',
        launchDate: '2024-06-22',
        satlat: 90.3215,
        satlng: 18.213,
        satalt: 500.2,
        velocity: 9.46,
        recorded_at: '2026-05-06 10:12:00',
        signal_strength: 90.2,
        battery_level: 94.3,
        mode: 'Normal',
        updated_at: '2026-05-06 10:12:00',
    },
];

const mockClient = {
    query: vi.fn(),
    release: vi.fn(),
};
const fakePool = { connect: vi.fn() };
fakePool.connect.mockResolvedValue(mockClient);

const fakeRepository = satelliteRepository(fakePool);

beforeEach(() => {
    vi.clearAllMocks();
});

describe('insertSatellites', () => {
    it('should insert a list of satellites and return newly inserted rows to satellite_catalog table, satillite_postion, and gcs_satellites', async () => {
        const expectedCatalog = {
            rows: [
                {
                    satid: 4821,
                    satname: 'Osiris-1',
                    launchDate: '2022-03-15',
                },
                {
                    satid: 2201,
                    satname: 'COMET-1',
                    launchDate: '2024-06-22',
                },
            ],
        };

        const expectedPosition = {
            rows: [
                {
                    satid: 4821,
                    satlat: 34.2571,
                    satlng: -118.429,
                    satalt: 408.7,
                    velocity: 7.66,
                    recorded_at: '2026-05-09 14:32:00',
                },
                {
                    satid: 2201,
                    satlat: 90.3215,
                    satlng: 18.213,
                    satalt: 500.2,
                    velocity: 9.46,
                    recorded_at: '2026-05-06 10:12:00',
                },
            ],
        };

        const expectedGCSSat = {
            rows: [
                {
                    satid: 4821,
                    gcs_id: 1,
                    signal_strength: 87.4,
                    battery_level: 92.1,
                    mode: 'Normal',
                    updated_at: '2026-05-09 15:00:00',
                },
                {
                    satid: 2201,
                    gcs_id: 2,
                    signal_strength: 90.2,
                    battery_level: 94.3,
                    mode: 'Normal',
                    updated_at: '2026-05-06 10:12:00',
                },
            ],
        };

        mockClient.query
            .mockResolvedValueOnce({}) // BEGIN
            .mockResolvedValueOnce(expectedCatalog) // catalog
            .mockResolvedValueOnce(expectedPosition) // position
            .mockResolvedValueOnce(expectedGCSSat) // gcsSat
            .mockResolvedValueOnce({}); // COMMIT

        const result = await fakeRepository.insertSatellites(1, satellites);

        expect(result).toEqual({
            catalog: expectedCatalog.rows,
            position: expectedPosition.rows,
            gcsSat: expectedGCSSat.rows,
        });
    });
});
