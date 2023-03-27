import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';

import refreshToken from '@/lib/spotify/refreshToken';
import middleware from '../../../middleware/database';
import NetworkAPI from '@/lib/networkAPI';

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

async function playlistScreening(songItems, username) {
    /* GET BLACKLISTED SONGS / ARTISTS HERE */
    const { data: userData } = await NetworkAPI.get('/api/users/getUsers', {
        username: username,
    });
    const blacklistedArtists = userData.blacklistedArtists;
    const blacklistedSongs = userData.blacklistedSongs;
    let blacklistFlag = false;

    const playlistURIs = [];
    for (let i = 0; i < songItems.tracks.length; i++) {
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
    const chosenMood = queryURL.get('chosenMood');
    const playlistLength = queryURL.get('playlistLength');
    const username = queryURL.get('username');
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

    const songItems = await response.json();
    const playlistURIs = await playlistScreening(songItems, username);
    let lengthDifference = playlistLength - playlistURIs.length;

    while (lengthDifference > 0) {
        const newResponse = await getMoodRecommendations(accessToken, chosenMood, lengthDifference);
        const newSongItems = await response.json();
        const newPlaylistURIs = await playlistScreening(newSongItems);
        playlistURIs.concat(newPlaylistURIs);
        lengthDifference = playlistLength - playlistURIs.length;
    }

    res.status(200).json(playlistURIs);
});

export default handler;