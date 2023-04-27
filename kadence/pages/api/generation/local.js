// TODO: fix this later
/* eslint-disable no-await-in-loop */
import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import { shuffleArray } from '@/lib/arrayUtil';
import playlistScreening from '@/lib/generation/playlistScreening';
import getLocalRecommendations from '@/lib/generation/getLocalRecommendations';
import middleware from '../../../middleware/database';

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
    const {
        token: { accessToken },
    } = await getSession({ req });

    const queryURL = new URLSearchParams('?'.concat(req.url.split('?')[1]));
    const playlistLength = parseInt(queryURL.get('playlistLength') ?? 20, 10);
    const username = queryURL.get('username');

    const userData = await req.db.collection('Users').findOne({ username });

    const prefData = await req.db
        .collection('Preferences')
        .findOne({ _id: new ObjectId(userData.musicPrefs) });

    const songItems = await getLocalRecommendations(
        accessToken,
        prefData,
        playlistLength
    );

    // Check if nothing is currently active (was throwing error before)
    if (songItems.status === 204 && songItems.statusText === 'No Content') {
        res.status(204).json({
            item: {
                name: 'Nothing could be generated in mood mode!',
            },
        });
        return;
    }

    if (songItems) {
        const playlistObjs = playlistScreening(songItems, prefData);
        const playlistURIs = playlistObjs.map((obj) => ({
            uri: obj.uri,
            name: obj.name,
            artwork:
                obj.album.images.at(0)?.url ??
                'https://demofree.sirv.com/nope-not-here.jpg',
        }));
        const shuffledURIs = shuffleArray(playlistURIs);
        // Filtering out random (possibly deleted) tracks?
        const filteredURIs = shuffledURIs.filter((obj) => obj.name !== '');
        const urisToSend = filteredURIs.slice(0, playlistLength);
        console.log(urisToSend);
        res.status(200).json(urisToSend);
    } else {
        res.status(500).send(
            'Something went wrong while connecting to Spotify'
        );
    }
});

export default handler;