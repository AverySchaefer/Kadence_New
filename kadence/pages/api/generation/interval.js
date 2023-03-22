import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';

import refreshToken from '@/lib/spotify/refreshToken';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

async function getCurrentSong(token) {
    const { access_token: accessToken } = await refreshToken(token);
    const CURRENT_SONG_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
    return fetch(CURRENT_SONG_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

async function generateSearchParams(songSeedID, intervalStatus) {
    if (intervalStatus === 1) {
        return new URLSearchParams({
            limit: 1,
            seed_tracks: songSeedID,
        });
    }
    return new URLSearchParams({
        limit: 1,
        seed_tracks: songSeedID,
    });
}

async function getIntervalRecommendations(token, intervalStatus) {
    const { access_token: accessToken } = await refreshToken(token);
    const response = await getCurrentSong(token);
    const songItem = await response.json();
    const songSeedID = songItem.item.id;
    const searchParameters = await generateSearchParams(songSeedID, intervalStatus);

    const RECOMMENDATIONS_ENDPOINT = `https://api.spotify.com/v1/recommendations?`;
    return fetch(RECOMMENDATIONS_ENDPOINT + searchParameters, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

handler.get(async (req, res) => {
    const {
        token: { accessToken },
    } = await getSession({ req });
    const intervalStatus = await req.status;
    const response = await getIntervalRecommendations(accessToken, intervalStatus);

    // Check if nothing is currently active (was throwing error before)
    if (response.status === 204 && response.statusText === 'No Content') {
        res.status(200).json({
            item: {
                name: 'Nothing could be generated in local mode!',
            },
        });
        return;
    }

    const playlistSongs = await response.json();
    res.status(200).json(playlistSongs);
});

export default handler;