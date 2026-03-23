import { Viewer } from 'resium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { Button } from '@components/Button/Button';
import SatelliteIcon from '@assets/icons/satellite.svg?react';
import './Dashboard.css';
import { useState } from 'react';
import { EntityPoint } from '@components/EntityPoint/EntityPoint';
import { Card } from '@components/Card/Card';

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
                `/api/satellites/above?lat=${lat}&lng=${lng}&alt=${350}&radius=${20}`
            );
            const data = await response.json();
            setSatellites(data.above);
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
                {satellites?.map((sat) => {
                    const satellite = {
                        longitude: sat.satlng,
                        latitude: sat.satlat,
                        height: sat.satalt,
                        pixelSize: 10,
                    };
                    return <EntityPoint key={sat.satid} {...satellite} />;
                })}
            </Viewer>
            {!satellites && (
                <div className='flex-container-center'>
                    <Card className='card card-error'>
                        No Satellites detected with given location and above
                        degrees
                    </Card>
                </div>
            )}
        </>
    );
};
