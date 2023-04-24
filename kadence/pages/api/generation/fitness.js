import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';

import getSpotifyAccessToken from '@/lib/spotify/getSpotifyAccessToken';
import middleware from '../../../middleware/database';

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
        limit: 1,
        seed_genres: `rock, ${prefData.faveGenres.join(',')}`,
        // seed_tracks: songSeedID
        target_instrumentalness: lyricalInstrumental,
        min_duration_ms: minSongLength,
        max_duration_ms: maxSongLength,
        target_tempo: heartrate,
        min_tempo: tempoMin,
        max_tempo: tempoMax,
    });
}

async function getFitnessRecommendations(prefData, heartrate) {
    const accessToken = await getSpotifyAccessToken();
    const searchParameters = await generateSearchParams(prefData, heartrate);

    const RECOMMENDATIONS_ENDPOINT = `https://api.spotify.com/v1/recommendations?`;
    try {
        const response = fetch(RECOMMENDATIONS_ENDPOINT + searchParameters, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
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
    const currentHeartRate = queryURL.get('heartrate');
    const username = queryURL.get('username');

    const userData = await req.db.collection('Users').findOne({ username });

    const prefData = await req.db
        .collection('Preferences')
        .findOne({ _id: new ObjectId(userData.musicPrefs) });

    const songItems = await getFitnessRecommendations(
        prefData,
        currentHeartRate
    );

    if (songItems.status === 204 && songItems.statusText === 'No Content') {
        res.status(204).json({
            item: {
                name: 'Nothing could be generated in local mode!',
            },
        });
        return;
    }

    if (songItems) {
        const playlistObjs = playlistScreening(songItems, prefData);
        const playlistURIs = playlistObjs.map((obj) => obj.uri);
        res.status(200).json(playlistURIs);
    } else {
        res.status(500).send(
            'Something went wrong while connecting to Spotify'
        );
    }
});

export default handler;
