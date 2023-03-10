import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';

import refreshToken from '@/lib/spotify/refreshToken';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

async function createPlaylist(token, playlistName) {
    const { access_token: accessToken } = await refreshToken(token);
    const me = await fetch('https://api.spotify.com/v1/me/', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).then(res => res.json())
    const userId = me.id
    const CREATE_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/users/${userId}/playlists`

    return fetch(CREATE_PLAYLIST_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: playlistName,
            public: true,
        })
    });
}

async function addToPlaylist(token, playlistId, playlistArray) {
    const { access_token: accessToken } = await refreshToken(token);
    const ADD_TO_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`

    return fetch(ADD_TO_PLAYLIST_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            position: 0,
            uris: playlistArray,
        })
    });
}

handler.post(async (req, res) => {
    const {
        token: { accessToken },
    } = await getSession({ req });
    
    const createResponse = await createPlaylist(accessToken, req.playlistName);
    const playlistId = await createResponse.id

    if (createResponse.ok) {
        // NOTE: PlaylistArray can be max length of 100
        const addResponse = await addToPlaylist(accessToken, playlistId, req.playlistArray);
        if (addResponse.ok) {
            res.status(200).send();
            return;
        }
        const {
            error: { addToStatus, addToMessage },
        } = await addResponse.json();

        switch (addToStatus) {
            case 401:
                res.status(401).send(
                    'Bad or expired token. Please sign out and sign back into Spotify.'
                );
                break;
            case 403:
                res.status(403).send(
                    'Bad OAuth Request. Please try again.'
                );
                break;
            case 429:
                res.status(429).send(
                    'Slow down! Requests are being made too fast.'
                );
                break;
            default:
                res.status(addToStatus).send(addToMessage);
        }
    }
    const {
        error: { createStatus, createMessage },
    } = await createResponse.json();
  

    switch (createStatus) {
        case 401:
            res.status(401).send(
                'Bad or expired token. Please sign out and sign back into Spotify.'
            );
            break;
        case 403:
            res.status(403).send(
                'Bad OAuth Request. Please try again.'
            );
            break;
        case 429:
            res.status(429).send(
                'Slow down! Requests are being made too fast.'
            );
            break;
        default:
            res.status(createStatus).send(createMessage);
    }
});

export default handler;