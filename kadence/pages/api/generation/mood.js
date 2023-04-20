/* eslint-disable no-await-in-loop */
import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import middleware from '@/middleware/database';
import { shuffleArray } from '@/lib/arrayUtil';
import getSpotifyAccessToken from '@/lib/spotify/getSpotifyAccessToken';

const handler = nextConnect();

handler.use(middleware);

// Stats for every mood: happy, sad, angry, relaxed, energetic, romantic, melancholy
function generateSearchParams(prefData, chosenMood) {
    /* Generate the general search parameters */
    const minSongLength = prefData.minSongLength * 1000; // convert to ms
    const maxSongLength = prefData.maxSongLength * 1000; // convert to ms
    const lyricalInstrumental = prefData.lyricalInstrumental / 100; // convert to 0-1 scale

    // TODO: remove this and use genres or seed tracks instead
    const songSeedID = '0c6xIDDpzE81m2q797ordA';

    if (chosenMood === 'happy') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            seed_genres: `${prefData.faveGenres.join(',')}` || undefined,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.65,
            max_valence: 1.0,
            target_energy: 0.75,
            target_danceability: 0.65,
        });
    }
    if (chosenMood === 'sad') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            seed_genres: `${prefData.faveGenres.join(',')}` || undefined,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.0,
            max_valence: 0.35,
            target_energy: 0.25,
        });
    }
    if (chosenMood === 'angry') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            seed_genres: `${prefData.faveGenres.join(',')}` || undefined,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.0,
            max_valence: 0.35,
            target_energy: 0.75,
        });
    }
    if (chosenMood === 'relaxed') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            seed_genres: `${prefData.faveGenres.join(',')}` || undefined,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.35,
            max_valence: 0.65,
            target_danceability: 0.25,
            target_tempo: 80,
            max_tempo: 100,
        });
    }
    if (chosenMood === 'energetic') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            seed_genres: `${prefData.faveGenres.join(',')}` || undefined,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.5,
            max_valence: 0.75,
            min_danceability: 0.65,
            min_energy: 0.75,
            target_energy: 0.8,
        });
    }
    if (chosenMood === 'romantic') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            seed_genres: `${prefData.faveGenres.join(',')}` || undefined,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.5,
            max_valence: 0.75,
        });
    }
    if (chosenMood === 'melancholy') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            seed_genres: `${prefData.faveGenres.join(',')}` || undefined,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.0,
            max_valence: 0.35,
            target_danceability: 0.25,
            target_tempo: 80,
            max_tempo: 100,
        });
    }
    return new URLSearchParams({
        limit: 100,
        seed_tracks: songSeedID,
        seed_genres: `${prefData.faveGenres.join(',')}` || undefined,
        target_instrumentalness: lyricalInstrumental,
        min_duration_ms: minSongLength,
        max_duration_ms: maxSongLength,
    });
}

async function getMoodRecommendations(prefData, chosenMood) {
    const accessToken = await getSpotifyAccessToken();

    const searchParameters = await generateSearchParams(prefData, chosenMood);
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
    const chosenMood = queryURL.get('chosenMood');
    const playlistLength = parseInt(queryURL.get('playlistLength') ?? 20, 10);
    const username = queryURL.get('username');

    const userData = await req.db.collection('Users').findOne({ username });

    const prefData = await req.db
        .collection('Preferences')
        .findOne({ _id: new ObjectId(userData.musicPrefs) });

    const songItems = await getMoodRecommendations(prefData, chosenMood);

    if (songItems) {
        const playlistObjs = playlistScreening(songItems, prefData);
        const playlistURIs = playlistObjs.map((obj) => obj.uri);
        const shuffledURIs = shuffleArray(playlistURIs);
        const urisToSend = shuffledURIs.slice(0, playlistLength);
        res.status(200).json(urisToSend);
    } else {
        res.status(500).send(
            'Something went wrong while connecting to Spotify'
        );
    }
});

export default handler;
