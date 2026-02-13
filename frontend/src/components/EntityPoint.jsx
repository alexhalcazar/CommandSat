import { Entity, PointGraphics } from 'resium';
import { Cartesian3 } from 'cesium';

/**
 * A resuable Resium component that renders a Cesium Entity with PointGraphics
 * at a fixed geograohic location
 * @param {Object} props
 * @param {number} props.longitude - The longitude, in degrees
 * @param {number} props.latitude - The latitude, in degrees
 * @param {number} props.height - The height, in meters, above the ellipsoid
 * @param {number} props.pixelSize - specifies the size in pixels
 * @returns {JSX.Element} - A Resium Entity configured with PointGraphics
 */

export const EntityPoint = (entityPoint) => {
    const { longitude, latitude, height, pixelSize } = entityPoint;
    const position = Cartesian3.fromDegrees(longitude, latitude, height);

    return (
        <Entity position={position}>
            <PointGraphics pixelSize={pixelSize} />
        </Entity>
    );
};
