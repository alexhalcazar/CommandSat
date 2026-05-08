import { pushJob } from '#services/satellites.service';

export const pushSatelliteJob = async (req, res) => {
    const { userId, gcs } = req.body;
    try {
        await pushJob(userId, gcs);
        res.json({ message: 'queued' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
};
