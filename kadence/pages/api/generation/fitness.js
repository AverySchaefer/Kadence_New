import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';

import playlistScreening from '@/lib/generation/playlistScreening';
import getFitnessRecommendations from '@/lib/generation/getFitnessRecommendations';
import { shuffleArray } from '@/lib/arrayUtil';
import middleware from '@/middleware/database';

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
    const queryURL = new URLSearchParams('?'.concat(req.url.split('?')[1]));
    const currentHeartRate = parseInt(queryURL.get('heartrate'), 10);
    const username = queryURL.get('username');

    const userData = await req.db.collection('Users').findOne({ username });

    const prefData = await req.db
        .collection('Preferences')
        .findOne({ _id: new ObjectId(userData.musicPrefs) });

    const songItems = await getFitnessRecommendations(
        prefData,
        currentHeartRate
    );

    if (songItems) {
        const playlistObjs = playlistScreening(songItems, prefData);
        const playlistURIs = playlistObjs
            .map((obj) => obj.uri)
            .filter((uri) => !!uri);
        const shuffledURIs = shuffleArray(playlistURIs);
        res.status(200).json(shuffledURIs);
    } else {
        res.status(500).send(
            'Something went wrong while connecting to Spotify'
        );
    }
});

export default handler;
