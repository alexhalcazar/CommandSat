export const createGCSService = (gcsRepository) => ({
    // TODO: Either do something with the error or get rid of async/await
    getUserGCS: async (userId) => {
        return await gcsRepository.getAllUsersGCS(userId);
    },
    addUserGCS: async (userId, gcs) => {
        return await gcsRepository.createGCS(userId, gcs);
    },
    deleteUserGCS: async (gcs_id) => {
        return await gcsRepository.deleteGCS(gcs_id);
    },
});
