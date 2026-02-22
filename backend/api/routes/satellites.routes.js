import express from 'express';
import { getSatellitesAbove } from '#controllers/satellites.controller';

const router = express.Router();

router.get('/above', getSatellitesAbove);

export default router;
