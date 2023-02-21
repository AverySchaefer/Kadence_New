import { getSession } from 'next-auth/react';
import getCurrentSong from '../../../lib/spotify';

const handler = async (req, res) => {
    const {
        token: { accessToken },
    } = await getSession({ req });
    const response = await getCurrentSong(accessToken);
    const songItem = await response.json();

    return res.status(200).json(songItem);
};

export default handler;
