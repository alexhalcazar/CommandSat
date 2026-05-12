import { pushJob } from '#services/satellites.service';

export const pushSatelliteJob = async (req, res) => {
    const { user_id, gcs } = req.body;
    try {
        await pushJob(user_id, gcs);
        res.json({ message: 'queued' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
};
