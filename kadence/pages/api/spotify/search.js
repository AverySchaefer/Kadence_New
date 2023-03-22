import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';

import refreshToken from '@/lib/spotify/refreshToken';
import middleware from '../../../middleware/database';

const handler = nextConnect();
handler.use(middleware);

async function searchSong(token, query) {
    const { access_token: accessToken } = await refreshToken(token);
    const SEARCH_ITEM_ENDPOINT = `https://api.spotify.com/v1/search?`

    return fetch(SEARCH_ITEM_ENDPOINT + new URLSearchParams({
        q: query,
        type: "track",
        limit: 1,
        offset: 0,
    }), {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
}

async function searchArtist(token, query) {
    const { access_token: accessToken } = await refreshToken(token);
    const SEARCH_ITEM_ENDPOINT = `https://api.spotify.com/v1/search?`

    return fetch(SEARCH_ITEM_ENDPOINT + new URLSearchParams({
        q: query,
        type: "artist",
        limit: 1,
        offset: 0,
    }), {
        method: 'GET',
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

    const query = await req.query;
    const searchType = await req.type;
    
    if (searchType === "artist") {
        const response = await searchArtist(accessToken, query);
        const artistData = await response.json();
        res.status(200).json(artistData);
    } else {
        const response = await searchSong(accessToken, query);
        const trackData = await response.json();
        res.status(200).json(trackData);
    }
});

export default handler;