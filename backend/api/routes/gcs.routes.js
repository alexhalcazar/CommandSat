import express from 'express';
import { getAllGCS, addGCS, delGCS } from '#controllers/gcs.controller';

const router = express.Router();

router.get('/', getAllGCS);
router.post('/', addGCS);
router.delete('/:id', delGCS);

export default router;
