import nextConnect from 'next-connect';

import getSpotifyAccessToken from '@/lib/spotify/getSpotifyAccessToken';
import { AppleMusicConfiguration } from '@/lib/apple/AppleAPI';
import middleware from '@/middleware/database';

const handler = nextConnect();
handler.use(middleware);

async function getAppleURIFromSpotifyURI(
    spotifyURI,
    accessToken,
    appleUserToken
) {
    // Extract song information
    const songID = spotifyURI.split(':')[2];
    const SPOTIFY_SEARCH_SONG_ENDPOINT = `https://api.spotify.com/v1/tracks/${songID}`;

    const foundSongResp = await fetch(SPOTIFY_SEARCH_SONG_ENDPOINT, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    const foundSong = await foundSongResp.json();

    // Build search query for Apple Music
    const searchParams = new URLSearchParams({
        limit: 1,
        types: 'songs',
        term: `${foundSong.name} ${foundSong.artists
            .map((artist) => artist.name)
            .join(' ')}`,
    });
    const APPLE_SEARCH_SONG_ENDPOINT = `https://api.music.apple.com/v1/catalog/us/search?${searchParams}`;

    // Get first matching song on Apple Music
    const response = await fetch(APPLE_SEARCH_SONG_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${AppleMusicConfiguration.developerToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Music-User-Token': appleUserToken,
        },
        method: 'GET',
    });
    const json = await response.json();

    // Return that song's Apple Music id
    return json.results.songs.data[0].id;
}

handler.get(async (req, res) => {
    const accessToken = await getSpotifyAccessToken();
    const spotifyURIs = JSON.parse(req.query.spotifyURIs);
    const { appleUserToken } = req.query;

    const appleMusicURIs = await Promise.all(
        spotifyURIs.map((uri) =>
            getAppleURIFromSpotifyURI(uri, accessToken, appleUserToken)
        )
    );

    res.status(200).json({
        appleURIs: appleMusicURIs,
    });
});

export default handler;
