# API Documentation

## USERS (`/api/users/~`)

### GET `/api/users/login`

-   Request Query Elements
    -   username: STRING
    -   enteredPW: STRING
-   Request Body Elements
    -   NONE
-   Return Body Elements
    -   Description of response status
-   Response Status Codes
    -   200: Login Successful
    -   400: Account cannot be found (incorrect or username) or request query parameter missing
    -   401: Incorrect Password

### GET `/api/users/logout`

-   Request Query Elements
    -   NONE
-   Request Body Elements
    -   NONE
-   Return Body Elements
    -   Description of response status
-   Response Status Codes
    -   200: Logout Successful

### GET `/api/users/getUsers`

-   Request Query Elements
    -   username: STRING
-   Request Body Elements
    -   NONE
-   Return Body Elements
    -   Result (document or NULL if no document found)
-   Response Status Codes
    -   200: Request Successful
    -   400: Account cannot be found (incorrect or missing username)

### GET `/api/users/search`

-   Request Query Elements
    -   username: STRING
-   Return Body Elements
    -   results: (array of objects with fields (username, profilePic, bio) that match query)
-   Response Status Codes
    -   200: Request Successful (can return empty array)
    -   400: No username query given

### GET `/api/users/profileInfo`

-   Request Query Elements
    -   viewerUsername: STRING
    -   vieweeUsername: STRING
-   Return Body Elements
    -   username: STRING
    -   bio: STRING
    -   profilePic: STRING
    -   private: BOOLEAN
    -   favoriteAlbum: STRING
    -   favoriteArtist: STRING
    -   favoriteSong: STRING
    -   isFriend: BOOLEAN
    -   isPendingFriend: BOOLEAN
    -   sentMeRequest: BOOLEAN
    -   (Above are always sent, below are sent only for public users or friends)
    -   musicPlatform: STRING
    -   actions: ARRAY of action objects
-   Response Status Codes
    -   200: Request Successful (can return empty array)
    -   400: No username query given

### DELETE `/api/users/delete`

-   Request Body Elements
    -   username: STRING
-   Return Body Elements
    -   Return Doc
-   Response Status Codes
    -   200: Request Successful
    -   400: Account cannot be found (incorrect or missing \_id)

### POST `/api/users/insert`

-   Request Body Elements
    -   username: STRING
    -   email: STRING
    -   password: STRING
    -   bio: STRING
    -   profilePic: STRING
    -   private: BOOLEAN
    -   devices: DEVICES_ID
    -   musicPlatform: STRING
    -   musicPrefs: PREFERENCES_ID
    -   waitToSave: BOOLEAN
    -   intervalShort: INT
    -   intervalLong: INT
    -   rampUpTime: INT
    -   rampDownTime: INT
    -   mood: STRING
    -   zipCode: INT
    -   friendRequests: USER_ID[]
    -   friends: USER_ID[]
    -   actions: STRING[]
-   Return Body Elements
    -   NONE
-   Response Status Codes
    -   200: Request Successful
    -   400: No \_id provided in request body
    -   500: No account was able to be created

### POST `/api/users/signup`

-   Request Body Elements
    -   username: STRING
    -   email: STRING
    -   password: STRING
    -   confirmedPassword: STRING
-   Return Body Elements
    -   NONE
-   Response Status Codes
    -   200: Request Successful
    -   400: Invalid input:
        -   Email or password not included
        -   Password and confirmedPassword do not match
        -   Email is invalid
        -   Password does not meet strength requirements
        -   User with given username or email already exists
    -   500: Request was not acknowledged by the database

### PATCH `/api/users/update`

-   Request Body Elements
    -   username: STRING
    -   email: STRING
    -   password: STRING
    -   bio: STRING
    -   profilePic: STRING
    -   private: BOOLEAN
    -   devices: DEVICES_ID
    -   musicPlatform: STRING
    -   musicPrefs: PREFERENCES_ID
    -   waitToSave: BOOLEAN
    -   intervalShort: INT
    -   intervalLong: INT
    -   rampUpTime: INT
    -   rampDownTime: INT
    -   mood: STRING
    -   zipCode: INT
    -   friendRequests: USER_ID[]
    -   friends: USER_ID[]
    -   actions: STRING[]
-   Return Body Elements
    -   NONE
-   Response Status Codes
    -   200: Request Successful
    -   400: Account cannot be found (incorrect or missing \_id)
    -   500: No account was able to be updated

## FRIENDS (`/api/friends/~`)

### POST `/api/friends/request`

-   Request Body Elements
    -   senderUsername: STRING
    -   recipientUsername: STRING
