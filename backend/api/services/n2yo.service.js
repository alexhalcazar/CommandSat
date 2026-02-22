import axios from 'axios';
import {
    NoResponseError,
    ServerResponseError,
    RequestSetupError,
} from '#utils/errors';

const BASE_URL = 'https://api.n2yo.com/rest/v1/satellite/';
const API_KEY = process.env.N2YO_API_KEY;

/**
 * Returns all objects within a give search radius above observer's location
 * @param {number} lat - Observers latitude, in degrees
 * @param {number} lng - Observers longitude, in degrees
 * @param {number} alt - Observers altitude above sea level in meters
 * @param {number} radius - Search radius range is 0 to 90 degrees, nearly 0 meaning to show only
 * satellites passing exactly above the oberver location, while 90 degrees to return all satellites above the horizon
 * @param {number} [category_id=0] - Filter satellites by category
 * see possible categories here https://www.n2yo.com/api/#positions
 * @returns {Promise<Object>} - Altitude, latitude, and longitude of satellites footprints to be displayed, and
 * some information to identify the objects
 */
export const fetchSatellitesAbove = async (
    lat,
    lng,
    alt,
    radius,
    category_id = 0
) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/above/${lat}/${lng}/${alt}/${radius}/${category_id}/&apiKey=${API_KEY}`
        );
        return response.data;
    } catch (err) {
        if (err.response) {
            throw new ServerResponseError(err.response.status);
        } else if (err.request) {
            throw new NoResponseError();
        } else {
            throw new RequestSetupError(err.message);
        }
    }
};
