import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';

import refreshToken from '@/lib/spotify/refreshToken';
import middleware from '../../../middleware/database';

const handler = nextConnect();
handler.use(middleware);

async function getPlaylist(token, playlistID) {
    const { access_token: accessToken } = await refreshToken(token);
    const GET_PLAYLIST_TRACKS_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;

    return fetch(GET_PLAYLIST_TRACKS_ENDPOINT, {
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
    const playlistID = queryURL.get('playlistID');
    console.log(playlistID);
    const response = await getPlaylist(accessToken, playlistID);

    const songItems = await response.json();
    console.log(songItems);
    res.status(200).json(songItems);
});

export default handler;