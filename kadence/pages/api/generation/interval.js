import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';

import playlistScreening from '@/lib/generation/playlistScreening';
import getIntervalRecommendations from '@/lib/generation/getIntervalRecommendations';
import middleware from '@/middleware/database';
import { shuffleArray } from '@/lib/arrayUtil';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    const queryURL = new URLSearchParams('?'.concat(req.url.split('?')[1]));
    const intervalStatus = queryURL.get('status');
    const username = queryURL.get('username');

    const userData = await req.db.collection('Users').findOne({ username });

    const prefData = await req.db
        .collection('Preferences')
        .findOne({ _id: new ObjectId(userData.musicPrefs) });

    const songItems = await getIntervalRecommendations(
        prefData,
        intervalStatus
    );

    if (songItems) {
        const playlistObjs = playlistScreening(songItems, prefData);
        const playlistURIs = playlistObjs.map((obj) => obj.uri);
        res.status(200).json(shuffleArray(playlistURIs));
    } else {
        res.status(500).send(
            'Something went wrong while connecting to Spotify'
        );
    }
});

export default handler;
