import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';

import refreshToken from '@/lib/spotify/refreshToken';
import middleware from '../../../middleware/database';

const PLAY_ENDPOINT = 'https://api.spotify.com/v1/me/player/play';

const handler = nextConnect();

handler.use(middleware);

async function play(token) {
    const { access_token: accessToken } = await refreshToken(token);
    return fetch(PLAY_ENDPOINT, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
}

handler.put(async (req, res) => {
    const {
        token: { accessToken },
    } = await getSession({ req });
    const response = await play(accessToken);
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
        case 403:
            if (message.includes('Restriction violated')) {
                // Already playing, that's fine
                res.status(200).send();
                break;
            }
            res.status(status).send(message);
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
