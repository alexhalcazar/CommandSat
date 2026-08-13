import { Viewer } from 'resium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { Button } from '@components/Button/Button';
import SatelliteIcon from '@assets/icons/satellite.svg?react';
import './Dashboard.css';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { EntityPoint } from '@components/EntityPoint/EntityPoint';
import { Card } from '@components/Card/Card';
import { Ion } from 'cesium';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { CardGCS } from '@components/CardGCS/CardGCS';

Ion.defaultAccessToken = import.meta.env.VITE_ION_TOKEN;

export const Dashboard = () => {
    const [satellites, setSatellites] = useState({});
    const [gcsDash, setGcsDash] = useState(false);
    const [gcsLocations, setGCSLocations] = useState([]);
    const [selectedSat, setSelectedSat] = useState(null);
    const wsRef = useRef(null);
    const token = sessionStorage.getItem('token');
    const user = useMemo(() => (token ? jwtDecode(token) : null), [token]);
    const userId = user?.user_id;
    const alt = 350; // hard coded for Demo purposes only

    const satelliteJob = useCallback(
        async (latitude, longitude) => {
            await axios.post(
                '/api/satellites/jobs',
                {
                    user_id: userId,
                    gcs: [{ lat: latitude, lng: longitude, alt }],
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        },
        [userId, token]
    );

    const gcsJob = useCallback(
        async (latitude, longitude) => {
            await axios.post(
                '/api/gcs',
                {
                    lat: latitude,
                    lng: longitude,
                    alt,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        },
        [token]
    );

    const getGCS = useCallback(async () => {
        try {
            const response = await axios.get('/api/gcs', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userGCS = response.data;
            setGCSLocations(userGCS);
        } catch (err) {
            console.error(err);
        }
    }, [token]);

    useEffect(() => {
        let ignore = false;
        const initializeGCSFromGeolocation = async () => {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                return { lat, lng };
            } catch (err) {
                if (err.code === 1) {
                    console.log('Permission denied');
                    if (!ignore) setGcsDash(true);
                } else {
                    console.error(err);
                }
            }
            return null;
        };

        const initialLog = async () => {
            if (user && user.isFirstLogin) {
                const coords = await initializeGCSFromGeolocation();
                if (ignore || !coords) return;
                try {
                    await gcsJob(coords.lat, coords.lng);
                    await satelliteJob(coords.lat, coords.lng);
                } catch (err) {
                    console.error(err);
                }
            }
        };

        initialLog();

        return () => {
            ignore = true;
        };
    }, [user, gcsJob, satelliteJob]);

    useEffect(() => {
        if (!userId || wsRef.current) return;

        const socket = new WebSocket(
            `${import.meta.env.VITE_WS_URL}?user_id=${userId}`
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
            if (socket.readyState === WebSocket.CONNECTING) {
                // wait for the connection to open
                socket.addEventListener('open', () => {
                    console.log('Connected to server');
                });
            } else {
                socket.close();
            }

            wsRef.current = null;
        };
    }, [userId]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- false positive ref: https://github.com/react/react/issues/34045
        getGCS();
    }, [getGCS]);

    const addGCS = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        (async () => {
            try {
                await gcsJob(
                    formData.get('lattitude'),
                    formData.get('longitude')
                );
                await satelliteJob(
                    formData.get('lattitude'),
                    formData.get('longitude')
                );
                await getGCS();
            } catch (err) {
                console.log('error', err);
            }
        })();
    };

    const handleDelete = async (gcsID) => {
        try {
            await axios.delete(`/api/gcs/${gcsID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await getGCS();
        } catch (err) {
            console.log('error', err);
        }
    };

    return (
        <>
            <div className='flex-container'>
                <Button
                    onClick={() => {
                        setGcsDash(true);
                    }}
                    className='get-satellites-btn'
                >
                    <SatelliteIcon className='satellite-icon' />
                </Button>
            </div>
            {gcsDash && (
                <CardGCS
                    onClick={() => setGcsDash(false)}
                    onSubmit={addGCS}
                    onDelete={handleDelete}
                    gcsLocations={gcsLocations}
                ></CardGCS>
            )}
            <Viewer
                full
                infoBox={true}
                selectionIndicator={true}
                onSelectedEntityChange={(entity) => {
                    if (entity?.properties) {
                        // evaluate Cesium's PropertyBag and return all properties as a plain JS Object
                        setSelectedSat(entity.properties.getValue());
                    } else {
                        setSelectedSat(null);
                    }
                }}
            >
                {Object.entries(satellites)?.map(([, value]) => {
                    const satellite = {
                        longitude: value.satlng,
                        latitude: value.satlat,
                        height: value.satalt,
                        pixelSize: 10,
                        data: value,
                    };
                    return <EntityPoint key={value.satid} {...satellite} />;
                })}
                {gcsLocations?.map((gcs) => {
                    const groundControlStation = {
                        longitude: gcs.longitude,
                        latitude: gcs.latitude,
                        height: gcs.altitude,
                        pixelSize: 20,
                        color: 'RED',
                        data: gcs,
                    };
                    return (
                        <EntityPoint
                            key={gcs.gcs_id}
                            {...groundControlStation}
                        />
                    );
                })}
            </Viewer>
            {selectedSat && (
                <Card className='card'>
                    <h3>Selected Satellite</h3>
                    <p>ID: {selectedSat.satid}</p>
                    <p>Latitude: {selectedSat.satlat}</p>
                    <p>Longitude: {selectedSat.satlng}</p>
                    <p>Altitude: {selectedSat.satalt}</p>
                </Card>
            )}
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
