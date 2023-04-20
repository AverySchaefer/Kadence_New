import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';

import refreshToken from '@/lib/spotify/refreshToken';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

async function addToQueue(token, songURI) {
    const { access_token: accessToken } = await refreshToken(token);
    const ADD_TO_PLAYBACK_QUEUE_ENDPOINT = `https://api.spotify.com/v1/me/player/queue?`;

    return fetch(
        ADD_TO_PLAYBACK_QUEUE_ENDPOINT +
            new URLSearchParams({
                uri: songURI,
            }),
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
    );
}

handler.post(async (req, res) => {
    const {
        token: { accessToken },
    } = await getSession({ req });

    const { songURI: uri } = req.body;
    console.log(uri);

    const response = await addToQueue(accessToken, uri);
    if (response.ok) {
        res.status(200).send();
        return;
    }

    const {
        error: { status, message },
    } = await response.json();
    res.status(status).send(message);
});

export default handler;
