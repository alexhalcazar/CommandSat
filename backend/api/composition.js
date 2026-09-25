import { createGCSService } from '#services/gcs.services';
import { createAuthService } from '#services/auth.services';
import { createUserService } from '#services/user.services';
import { createSatelliteService } from '#services/satellites.service';
import { pool } from '../db/index.js';
import { userRepository } from '#repositories/users';
import { satelliteRepository } from '#repositories/satellites';
import { gcsRepository } from '#repositories/groundControlStations';

export const gcsService = createGCSService(gcsRepository(pool));
export const userService = createUserService(userRepository(pool));
export const authService = createAuthService(userService);
export const satelliteService = createSatelliteService(
    satelliteRepository(pool)
);
