import nextConnect from 'next-connect';

import { AppleMusicConfiguration } from '@/lib/apple/AppleAPI';
import middleware from '@/middleware/database';

const APPLE_SAVE_PLAYLIST_ENDPOINT =
    'https://api.music.apple.com/v1/me/library/playlists';

const handler = nextConnect();
handler.use(middleware);

// Saves the given array of appleURIs to a playlist
handler.post(async (req, res) => {
    const { name, appleURIs, appleUserToken } = req.body;

    // Construct payload for Apple Music API
    const date = new Date();
    const data = {
        attributes: {
            name,
            description: `Created by Kadence at ${date.toLocaleTimeString()} on ${date.toLocaleDateString()}.`,
        },
        relationships: {
            tracks: {
                data: appleURIs.map((uri) => ({
                    id: uri,
                    type: 'songs',
                })),
            },
        },
    };

    // Make playlist
    fetch(APPLE_SAVE_PLAYLIST_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${AppleMusicConfiguration.developerToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Music-User-Token': appleUserToken,
        },
        method: 'POST',
        body: JSON.stringify(data),
        mode: 'cors',
    })
        .then((response) => {
            const { status } = response;
            response.json().then((response2) => {
                if (status !== 201) {
                    console.log(status);
                    console.log(response2.error);
                    res.status(400).send(
                        'There was an error creating the playlist with the songs'
                    );
                } else {
                    res.status(200).json(response2);
                }
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).send('Error occurred while saving to playlist');
        });
});

export default handler;
