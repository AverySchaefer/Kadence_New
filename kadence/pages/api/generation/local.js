// TODO: fix this later
/* eslint-disable no-await-in-loop */
import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import refreshToken from '@/lib/spotify/refreshToken';
import { shuffleArray } from '@/lib/arrayUtil';
import middleware from '../../../middleware/database';

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

async function generateSearchParams(
    songSeedID,
    prefData,
) {
    /* Generate the general search parameters */
    const minSongLength = prefData.minSongLength * 1000; // convert to ms
    const maxSongLength = prefData.maxSongLength * 1000; // convert to ms
    const lyricalInstrumental = prefData.lyricalInstrumental / 100; // convert to 0-1 scale

    return new URLSearchParams({
        limit: 100,
        seed_tracks: songSeedID,
        target_instrumentalness: lyricalInstrumental,
        min_duration_ms: minSongLength,
        max_duration_ms: maxSongLength,
        min_popularity: 0,
        max_popularity: 20,
    });
}

async function getLocalRecommendations(token, prefData) {
    const { access_token: accessToken } = await refreshToken(token);
    const response = await getCurrentSong(token);
    const songItem = await response.json();
    const songSeedID = songItem.item.id;
    console.log(songSeedID);
    const searchParameters = await generateSearchParams(
        songSeedID,
        prefData,
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