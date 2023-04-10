import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';

import refreshToken from '@/lib/spotify/refreshToken';
import middleware from '../../../middleware/database';

const handler = nextConnect();
handler.use(middleware);

// stub to fix lint errs
function getMusicInstance() {
    return null;
}

/* FIX */
function getAppleHeader() {
    const header = {
        Authorization: `Bearer ${getMusicInstance().developerToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Music-User-Token': getMusicInstance().musicUserToken,
    };
    return header;
}

async function saveApplePlaylist(playlistObjects, playlistName) {
    const data = {
        attributes: {
            name: playlistName,
            description: 'Created by Kadence (2023)',
        },
        relationships: {
            tracks: {
                data: playlistObjects,
            },
        },
    };

    fetch('https://api.music.apple.com/v1/me/library/playlists', {
        headers: getAppleHeader(),
        method: 'POST',
        body: JSON.stringify(data),
        mode: 'cors',
    })
        .then((response) => {
            const res = response.json();
            const { status } = response;

            res.then((response2) => {
                if (status !== 201) {
                    console.log(status);
                    console.log(response2.error);
                    console.log(
                        'There was an error creating the playlist with the songs'
                    );
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

/* TO DO */
function appleSearch(songName, songArtists) {
    let searchParameter = songArtists[0].concat('+') + songName;
    searchParameter = searchParameter.place(' ', '+');

    const APPLE_SEARCH_SONG_ENDPOINT = `https://api.music.apple.com/v1/catalog/us/search?term=${searchParameter}&limit=1&types=songs`;
    fetch(APPLE_SEARCH_SONG_ENDPOINT, {
        headers: getAppleHeader(),
        method: 'GET',
    })
        .then((response) => {
            const res = response.json();
            const songID = res.results.songs.data.id;
            return (songID, "songs"); // returns a tuple of (id: String, type: String)
        })
        .catch((error) => {
            console.log(error);
        });
}

async function extractSongInformation(token, songURI) {
    const { access_token: accessToken } = await refreshToken(token);
    const songID = songURI.split(':')[2];
    const SPOTIFY_SEARCH_SONG_ENDPOINT = `https://api.spotify.com/v1/tracks/${songID}`;
    const foundSong = fetch(SPOTIFY_SEARCH_SONG_ENDPOINT, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    const songName = foundSong.name;
    const songArtists = [];
    for (let i = 0; i < foundSong.artists.length; i++) {
        songArtists.push(foundSong.artists[i].name);
    }

    return appleSearch(songName, songArtists);
}

// Remove when function is finished
// eslint-disable-next-line no-unused-vars
handler.post(async (req, res) => {
    const {
        token: { accessToken },
    } = await getSession({ req });

    const reqBody = await JSON.parse(req.body);
    const name = reqBody.playlistName;
    const { playlistArray } = reqBody;
    const appleMusicObjects = await Promise.all(
        playlistArray.map((songURI) =>
            extractSongInformation(accessToken, songURI)
        )
    );

    const createResponse = await saveApplePlaylist(name, appleMusicObjects);
    // Remove when function is finished
    // eslint-disable-next-line no-unused-vars
    const created = await createResponse.json();
});

export default handler;
