/* eslint-disable no-await-in-loop */
import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import middleware from '@/middleware/database';
import { shuffleArray } from '@/lib/arrayUtil';
import { getSession } from 'next-auth/react';
import refreshToken from '@/lib/spotify/refreshToken';
import getSpotifyAccessToken from '@/lib/spotify/getSpotifyAccessToken';

const handler = nextConnect();

handler.use(middleware);

async function getCurrentSong(token) {
    const { access_token: accessToken } = await refreshToken(token);
    const CURRENT_SONG_ENDPOINT =
        'https://api.spotify.com/v1/me/player/currently-playing';
    return fetch(CURRENT_SONG_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

function generateSearchParamsSpotifyOnly(prefData, songSeedID, chosenMood) {
    /* Generate the general search parameters */
    const minSongLength = prefData.minSongLength * 1000; // convert to ms
    const maxSongLength = prefData.maxSongLength * 1000; // convert to ms
    const lyricalInstrumental = prefData.lyricalInstrumental / 100; // convert to 0-1 scale

    if (chosenMood === 'happy') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.65,
            max_valence: 1.0,
            target_energy: 0.75,
            target_danceability: 0.65,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'sad') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.0,
            max_valence: 0.35,
            target_energy: 0.25,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'angry') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.0,
            max_valence: 0.35,
            target_energy: 0.75,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'relaxed') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.35,
            max_valence: 0.65,
            target_danceability: 0.25,
            target_tempo: 80,
            max_tempo: 100,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'energetic') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.5,
            max_valence: 0.75,
            min_danceability: 0.65,
            min_energy: 0.75,
            target_energy: 0.8,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'romantic') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.5,
            max_valence: 0.75,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'melancholy') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.0,
            max_valence: 0.35,
            target_danceability: 0.25,
            target_tempo: 80,
            max_tempo: 100,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    return new URLSearchParams({
        limit: 100,
        seed_tracks: songSeedID,
        seed_genres: `${prefData.faveGenres.join(',')}` || undefined,
        target_instrumentalness: lyricalInstrumental,
        min_duration_ms: minSongLength,
        max_duration_ms: maxSongLength,
        // Using this as a method for randomization
        target_popularity: Math.floor(Math.random() * 101),
    });
} 

// Stats for every mood: happy, sad, angry, relaxed, energetic, romantic, melancholy
function generateSearchParams(prefData, chosenMood) {
    /* Generate the general search parameters */
    const minSongLength = prefData.minSongLength * 1000; // convert to ms
    const maxSongLength = prefData.maxSongLength * 1000; // convert to ms
    const lyricalInstrumental = prefData.lyricalInstrumental / 100; // convert to 0-1 scale

    if (chosenMood === 'happy') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: '4o6BgsqLIBViaGVbx5rbRk',
            seed_genres: `${['happy', ...prefData.faveGenres].join(',')}`,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.65,
            max_valence: 1.0,
            target_energy: 0.75,
            target_danceability: 0.65,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'sad') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: '0Wf8Va6aRGqjQM5Wo2T1oI',
            seed_genres: `${['sad', ...prefData.faveGenres].join(',')}`,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.0,
            max_valence: 0.35,
            target_energy: 0.25,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'angry') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: '5zUQZjVB6bfewBXWqsP9PY',
            seed_genres: `${prefData.faveGenres.join(',')}` || undefined,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.0,
            max_valence: 0.35,
            target_energy: 0.75,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'relaxed') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: '5ydoqOVn8eAZE56UXgYOAG',
            seed_genres: `${['chill', ...prefData.faveGenres].join(',')}`,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.35,
            max_valence: 0.65,
            target_danceability: 0.25,
            target_tempo: 80,
            max_tempo: 100,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'energetic') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: '7BY005dacJkbO6EPiOh2wb',
            seed_genres: `${prefData.faveGenres.join(',')}` || undefined,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.5,
            max_valence: 0.75,
            min_danceability: 0.65,
            min_energy: 0.75,
            target_energy: 0.8,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'romantic') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: '1fujSajijBpJlr5mRGKHJN',
            seed_genres: `${['romance', ...prefData.faveGenres].join(',')}`,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.5,
            max_valence: 0.75,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'melancholy') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: '07XaOyTS5hyaWiUK1Bc3bR',
            seed_genres: `${['rainy-day', ...prefData.faveGenres].join(',')}`,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.0,
            max_valence: 0.35,
            target_danceability: 0.25,
            target_tempo: 80,
            max_tempo: 100,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    return new URLSearchParams({
        limit: 100,
        seed_tracks: '4cOdK2wGLETKBW3PvgPWqT',
        seed_genres: `${prefData.faveGenres.join(',')}` || undefined,
        target_instrumentalness: lyricalInstrumental,
        min_duration_ms: minSongLength,
        max_duration_ms: maxSongLength,
        // Using this as a method for randomization
        target_popularity: Math.floor(Math.random() * 101),
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

async function getMoodRecommendationsSpotifyOnly(token, chosenMood, prefData) {
    const { access_token: accessToken } = await refreshToken(token);
    const response = await getCurrentSong(token);
    const songItem = await response.json();
    const songSeedID = songItem.item.id;
    console.log(songSeedID);
    const searchParameters = await generateSearchParamsSpotifyOnly(
        prefData,
        songSeedID,
        chosenMood
    );

    const RECOMMENDATIONS_ENDPOINT = `https://api.spotify.com/v1/recommendations?`;
    try {
        const recs = await fetch(
            RECOMMENDATIONS_ENDPOINT + searchParameters,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        const results = await recs.json();

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
    const platform = queryURL.get('platform');
    const chosenMood = queryURL.get('chosenMood');
    const playlistLength = parseInt(queryURL.get('playlistLength') ?? 20, 10);
    const username = queryURL.get('username');

    if (platform === 'Spotify') {
        console.log('swag');
        const {
            token: { accessToken },
        } = await getSession({ req });
        const userData = await req.db.collection('Users').findOne({ username });

        const prefData = await req.db
            .collection('Preferences')
            .findOne({ _id: new ObjectId(userData.musicPrefs) });

        const songItems = await getMoodRecommendationsSpotifyOnly(accessToken, chosenMood, prefData);
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
