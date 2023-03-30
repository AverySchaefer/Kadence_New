import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';

import refreshToken from '@/lib/spotify/refreshToken';
import middleware from '../../../middleware/database';

const handler = nextConnect();
handler.use(middleware);

/* FIX */
function getAppleHeader() {
  const header = {
      Authorization: `Bearer ${getMusicInstance().developerToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Music-User-Token': getMusicInstance().musicUserToken
  }
  return header
}

async function saveApplePlaylist(playlistObjects, playlistName) {
  let data = {
      "attributes": {
          "name": playlistName,
          "description": "Created by Kadence (2023)"
      },
      "relationships": {
          "tracks": {
              "data": playlistObjects
          }
      }
  }

  fetch('https://api.music.apple.com/v1/me/library/playlists', {
      headers: getAppleHeader(),
      method: "POST",
      body: JSON.stringify(data),
      mode: 'cors'
  }).then((response) => {
      var res = response.json()
      var status = response.status;

      res.then((response) => {
          if (status !== 201) {
              console.log(status)
              console.log(response.error)
              console.log("There was an error creating the playlis with the songs")
              return;
          }
      })
  }).catch((error) => {
      console.log(error)
  })
}

/* TO DO */
function appleSearch(songName, songArtists) {
  let searchParameter = songArtists[0] + songName;
  const APPLE_SEARCH_SONG_ENDPOINT = 'https://api.music.apple.com/v1/catalog/us/search?term=' + searchParameter + '&limit=25&types=songs';
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

handler.post(async (req, res) => {
  const {
      token: { accessToken },
  } = await getSession({ req });
  
  const reqBody = await JSON.parse(req.body);
  const name = reqBody.playlistName;
  const array = reqBody.playlistArray;
  const appleMusicObejcts = [];

  for (let i = 0; i < array.length; i++) {
      const appleMusicObject = await extractSongInformation(accessToken, array[i]);
      appleMusicObejcts.push(appleMusicObject);
  }

  const createResponse = await saveApplePlaylist(name, appleMusicObejcts);
  const created = await createResponse.json();
});

export default handler;