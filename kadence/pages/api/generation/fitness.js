import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';

import getSpotifyAccessToken from '@/lib/spotify/getSpotifyAccessToken';
import middleware from '../../../middleware/database';
import { shuffleArray } from '@/lib/arrayUtil';

const handler = nextConnect();
handler.use(middleware);

async function generateSearchParams(prefData, heartrate) {
    /* Generate the general search parameters */
    const minSongLength = prefData.minSongLength * 1000; // convert to ms
    const maxSongLength = prefData.maxSongLength * 1000; // convert to ms
    const lyricalInstrumental = prefData.lyricalInstrumental / 100; // convert to 0-1 scale
    const tempoMin = heartrate - 5;
    const tempoMax = heartrate + 5;

    return new URLSearchParams({
        // Get 10 so Apple will be able to have one too
        limit: 10,
        seed_genres: `${prefData.faveGenres.join(',')}`,
        target_instrumentalness: lyricalInstrumental,
        min_duration_ms: minSongLength,
        max_duration_ms: maxSongLength,
        target_tempo: heartrate,
        min_tempo: tempoMin,
        max_tempo: tempoMax,
        // Using this as a method for randomization
        target_popularity: Math.floor(Math.random() * 101),
    });
}

async function getFitnessRecommendations(prefData, heartrate) {
    const accessToken = await getSpotifyAccessToken();
    const searchParameters = await generateSearchParams(prefData, heartrate);

    const RECOMMENDATIONS_ENDPOINT = `https://api.spotify.com/v1/recommendations?`;
    try {
        const response = await fetch(
            RECOMMENDATIONS_ENDPOINT + searchParameters,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        const results = await response.json();
        return results.tracks;
    } catch (err) {
        console.log('Something went wrong fetching recs from Spotify');
        console.log(err);
        return null;
    }
}

function playlistScreening(songItems, userData) {
    const { allowExplicit, blacklistedArtists, blacklistedSongs } = userData;

    return songItems.filter((song) => {
        if (!allowExplicit && song.explicit) return false;
        if (song.artists.some((artist) => blacklistedArtists.includes(artist)))
            return false;
        if (blacklistedSongs.includes(song.name)) return false;
        return true;
    });
}

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
