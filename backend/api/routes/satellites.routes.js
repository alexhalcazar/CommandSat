import express from 'express';
import { pushSatelliteJob } from '#controllers/satellites.controller';

const router = express.Router();

router.post('/jobs', pushSatelliteJob);

export default router;
