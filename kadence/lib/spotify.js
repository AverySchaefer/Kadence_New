const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const CURRENT_SONG_ENDPOINT =
    'https://api.spotify.com/v1/me/player/currently-playing';

const getAccessToken = async (refresh_token) => {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token,
        }),
    });

    return response.json();
};

export const getCurrentSong = async (refresh_token) => {
    const { access_token } = await getAccessToken(refresh_token);
    return fetch(CURRENT_SONG_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};
