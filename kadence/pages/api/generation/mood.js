import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';

import refreshToken from '@/lib/spotify/refreshToken';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

async function getCurrentSong(token) {
    const { access_token: accessToken } = await refreshToken(token);
    const CURRENT_SONG_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
    return fetch(CURRENT_SONG_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

// TODO: Stats for every mood: happy, sad, angry, relaxed, energetic, romantic, melancholy
async function generateSearchParams(songSeedID, chosenMood, totalSongs) {
    console.log(totalSongs);
    if (chosenMood === "happy") {
        return new URLSearchParams({
            limit: totalSongs,
            seed_tracks: songSeedID,
            min_valence: 0.5,
            max_valence: 1.0,
        });
    }
    if (chosenMood === "sad") {
        return new URLSearchParams({
            limit: totalSongs,
            seed_tracks: songSeedID,
            min_valence: 0.0,
            max_valence: 0.5,
        });
    }
    if (chosenMood === "angry") {
        return new URLSearchParams({
            limit: totalSongs,
            seed_tracks: songSeedID,
            min_valence: 0.0,
            max_valence: 0.5,
        });
    }
    if (chosenMood === "relaxed") {
        return new URLSearchParams({
            limit: totalSongs,
            seed_tracks: songSeedID,
            min_valence: 0.0,
            max_valence: 0.5,
        });
    } 
    if (chosenMood === "energetic") {
        return new URLSearchParams({
            limit: totalSongs,
            seed_tracks: songSeedID,
            min_valence: 0.0,
            max_valence: 0.5,
        });
    } 
    if (chosenMood === "romantic") {
        return new URLSearchParams({
            limit: totalSongs,
            seed_tracks: songSeedID,
            min_valence: 0.0,
            max_valence: 0.5,
        });
    } 
    if (chosenMood === "melancholy") {
        return new URLSearchParams({
            limit: totalSongs,
            seed_tracks: songSeedID,
            min_valence: 0.0,
            max_valence: 0.5,
        });
    }
    return new URLSearchParams({
        limit: totalSongs,
        seed_tracks: songSeedID,
    });
}

async function getMoodRecommendations(token, chosenMood, totalSongs) {
    const { access_token: accessToken } = await refreshToken(token);
    const response = await getCurrentSong(token);
    const songItem = await response.json();
    const songSeedID = songItem.item.id;
    const searchParameters = await generateSearchParams(songSeedID, chosenMood, totalSongs);

    const RECOMMENDATIONS_ENDPOINT = `https://api.spotify.com/v1/recommendations?`;
    return fetch(RECOMMENDATIONS_ENDPOINT + searchParameters, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

handler.get(async (req, res) => {
    const {
        token: { accessToken },
    } = await getSession({ req });

    const queryURL = new URLSearchParams('?'.concat(req.url.split('?')[1]));
    const chosenMood = queryURL.get('chosenMood');
    const playlistLength = queryURL.get('playlistLength');
    console.log(chosenMood);
    const response = await getMoodRecommendations(accessToken, chosenMood, playlistLength);

    // Check if nothing is currently active (was throwing error before)
    if (response.status === 204 && response.statusText === 'No Content') {
        res.status(200).json({
            item: {
                name: 'Nothing could be generated in mood mode!',
            },
        });
        return;
    }

    const playlistSongs = await response.json();
    console.log(playlistSongs);
    res.status(200).json(playlistSongs);
});

export default handler;