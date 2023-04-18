import nextConnect from 'next-connect';

import { AppleMusicConfiguration } from '@/lib/apple/AppleAPI';
import middleware from '@/middleware/database';

const APPLE_SAVE_PLAYLIST_ENDPOINT =
    'https://api.music.apple.com/v1/me/library/playlists';

const handler = nextConnect();
handler.use(middleware);

// Remove when function is finished
handler.post(async (req, res) => {
    const { name, appleURIs, appleUserToken } = req.body;

    // Construct payload for Apple Music API
    const data = {
        attributes: {
            name,
            description: 'Created by Kadence (2023)',
        },
        relationships: {
            tracks: {
                data: appleURIs,
            },
        },
    };

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
                    console.log(
                        'There was an error creating the playlist with the songs'
                    );
                    res.status(400).send('IDK what happened');
                } else {
                    console.log('Playlist successfully created!');
                    console.log(response2);
                    res.status(200).send();
                }
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).send('Error bad');
        });
});

export default handler;
