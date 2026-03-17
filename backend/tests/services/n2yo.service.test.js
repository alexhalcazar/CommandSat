import axios from 'axios';
import { fetchSatellitesAbove } from '#services/n2yo.service';
import { describe, beforeEach, expect, vi, it } from 'vitest';
import {
    ServerResponseError,
    NoResponseError,
    RequestSetupError,
} from '#utils/errors';

vi.mock('axios');

const aboveData = {
    lat: -34.07,
    lng: -118.17,
    alt: 300,
    radius: 10,
};

describe('fetchSatellitesAbove', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('builds the correct URL and returns data on success', async () => {
        const mockSatellite = [
            {
                satid: 1,
                satname: 'satellite',
                intDesignator: '2026-001AA',
                launchDate: '2026-01-01',
                satlat: -51,
                satlng: -150,
                satalt: 1500,
            },
        ];

        axios.get.mockResolvedValue({ data: mockSatellite });
        const data = await fetchSatellitesAbove(
            aboveData.lat,
            aboveData.lng,
            aboveData.alt,
            aboveData.radius
        );

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('above/-34.07/-118.17/300/10/0/&apiKey=')
        );
        expect(data).toEqual(mockSatellite);
    });

    it('throws ServerResponseError on HTTP server error', async () => {
        axios.get.mockRejectedValue({ response: { status: 500 } });
        await expect(
            fetchSatellitesAbove(
                aboveData.lat,
                aboveData.lng,
                aboveData.alt,
                aboveData.radius
            )
        ).rejects.toBeInstanceOf(ServerResponseError);
    });

    it('throws NoResponseError on network error', async () => {
        axios.get.mockRejectedValue({ request: {} });
        await expect(
            fetchSatellitesAbove(
                aboveData.lat,
                aboveData.lng,
                aboveData.alt,
                aboveData.radius
            )
        ).rejects.toBeInstanceOf(NoResponseError);
    });

    it('throws RequestSetupError on setup error', async () => {
        axios.get.mockRejectedValue(new Error('Invalid Config'));
        await expect(
            fetchSatellitesAbove(
                aboveData.lat,
                aboveData.lng,
                aboveData.alt,
                aboveData.radius
            )
        ).rejects.toBeInstanceOf(RequestSetupError);
    });
});
