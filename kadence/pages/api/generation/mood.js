/* eslint-disable no-await-in-loop */
import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import middleware from '@/middleware/database';
import { shuffleArray } from '@/lib/arrayUtil';
import { getSession } from 'next-auth/react';
import playlistScreening from '@/lib/generation/playlistScreening';
import getMoodRecommendations from '@/lib/generation/getMoodRecommendations';
import getMoodRecommendationsSpotifyOnly from '@/lib/generation/getMoodRecommendationsSpotifyOnly';

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
    const queryURL = new URLSearchParams('?'.concat(req.url.split('?')[1]));
    const platform = queryURL.get('platform');
    const chosenMood = queryURL.get('chosenMood');
    const playlistLength = parseInt(queryURL.get('playlistLength') ?? 20, 10);
    const username = queryURL.get('username');

    if (platform === 'Spotify') {
        const {
            token: { accessToken },
        } = await getSession({ req });
        const userData = await req.db.collection('Users').findOne({ username });

        const prefData = await req.db
            .collection('Preferences')
            .findOne({ _id: new ObjectId(userData.musicPrefs) });

        const songItems = await getMoodRecommendationsSpotifyOnly(
            accessToken,
            chosenMood,
            prefData
        );
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
            res.status(200).json(urisToSend);
            return;
        }
        res.status(500).send(
            'Something went wrong while connecting to Spotify'
        );
        return;
    }

    const userData = await req.db.collection('Users').findOne({ username });

    const prefData = await req.db
        .collection('Preferences')
        .findOne({ _id: new ObjectId(userData.musicPrefs) });

    const songItems = await getMoodRecommendations(prefData, chosenMood);

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
        res.status(200).json(urisToSend);
    } else {
        res.status(500).send(
            'Something went wrong while connecting to Spotify'
        );
    }
});

export default handler;
