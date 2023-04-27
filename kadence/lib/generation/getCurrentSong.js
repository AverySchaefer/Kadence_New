import refreshToken from '@/lib/spotify/refreshToken';

export default async function getCurrentSong(token) {
    const { access_token: accessToken } = await refreshToken(token);
    const CURRENT_SONG_ENDPOINT =
        'https://api.spotify.com/v1/me/player/currently-playing';
    return fetch(CURRENT_SONG_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}