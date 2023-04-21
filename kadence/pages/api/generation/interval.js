import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';

import refreshToken from '@/lib/spotify/refreshToken';
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

async function generateSearchParams(songSeedID, prefData, intervalStatus) {
    /* Generate the general search parameters */
    const minSongLength = prefData.minSongLength * 1000; // convert to ms
    const maxSongLength = prefData.maxSongLength * 1000; // convert to ms
    const lyricalInstrumental = prefData.lyricalInstrumental / 100; // convert to 0-1 scale

    if (intervalStatus === '1') {
        return new URLSearchParams({
            limit: 1,
            seed_tracks: songSeedID,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.65,
            max_valence: 1.0,
            min_danceability: 0.65,
            min_energy: 0.75,
        });
    }
    return new URLSearchParams({
        limit: 1,
        seed_tracks: songSeedID,
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

async function getIntervalRecommendations(token, prefData, intervalStatus) {
    const { access_token: accessToken } = await refreshToken(token);
    const response = await getCurrentSong(token);
    const songItem = await response.json();
    const songSeedID = songItem.item.id;
    const searchParameters = await generateSearchParams(
        songSeedID,
        prefData,
        intervalStatus
    );

    const RECOMMENDATIONS_ENDPOINT = `https://api.spotify.com/v1/recommendations?`;
    return fetch(RECOMMENDATIONS_ENDPOINT + searchParameters, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

async function playlistScreening(songItems, userData) {
    const explicitFlag = userData.allowExplicit;
    const { blacklistedArtists } = userData;
    const { blacklistedSongs } = userData;
    let blacklistFlag = false;

    const playlistURIs = [];
    for (let i = 0; i < songItems.tracks.length; i++) {
        if (explicitFlag === false && songItems.tracks[i].explicit === true) {
            blacklistFlag = true;
        }

        const songName = songItems.tracks[i].name;
        const songArtists = [];
        for (let j = 0; j < songItems.tracks[i].artists.length; j++) {
            songArtists.push(songItems.tracks[i].artists.name);
        }

        /* Checking the current song against the blacklist songs list */
        for (let k = 0; k < blacklistedSongs.length; k++) {
            if (blacklistedSongs[k] === songName) {
                blacklistFlag = true;
                break;
            }
        }

        /* Doing the same for artists */
        // linter says this loop only allows one iteration
        // eslint-disable-next-line no-unreachable-loop
        for (let l = 0; l < songArtists.length; l++) {
            for (let m = 0; m < blacklistedArtists.length; m++) {
                if (songArtists[l] === blacklistedArtists[m]) {
                    blacklistFlag = true;
                    break;
                }
            }
            break;
        }

        /* Adding all the URIs of the clean songs */
        if (blacklistFlag === false) {
            playlistURIs.push(songItems.tracks[i].uri);
        }
    }
    return playlistURIs;
}

handler.get(async (req, res) => {
    const {
        token: { accessToken },
    } = await getSession({ req });

    const queryURL = new URLSearchParams('?'.concat(req.url.split('?')[1]));
    const intervalStatus = queryURL.get('status');
    const username = queryURL.get('username');

    /* CHECK THAT PREFERENCE DATA IS BEING FOUND CORRECTLY */
    const userData = await req.db.collection('Users').findOne({ username });

    const prefData = await req.db
        .collection('Preferences')
        .findOne({ uid: userData.musicPrefs });

    console.log(userData.musicPrefs);
    console.log(prefData);
    /* END PREF DATA */

    let response = await getIntervalRecommendations(
        accessToken,
        prefData,
        intervalStatus
    );
    const currentSong = await getCurrentSong(accessToken);

    // Check if nothing is currently active (was throwing error before)
    if (response.status === 204 && response.statusText === 'No Content') {
        res.status(200).json({
            item: {
                name: 'Nothing could be generated in local mode!',
            },
        });
        return;
    }

    let songItems = await response.json();
    const currentSongItems = await currentSong.json();
    while (currentSongItems.item.name === songItems.tracks[0].name) {
        console.log('Queued same song');
        // TODO: Fix this
        // eslint-disable-next-line no-await-in-loop
        response = await getIntervalRecommendations(
            accessToken,
            prefData,
            intervalStatus
        );
        // TODO: Fix this
        // eslint-disable-next-line no-await-in-loop
        songItems = await response.json();
    }
    console.log('Queued a different song');
    const playlistURIs = await playlistScreening(songItems, prefData);
    res.status(200).json(playlistURIs);
});

export default handler;
