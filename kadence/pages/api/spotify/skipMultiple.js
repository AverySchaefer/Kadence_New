import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';

import refreshToken from '@/lib/spotify/refreshToken';
import middleware from '../../../middleware/database';

const SKIP_ENDPOINT = 'https://api.spotify.com/v1/me/player/next';

const handler = nextConnect();

handler.use(middleware);

async function skip(token, numberOfSongs) {
    const { access_token: accessToken } = await refreshToken(token);
    for (let i = 0; i < numberOfSongs - 1; i++) {
        const response = fetch(SKIP_ENDPOINT, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) { return response; }
    }
    return fetch(SKIP_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
}

handler.post(async (req, res) => {
    const {
        token: { accessToken },
    } = await getSession({ req });
    const reqBody = await JSON.parse(req.body);
    const numberOfSongs = reqBody.skipTotal;
    const response = await skip(accessToken, numberOfSongs);
    
    if (response.ok) {
        res.status(200).send();
        return;
    }

    const {
        error: { status, message },
    } = await response.json();

    switch (status) {
        case 401:
            res.status(401).send(
                'Bad or expired token. Please sign out and sign back into Spotify.'
            );
            break;
        case 404:
            if (message.includes('No active device found')) {
                res.status(400).send('A device must be active!');
                break;
            }
            res.status(status).send(message);
            break;
        default:
            res.status(status).send(message);
    }
});

export default handler;