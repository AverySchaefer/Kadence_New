import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';

import refreshToken from '@/lib/spotify/refreshToken';
import middleware from '../../../middleware/database';

const GET_QUEUE_ENDPOINT =
    'https://api.spotify.com/v1/me/player/queue';

const handler = nextConnect();
handler.use(middleware);

async function getQueue(token) {
    const { access_token: accessToken } = await refreshToken(token);
    return fetch(GET_QUEUE_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

handler.get(async (req, res) => {
    const {
        token: { accessToken },
    } = await getSession({ req });
    const response = await getQueue(accessToken);

    // Check if nothing is currently active (was throwing error before)
    if (response.status === 204 && response.statusText === 'No Content') {
        res.status(200).json({
            item: {
                name: 'Nothing in the queue!',
            },
        });
        return;
    }

    const songItems = await response.json();
    console.log(songItems);
    res.status(200).json(songItems);
});

export default handler;