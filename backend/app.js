import express from 'express';
import 'dotenv/config';
import satelliteRouter from './api/routes/satellites.routes.js';
const app = express();
const port = 3000;

app.use('/satellites', satelliteRouter);

app.listen(port, () => {
    console.log(`Server is now listening on port ${port}`);
});
