import { Viewer } from 'resium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { Button } from '@components/Button/Button';
import SatelliteIcon from '@assets/icons/satellite.svg?react';
import './Dashboard.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { EntityPoint } from '@components/EntityPoint/EntityPoint';
import { Card } from '@components/Card/Card';
import { Ion } from 'cesium';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

Ion.defaultAccessToken = import.meta.env.VITE_ION_TOKEN;

export const Dashboard = () => {
    const [satellites, setSatellites] = useState([]);
    const [gcsCard, setGcsCard] = useState(false);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [geoAttempted, setGeoAttempted] = useState(false);
    const wsRef = useRef(null);
    const token = sessionStorage.getItem('token');
    const user = token ? jwtDecode(token) : null;
    const userId = user?.user_id;

    const postJob = useCallback(
        async (latitude, longitude) => {
            // hard coded for Demo purposes only
            const alt = 350;

            await axios.post(
                '/api/satellites/jobs',
                {
                    user_id: user.user_id,
                    gcs: [{ lat: latitude, lng: longitude, alt }],
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        },
        [user, token]
    );

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
                if (err.code === 1 && !geoAttempted) {
                    console.log('Permission denied');
                    setGcsCard(true);
                    setGeoAttempted(true);
                } else {
                    console.error(err);
                }
            }
        };

        const initialLog = async () => {
            if (user && !user.hasLoggedIn) {
                const coords = await initializeGCSFromGeolocation();
                try {
                    if (coords) {
                        await postJob(coords.lat, coords.lng);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        };

        initialLog();
    }, []);

    useEffect(() => {
        if (!userId || wsRef.current) return;

        const socket = new WebSocket(
            `${import.meta.env.VITE_WS_URL}?user_id=${user.user_id}`
        );

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
    }, [userId]);

    const handleInitialGCS = (e) => {
        e.preventDefault();

        (async () => {
            await postJob(lat, lng);
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
            {satellites.length === 0 && (
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
