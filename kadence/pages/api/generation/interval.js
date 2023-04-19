import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';

import getSpotifyAccessToken from '@/lib/spotify/getSpotifyAccessToken';
import middleware from '@/middleware/database';
import { shuffleArray } from '@/lib/arrayUtil';

const handler = nextConnect();

handler.use(middleware);

function generateSearchParams(prefData, intervalStatus) {
    /* Generate the general search parameters */
    const minSongLength = prefData.minSongLength * 1000; // convert to ms
    const maxSongLength = prefData.maxSongLength * 1000; // convert to ms
    const lyricalInstrumental = prefData.lyricalInstrumental / 100; // convert to 0-1 scale

    if (intervalStatus === '1') {
        return new URLSearchParams({
            limit: 100,
            seed_genres: `rock, ${prefData.faveGenres.join(',')}`,
            // seed_tracks: songSeedID
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            target_danceability: 0.65,
            min_energy: 0.6,
            min_tempo: 100,
            target_tempo: 120,
        });
    }
    return new URLSearchParams({
        limit: 100,
        seed_genres: `study, rainy-day, chill, ${prefData.faveGenres.join(
            ','
        )}`,
        target_instrumentalness: lyricalInstrumental,
        min_duration_ms: minSongLength,
        max_duration_ms: maxSongLength,
        target_danceability: 0.25,
        target_tempo: 80,
        max_energy: 0.6,
        max_tempo: 100,
    });
}

async function getIntervalRecommendations(prefData, intervalStatus) {
    const accessToken = await getSpotifyAccessToken();
    const searchParameters = generateSearchParams(prefData, intervalStatus);

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
        const songItem = await response.json();

        return songItem.tracks;
    } catch (err) {
        console.log('Something went wrong fetching recs from Spotify');
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
        const playlistURIs = playlistScreening(songItems, prefData);
        res.status(200).json(shuffleArray(playlistURIs));
    } else {
        res.status(500).send(
            'Something went wrong while connecting to Spotify'
        );
    }
});

export default handler;
