import { fetchSatellitesAbove } from '#services/n2yo.service';
import { CommandSatError } from '#utils/errors';

/**
 * GET /satellites/above
 * Calls fetchSatelliteAbove service
 * @param {Object} req
 * @param {number} req.param.lat - Observers latitude, in degrees
 * @param {number} req.param.lng - Observers longitude, in degrees
 * @param {number} req.param.alt - Observers altitude above sea level in meters
 * @param {number} req.param.radius - Search radius in degrees
 * @param {number} [req.param.category_id=0] - Optional satellite category filter
 * @param {Object} res
 * @returns {Object} 200 - JSON object containing satellite info
 * @returns {Object} 200.info - Metadata about the response
 * @returns {string} 200.info.catgeory
 * @returns {number} 200.info.transactioncount
 * @returns {number} 200.info.satcount
 * @returns {Array<objects>} 200.above - Array of satellites
 * @returns {string} 200.above[].satid
 * @returns {string} 200.above[].satname
 * @returns {string} 200.above[].intDesignator
 * @returns {string} 200.above[].launchDate
 * @returns {number} 200.above[].satlat
 * @returns {number} 200.above[].satlng
 * @returns {number} 200.above[].satalt
 */
export const getSatellitesAbove = async (req, res) => {
    const { lat, lng, alt, radius, category_id } = req.query;
    try {
        const data = await fetchSatellitesAbove(
            lng,
            lat,
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
