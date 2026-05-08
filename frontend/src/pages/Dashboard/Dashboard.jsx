import { Viewer } from 'resium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { Button } from '@components/Button/Button';
import SatelliteIcon from '@assets/icons/satellite.svg?react';
import './Dashboard.css';
import { useState, useEffect, useRef } from 'react';
import { EntityPoint } from '@components/EntityPoint/EntityPoint';
import { Card } from '@components/Card/Card';
import { Ion } from 'cesium';
import axios from 'axios';

Ion.defaultAccessToken = import.meta.env.VITE_ION_TOKEN;

export const Dashboard = () => {
    const [satellites, setSatellites] = useState([]);
    const [gcsCard, setGcsCard] = useState(false);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const wsRef = useRef(null);

    useEffect(() => {
        const initializeGCSFromGeolocation = async () => {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                setLat(lat);
                setLng(lng);

                return { lat, lng };
            } catch (err) {
                if (err.code === 1) {
                    console.log('Permission denied');
                    setGcsCard(true);
                } else {
                    console.error(err);
                }
            }
        };

        const initialLog = async () => {
            // hard coded for Demo purposes only
            const user = () => {
                // TODO: JWT set in prior auth/login page
                // const token = localStorage.getItem('token');
                // return = JSON.parse(atob(token.split('.')[1]));
                return { userId: '1', hasLoggedIn: false };
            };

            const currentUser = user();

            if (currentUser && !currentUser.hasLoggedIn) {
                const coords = await initializeGCSFromGeolocation();
                try {
                    if (coords) {
                        // hard coded for Demo purposes only
                        const alt = 350;
                        await axios.post('/api/satellites/jobs', {
                            userId: currentUser.userId,
                            gcs: [{ lat: coords.lat, lng: coords.lng, alt }],
                        });
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        };

        initialLog();
    }, []);

    useEffect(() => {
        if (wsRef.current) return;
        // TODO: Grab userId from token
        const socket = new WebSocket('ws://localhost:3000?userId=1');

        wsRef.current = socket;

        socket.addEventListener('open', () => {
            console.log('Connected to server');
        });

        socket.addEventListener('message', (event) => {
            const { type, data } = JSON.parse(event.data);
            if (type === 'satellite_data') {
                setSatellites(data); // update state
            }
        });

        socket.addEventListener('close', () => {
            console.log('Disconnected from server');
        });

        socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });

        // cleanup on unmount
        return () => {
            socket.close();
            wsRef.current = null;
        };
    }, []);

    const handleInitialGCS = (e) => {
        e.preventDefault();
        // TODO: verify lat and lng coords

        (async () => {
            // TODO: get userId from token
            // hard coded for Demo purposes only
            const userId = '1';
            const alt = 350;

            try {
                await axios.post('/api/satellites/jobs', {
                    userId,
                    gcs: [{ lat, lng, alt }],
                });
            } catch (err) {
                console.error(err);
            }
        })();
        setGcsCard(false);
    };

    return (
        <>
            <div className='flex-container'>
                <Button className='get-satellites-btn'>
                    <SatelliteIcon className='satellite-icon' />
                </Button>
            </div>

            {gcsCard && (
                <div className='flex-container-center'>
                    <Card className='card'>
                        Input initial Ground Control Station
                        <form onSubmit={handleInitialGCS}>
                            <label htmlFor='lat'>Lattitude</label>
                            <input
                                type='text'
                                style={{ display: 'block' }}
                                name='lat'
                                value={lat ?? ''}
                                onChange={(e) => setLat(e.target.value)}
                            ></input>
                            <label htmlFor='lng'>Longitude</label>
                            <input
                                type='text'
                                style={{ display: 'block' }}
                                name='lng'
                                value={lng ?? ''}
                                onChange={(e) => setLng(e.target.value)}
                            ></input>
                            <button type='submit'>Submit</button>
                        </form>
                    </Card>
                </div>
            )}
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
