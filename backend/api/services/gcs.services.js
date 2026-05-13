import {
    getAllUsersGCS,
    createGCS,
    deleteGCS,
} from '../models/groundControlStations.js';

export const getUserGCS = async (userId) => {
    const result = await getAllUsersGCS(userId);
    return result.rows;
};

export const newUserGCS = async (userId, gcs) => {
    const result = await createGCS(userId, gcs);
    return result.rows;
};

export const deleteUserGCS = async (gcs_id) => {
    await deleteGCS(gcs_id);
    console.log('User succesfully deleted!');
};