-   Response Status Codes
    -   200: Request Successful
    -   400: Bad request (usernames missing, usernames same, one doesn't exist)

### POST `/api/friends/cancel`

-   Request Body Elements
    -   senderUsername: STRING
    -   recipientUsername: STRING
-   Response Status Codes
    -   200: Request Successful
    -   400: Bad request (usernames missing, usernames same)

### POST `/api/friends/accept`

-   Request Body Elements
    -   senderUsername: STRING
    -   recipientUsername: STRING
-   Response Status Codes
    -   200: Request Successful
    -   400: Bad request (usernames missing, request doesn't exist)

### POST `/api/friends/deny`

-   Request Body Elements
    -   senderUsername: STRING
    -   recipientUsername: STRING
-   Response Status Codes
    -   200: Request Successful
    -   400: Bad request (usernames missing, usernames same)

### POST `/api/friends/remove`

-   Request Body Elements
    -   username: STRING
    -   usernameToRemove: STRING
-   Response Status Codes
    -   200: Request Successful
    -   400: Bad request (usernames missing, usernames same)

### GET `/api/friends/getRequests`

-   Request Body Elements
    -   username: STRING
-   Response Body Elements
    -   requests: ARRAY of {username, profilePic} for those who've sent requests
-   Response Status Codes
    -   200: Request Successful
    -   400: Bad request (sender and recipient are same, one doesn't exist)

## PREFERENCES (`/api/preferences/~`)

### GET `/api/preferences/getPreferences`

-   Request Body Elements
    -   \_id: PREFERENCES_ID
-   Return Body Elements
    -   Result (document or NULL if no document found)
-   Response Status Codes
    -   200: Request Successful
    -   400: Document cannot be found (incorrect or missing \_id)

### DELETE `/api/preferences/delete`

-   Request Body Elements
    -   \_id: PREFERENCES_ID
-   Return Body Elements
    -   Return Doc
-   Response Status Codes
    -   200: Request Successful
    -   400: Preferences document cannot be found (incorrect or missing \_id)

### POST `/api/preferences/insert`

-   Request Body Elements
    -   allowExplicit: BOOLEAN
    -   lyricalInstrumental: INT
    -   lyricalLanguage: STRING
    -   minSongLength: INT
    -   maxSongLength: INT
    -   minPlaylistLength: INT
    -   maxPlaylistLength: INT
    -   faveGenres: STRING[]
    -   faveArtists: STRING[]
    -   blacklistedArtists: STRING[]
    -   blacklistedSongs: STRING[]
-   Return Body Elements
    -   NONE
-   Response Status Codes
    -   200: Request Successful
    -   400: No \_id provided in request body
    -   500: No preferences document was able to be created

### PATCH `/api/preferences/update`

-   Request Body Elements
    -   \_id: PREFERENCES_ID
    -   allowExplicit: BOOLEAN
    -   lyricalInstrumental: INT
    -   lyricalLanguage: STRING
    -   minSongLength: INT
    -   maxSongLength: INT
    -   minPlaylistLength: INT
    -   maxPlaylistLength: INT
    -   faveGenres: STRING[]
    -   faveArtists: STRING[]
    -   blacklistedArtists: STRING[]
    -   blacklistedSongs: STRING[]
-   Return Body Elements
    -   NONE
-   Response Status Codes
    -   200: Request Successful
    -   400: Preference document cannot be found (incorrect or missing \_id)
    -   500: No document was able to be updated

## MUSIC (`/api/music/~`)

### GET `/api/music/getPlatform`

-   Request Body Elements
    -   \_id: MUSICS_ID
-   Return Body Elements
    -   Result (document or NULL if no document found)
-   Response Status Codes
    -   200: Request Successful
    -   400: Document cannot be found (incorrect or missing \_id)

### DELETE `/api/music/delete`

-   Request Body Elements
    -   \_id: MUSICS_ID
-   Return Body Elements
    -   Return Doc
-   Response Status Codes
    -   200: Request Successful
    -   400: Platform document cannot be found (incorrect or missing \_id)

### POST `/api/music/insert`

-   Request Body Elements
    -   spotifyAccountID: STRING
    -   appleMusicID: STRING
-   Return Body Elements
    -   NONE
-   Response Status Codes
    -   200: Request Successful
    -   400: No \_id provided in request body
    -   500: No platform document was able to be created

### PATCH `/api/music/update`

-   Request Body Elements
    -   \_id: MUSICS_ID
    -   spotifyAccountID: STRING
    -   appleMusicID: STRING
-   Return Body Elements
    -   NONE
-   Response Status Codes
    -   200: Request Successful
    -   400: Platform document cannot be found (incorrect or missing \_id)
    -   500: No document was able to be updated

## DEVICES (`/api/devices/~`)

### GET `/api/devices/getDevices`

-   Request Body Elements
    -   \_id: DEVICES_ID
-   Return Body Elements
    -   Result (document or NULL if no document found)
-   Response Status Codes
    -   200: Request Successful
    -   400: Document cannot be found (incorrect or missing \_id)

### DELETE `/api/devices/delete`

-   Request Body Elements
    -   \_id: DEVICES_ID
-   Return Body Elements
    -   Return Doc
-   Response Status Codes
    -   200: Request Successful
    -   400: Device document cannot be found (incorrect or missing \_id)

### POST `/api/devices/insert`

-   Request Body Elements
    -   deviceList: STRING[]
    -   selectedDeviceName: STRING
    -   selectedDeviceID: STRING
    -   tracking: BOOLEAN
-   Return Body Elements
    -   NONE
-   Response Status Codes
    -   200: Request Successful
    -   400: No \_id provided in request body
    -   500: No device document was able to be created

### PATCH `/api/devices/update`

-   Request Body Elements
    -   \_id: DEVICES_ID
    -   deviceList: STRING[]
    -   selectedDeviceName: STRING
    -   selectedDeviceID: STRING
    -   tracking: BOOLEAN
-   Return Body Elements
    -   NONE
-   Response Status Codes
    -   200: Request Successful
    -   400: Device document cannot be found (incorrect or missing \_id)
    -   500: No document was able to be updated

## SPOTIFY (`/api/spotify/~`)

### POST `/api/spotify/clearQueue`

-   Request token elements
    -   accessToken
-   Return Body
    -   Song Item (in JSON format)
-   Response Status Codes
    -   200: Request Successful, song item sent

### GET `/api/spotify/currentSong`

-   Request token elements
    -   accessToken
-   Return Body
    -   Song Item (in JSON format)
-   Response Status Codes
    -   200: Request Successful, song item sent

### GET `/api/spotify/getPlaylist`

-   Request token elements
    -   accessToken
-   Request Query Elements
    -   playlistID: STRING
-   Return Body
    -   Array of Song Items (in JSON format)
-   Response Status Codes
    -   200: Request Successful, song items sent

### GET `/api/spotify/getQueue`

-   Request token elements
    -   accessToken
-   Return Body
    -   Array of Song Items (in JSON format)
-   Response Status Codes
    -   200: Request Successful, song items sent

### PUT `/api/spotify/pause`

-   Request token elements
    -   accessToken
-   Return Body
    -   NONE
-   Response Status Codes
    -   200: Request Successful
    -   400: No device is currently active
    -   401: Bad token, user needs to sign in again
    -   Others: random Spotify errors, message returned with status code

### PUT `/api/spotify/play`

-   Request token elements
    -   accessToken
-   Return Body
    -   NONE
-   Response Status Codes
    -   200: Request Successful
    -   400: No device is currently active
    -   401: Bad token, user needs to sign in again
    -   Others: random Spotify errors, message returned with status code

### GET `/api/spotify/playerInfo`

-   Request token elements
    -   accessToken
-   Return Body
    -   isPlaying: BOOLEAN
    -   progressSeconds: INT
    -   songDurationSeconds: INT
    -   songName: STRING
    -   songURI: STRING
    -   artistName: STRING
    -   albumImageSrc: STRING
-   Response Status Codes
    -   200: Request Successful, player information sent
    -   400: No device is currently active
    -   401: Bad token, user needs to sign in again
    -   Others: random Spotify errors, message returned with status code

### POST `/api/spotify/queue`

-   Request token elements
    -   accessToken
-   Request Body elements
    -   songURI: STRING
-   Return Body
    -   NONE
-   Response Status Codes
    -   200: Song queued

### GET `/api/spotify/search`

-   Request token elements
    -   accessToken
-   Request query elements
    -   type: STRING ("artist" or "track")
-   Return Body
    -   Artist Data or Track Data (in JSON format)
-   Response Status Codes
    -   200: Artist or Track retrieved

### POST `/api/spotify/skip`

-   Request token elements
    -   accessToken
-   Return Body
    -   NONE
-   Response Status Codes
    -   200: Request Successful
    -   400: No device is currently active
    -   401: Bad token, user needs to sign in again
    -   Others: random Spotify errors, message returned with status code

### POST `/api/spotify/signIn`

-   Request body elements
    -   username: STRING
    -   userToken: STRING
-   Return Body
    -   NONE
-   Response Status Codes
    -   200: Request Successful
    -   400: Bad request

### POST `/api/spotify/signOut`

-   Request Body Elements
    -   username: STRING
-   Return Body
    -   NONE
-   Response Status Codes
    -   200: Request Successful
    -   400: Bad request

## FITBIT `/api/fitbit/~`

### GET `/api/fitbit/getHeartValue`

- Request Query Elements
    - access_token: STRING
- Return Body:
    - value: int
- Response Status Codes
    - 200: Request Successful
    - 401: Authorization token expired
    - 400: Bad request

### POST `/api/fitbit/getTokens`

-   Request Body Elements
    -   authorizationCode: STRING
-   Return Body
    -   access_token: STRING
    -   expires_in: int
    -   refresh_token: STRING
    -   token_type: STING
    -   user_id: STRING
-   Response Status Codes
    -   200: Request Successful
    -   400: Bad Request
    -   401: Bad Authorization Code

### POST `/api/fitbit/refreshTokens`

-   Request Body Elements
    -   refreshToken: STRING
-   Return Body
    -   access_token: STRING
    -   expires_in: int
    -   refresh_token: STRING
    -   token_type: STING
    -   user_id: STRING
-   Response Status Codes
    -   200: Request Successful
    -   400: Bad Request
    -   401: Bad Refresh Code

## Apple `/api/apple/~`

### GET `/api/apple/conversion`

-   Request Query Elements
    -   spotifyURIs: JSON.stringify()ed array of Spotify URIs
    -   appleUserToken: STRING
-   Return Body
    -   appleURIs: STRING[]
-   Response Status Codes
    -   200: Request Successful
    -   400: Bad Request / Error

### POST `/api/apple/saveToPlaylist`

-   Request Body Elements
    -   name: STRING
    -   appleURIs: STRING[]
    -   appleUserToken: STRING
-   Return Body
    -   Apple Music response
-   Response Status Codes
    -   200: Request Successful
    -   400: Bad Request / Error

### POST `/api/apple/signIn`

-   Request Body Elements
    -   username: STRING
    -   userToken: STRING
-   Return Body
    -   NONE
-   Response Status Codes
    -   200: Token Saved
    -   400: User account could not be found
    -   500: Request not acknowleged by database

### POST `/api/apple/signOut`

-   Request Body Elements
    -   username: STRING
-   Return Body
    -   NONE
-   Response Status Codes
    -   200: Token Deleted
    -   400: User account could not be found
    -   500: Request not acknowleged by database

## Friends `/api/friends/~`

### POST `/api/friends/accept`

-   Request Body Elements
    -   senderUsername: STRING
    -   recipientUsername: STRING
-   Response Body
    -   NONE
-   Response Status Code
    -   400: Bad Request (username missing, cannot accept request, recipient doesn't exist, no friend request to accept)
    -   200: Request Accepted

### POST `/api/friends/cancel`

-   Request Body Elements
    -   senderUsername: STRING
    -   recipientUsername: STRING
-   Response Body
    -   NONE
-   Response Status Code
    -   400: Bad Request (username missing, cannot cancel request to yourself)
    -   200: Request Cancelled

### POST `/api/friends/deny`

-   Request Body Elements
    -   senderUsername: STRING
    -   recipientUsername: STRING
-   Response Body
    -   NONE
-   Response Status Code
    -   400: Bad Request (username missing, cannot deny request to yourself)
    -   200: Request Denied

### GET `/api/friends/getRequests`

-   Request Query Elements
    -   username: STRING
-   Response Body
    -   requests: request[]
-   Response Status Codes
    -   400: Username not found
    -   200: Requests found

### POST `/api/friends/remove`

-   Request Body Elements
    -   username: STRING
    -   usernameToRemove: STRING
-   Response Body
    -   NONE
-   Response Status Code
    -   400: Bad Request (username missing, cannot remove yourself as a friend)
    -   200: Friend removed

### POST `/api/friends/request`

-   Request Body Elements
    -   senderUsername: STRING
    -   recipientUsername: STRING
-   Response Body
    -   NONE
-   Response Status Code
    -   400: Bad Request (username missing, cannot send request to yourself, sender/recipient does not exist)
    -   200: Request Sent

## Generation `/api/generation/~`

### GET `/api/generation/interval`

-   Request Query
    -   status: STRING
    -   username: STRING
-   Response Body
    -   An array of the song URIs added to the playlist
-   Response Status Codes
    -   200: Songs queued
    -   204: Nothing could be generated

### GET `/api/generation/local`

-   Request Query
    -   NONE
-   Response Body
    -   An array of the songs added to the playlist
-   Response Status Code
    -   200: Songs queued
    -   204: Nothing could be generated

### GET `/api/generation/mood`

-   Request Query
    -   chosenMood: STRING
    -   playlistLength: int
    -   username: STRING
-   Response Body
    -   An array of the song URIs added to the playlist
-   Response Status Code
    -   200: Songs queued
    -   204: Nothing could be generated

### POST `/api/generation/save`

-   Request Body Elements
    -   playlistName: STRING
    -   playlistArray: songURI[]
-   Response Body
    -   playlistID: ID of generated playlist
-   Response Status Codes
    -   200: Playlist saved
    -   401: Bad or expired auth token
    -   403: Bad OAuth Request
    -   429: Requests sent too quickly
