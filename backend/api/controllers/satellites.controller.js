import { fetchSatellitesAbove } from '#services/n2yo.service';
import { CommandSatError } from '#utils/errors';

/**
 * @typedef {Object} SatelliteQuery
 * @property {number} lat - Observers latitude, in degrees
 * @property {number} lng - Observers longitude, in degrees
 * @property {number} alt - Observers altitude above sea level in meters
 * @property {number} radius - Search radius in degrees
 * @property {number} [category_id=0] - Optional satellite category filter
 */

/**
 * @typedef {Object} Satellite
 * @property {string} satid
 * @property {string} satname
 * @property {string} intDesignator
 * @property {string} launchDate
 * @property {number} satlat
 * @property {number} satlng
 * @property {number} satalt
 */

/**
 * @typedef {Object} SatellitesAboveResponse
 * @property {Object} info - Metadata about the response
 * @property {string} info.category
 * @property {number} info.transactioncount
 * @property {number} info.satcount
 * @property {Array<Satellite>} above - Array of satellites
 */

/**
 * GET /satellites/above
 * Calls fetchSatelliteAbove service
 * @param {{ params: SatelliteQuery }} req
 * @param {import('express').Response} res
 * @returns {Promise<SatellitesAboveResponse>} JSON object containing satellite info
 */
export const getSatellitesAbove = async (req, res) => {
    const { lat, lng, alt, radius, category_id } = req.query;
    try {
        const data = await fetchSatellitesAbove(
            lat,
            lng,
            alt,
            radius,
            category_id
        );
        res.json(data);
    } catch (err) {
        if (err instanceof CommandSatError) {
            res.status(err.status).json({ message: err.message });
            console.error(err);
        } else {
            res.status(500).json({ message: err });
            console.error(err);
        }
    }
};
