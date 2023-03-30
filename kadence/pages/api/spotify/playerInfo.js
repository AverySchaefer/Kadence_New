import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';

import Default from '@/lib/default';
import refreshToken from '@/lib/spotify/refreshToken';
import middleware from '../../../middleware/database';

const PLAYER_INFO_ENDPOINT = 'https://api.spotify.com/v1/me/player';

const handler = nextConnect();

handler.use(middleware);

async function getPlayerInfo(token) {
    const { access_token: accessToken } = await refreshToken(token);
    return fetch(PLAYER_INFO_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
}

handler.get(async (req, res) => {
    const {
        token: { accessToken },
    } = await getSession({ req });
    const response = await getPlayerInfo(accessToken);

    if (response.status === 204 && response.statusText === 'No Content') {
        res.status(200).json(Default.spotifyPlayerData);
        return;
    }

    const json = await response.json();

    if (!response.ok) {
        const { status, message } = json.error;

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
        return;
    }

    res.status(200).json({
        isPlaying: json.is_playing,
        progressSeconds: Math.round(json.progress_ms / 1000),
        songDurationSeconds: Math.round(json.item.duration_ms / 1000),
        songName: json.item.name,
        songURI: json.item.uri,
        artistName: json.item.artists[0].name,
        albumImageSrc:
            json.item.album.images.at(0)?.url ??
            'https://demofree.sirv.com/nope-not-here.jpg',
    });
});

export default handler;
