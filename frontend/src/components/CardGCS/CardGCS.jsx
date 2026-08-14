import { Card } from '@components/Card/Card';
import { Button } from '@components/Button/Button';

export const CardGCS = ({ onClick, onSubmit, onDelete, gcsLocations }) => {
    return (
        <div className='flex-container-center'>
            <Card>
                <Button type='button' onClick={onClick}>
                    Close
                </Button>
                <h1>Ground Control Station Overview</h1>
                <div>
                    <h2>List of GCS Locations</h2>
                    <ul>
                        {gcsLocations.map((gcs) => (
                            <li key={gcs.gcs_id}>
                                <span>GCS ID: {gcs.gcs_id}</span>
                                <span>Latitude: {gcs.latitude}</span>
                                <span>Longitude: {gcs.longitude}</span>
                                <span>Altitude: {gcs.altitude}</span>
                                <Button
                                    type='button'
                                    onClick={() => onDelete(gcs.gcs_id)}
                                >
                                    Delete
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Add a new GCS Location</h3>
                    <form onSubmit={onSubmit}>
                        <label htmlFor='lattitude'>Lattitude</label>
                        <input
                            type='text'
                            style={{ display: 'block' }}
                            name='lattitude'
                        ></input>
                        <label htmlFor='longitude'>Longitude</label>
                        <input
                            type='text'
                            style={{ display: 'block' }}
                            name='longitude'
                        ></input>
                        <button type='submit'>Submit</button>
                    </form>
                </div>
            </Card>
        </div>
    );
};
