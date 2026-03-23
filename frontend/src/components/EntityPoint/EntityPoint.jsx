import { Entity, PointGraphics } from 'resium';
import { Cartesian3 } from 'cesium';

/**
 * A resuable Resium component that renders a Cesium Entity with PointGraphics
 * at a fixed geograohic location
 * @typedef {Object} EntityPoint
 * @property {number} longitude - The longitude, in degrees
 * @property {number} latitude - The latitude, in degrees
 * @property {number} height - The height, in meters, above the ellipsoid
 * @property {number} pixelSize - specifies the size in pixels
 */

/**
 * @param {EntityPoint} entityPoint
 * @returns {JSX.Element} - A Resium Entity configured with PointGraphics
 */
export const EntityPoint = ({ longitude, latitude, height, pixelSize }) => {
    const position = Cartesian3.fromDegrees(longitude, latitude, height);

    return (
        <Entity position={position}>
            <PointGraphics pixelSize={pixelSize} />
        </Entity>
    );
};
