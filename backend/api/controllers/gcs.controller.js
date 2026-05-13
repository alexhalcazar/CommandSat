import { getUserGCS, newUserGCS, deleteUserGCS } from '#services/gcs.services';

export const getAllGCS = async (req, res) => {
    const { user_id } = req.user;
    try {
        const response = await getUserGCS(user_id);
        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

export const addGCS = async (req, res) => {
    const { user_id } = req.user;
    const gcs = req.body;
    try {
        const response = await newUserGCS(user_id, gcs);
        return res.status(201).json(response);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

export const delGCS = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteUserGCS(id);
        return res.status(204);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};
