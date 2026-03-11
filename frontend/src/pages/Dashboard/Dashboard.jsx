import { Viewer } from 'resium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { Button } from '@components/Button';
import SatelliteIcon from '@assets/icons/satellite.svg?react';
import './Dashboard.css';
import { useState } from 'react';
import { EntityPoint } from '@components/EntityPoint';

export const Dashboard = () => {
    const [satellites, setSatellites] = useState([]);

    const getCurrentPositionAsync = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };

    const satelliteButton = async () => {
        let lat, lng;
        try {
            const position = await getCurrentPositionAsync();
            lat = position.coords.latitude;
            lng = position.coords.longitude;
        } catch (err) {
            lat = 34.07;
            lng = -118.17;
            console.error(err);
        }

        try {
            const response = await fetch(
                `/api/satellites/above?lat=${lat}&lng=${lng}&alt=${350}&radius=${10}`
            );
            const data = await response.json();
            setSatellites(data.above);
            console.log(lat, lng);
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <>
            <div className='flex-container'>
                <Button
                    onClick={satelliteButton}
                    className='get-satellites-btn'
                >
                    <SatelliteIcon className='satellite-icon' />
                </Button>
            </div>
            <Viewer full>
                {satellites.map((sat) => {
                    const satellite = {
                        longitude: sat.satlng,
                        latitude: sat.satlat,
                        height: sat.satalt,
                        pixelSize: 10,
                    };
                    return (
                        <EntityPoint
                            key={sat.satid}
                            entityPoint={{ ...satellite }}
                        />
                    );
                })}
            </Viewer>
        </>
    );
};
