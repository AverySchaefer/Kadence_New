const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const kadenceSpotifyRefreshToken = process.env.KADENCE_SPOTIFY_REFRESH_TOKEN;

// Returns a fresh access token for the Kadence Spotify account
export default async function getSpotifyAccessToken() {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: kadenceSpotifyRefreshToken,
        }),
    });

    const json = await response.json();
    return json.access_token;
}
