# API Documentation

## USERS (`/api/users/~`)

### GET `/api/users/login`

- Request Query Elements
  - username: STRING
  - enteredPW: STRING
- Request Body Elements
  - NONE
- Return Body Elements
  - Description of response status
- Response Status Codes
  - 200: Login Successful
  - 400: Account cannot be found (incorrect or username) or request query parameter missing
  - 401: Incorrect Password

### GET `/api/users/logout`

- Request Query Elements
  - NONE
- Request Body Elements
  - NONE
- Return Body Elements
  - Description of response status
- Response Status Codes
  - 200: Logout Successful

### GET `/api/users/getUsers`

- Request Query Elements
  - username: STRING
- Request Body Elements
  - NONE
- Return Body Elements
  - Result (document or NULL if no document found)
- Response Status Codes
  - 200: Request Successful
  - 400: Account cannot be found (incorrect or missing username)

### DELETE `/api/users/delete`

- Request Body Elements
  - uid: USER_ID
- Return Body Elements
  - Return Doc
- Response Status Codes
  - 200: Request Successful
  - 400: Account cannot be found (incorrect or missing uid)

### POST `/api/users/insert`

- Request Body Elements
  - uid: USER_ID
  - username: STRING
  - email: STRING
  - password: STRING
  - bio: STRING
  - profilePic: STRING
  - private: BOOLEAN
  - devices: DEVICE_ID[]
  - selectedDevice: DEVICE_ID
  - musicPlatforms: MUSIC_ID[]
  - selectedMusic: MUSIC_ID
  - musicPrefs: PREFERENCES_ID
  - waitToSave: BOOLEAN
  - intervalShort: INT
  - intervalLong: INT
  - rampUpTime: INT
  - rampDownTime: INT
  - mood: STRING
  - zipcode: INT
  - friendRequests: USER_ID[]
  - friends: USER_ID[]
  - actions: STRING[]
- Return Body Elements
  - NONE
- Response Status Codes
  - 200: Request Successful
  - 400: No uid provided in request body
  - 500: No account was able to be created

### POST `/api/users/signup`

- Request Body Elements
  - username: STRING
  - email: STRING
  - password: STRING
  - confirmedPassword: STRING
- Return Body Elements
  - NONE
- Response Status Codes
  - 200: Request Successful
  - 400: Invalid input:
    - Email or password not included
    - Password and confirmedPassword do not match
    - Email is invalid
    - Password does not meet strength requirements
    - User with given username or email already exists
  - 500: Request was not acknowledged by the database

### PATCH `/api/users/update`

- Request Body Elements
  - uid: USER_ID
  - username: STRING
  - email: STRING
  - password: STRING
  - bio: STRING
  - profilePic: STRING
  - private: BOOLEAN
  - devices: DEVICE_ID[]
  - selectedDevice: DEVICE_ID
  - musicPlatforms: MUSIC_ID[]
  - selectedMusic: MUSIC_ID
  - musicPrefs: PREFERENCES_ID
  - waitToSave: BOOLEAN
  - intervalShort: INT
  - intervalLong: INT
  - rampUpTime: INT
  - rampDownTime: INT
  - mood: STRING
  - freindRequests: USER_ID[]
  - friends: USER_ID[]
  - actions: STRING[]
- Return Body Elements
  - NONE
- Response Status Codes
  - 200: Request Successful
  - 400: Account cannot be found (incorrect or missing uid)
  - 500: No account was able to be updated

## PREFERENCES (`/api/preferences/~`)

### GET `/api/preferences/getPreferences`

- Request Body Elements
  - uid: PREFERENCE_ID
- Return Body Elements
  - Result (document or NULL if no document found)
- Response Status Codes
  - 200: Request Successful
  - 400: Document cannot be found (incorrect or missing uid)

### DELETE `/api/preferences/delete`

- Request Body Elements
  - uid: PREFERENCE_ID
- Return Body Elements
  - Return Doc
- Response Status Codes
  - 200: Request Successful
  - 400: Preferences document cannot be found (incorrect or missing uid)

### POST `/api/preferences/insert`

- Request Body Elements
  - uid: PREFERENCE_ID
  - allowExplicit: BOOLEAN
  - lyricalInstrumental: INT
  - lyricalLanguage: STRING
  - minSongLength: INT
  - maxSongLength: INT
  - minPlaylistLength: INT
  - maxPlaylistLength: INT
  - faveGenres: STRING[]
  - faveArtists: STRING[]
  - blacklistedArtists: STRING[]
  - blacklistedSongs: STRING[]
- Return Body Elements
  - NONE
- Response Status Codes
  - 200: Request Successful
  - 400: No uid provided in request body
  - 500: No preferences document was able to be created

### PATCH `/api/preferences/update`

- Request Body Elements
  - uid: PREFERENCE_ID
  - allowExplicit: BOOLEAN
  - lyricalInstrumental: INT
  - lyricalLanguage: STRING
  - minSongLength: INT
  - maxSongLength: INT
  - minPlaylistLength: INT
  - maxPlaylistLength: INT
  - faveGenres: STRING[]
  - faveArtists: STRING[]
  - blacklistedArtists: STRING[]
  - blacklistedSongs: STRING[]
- Return Body Elements
  - NONE
- Response Status Codes
  - 200: Request Successful
  - 400: Preference document cannot be found (incorrect or missing uid)
  - 500: No document was able to be updated

## MUSIC (`/api/music/~`)

### GET `/api/music/getPlatform`

- Request Body Elements
  - uid: MUSIC_ID
- Return Body Elements
  - Result (document or NULL if no document found)
- Response Status Codes
  - 200: Request Successful
  - 400: Document cannot be found (incorrect or missing uid)

### DELETE `/api/music/delete`

- Request Body Elements
  - uid: MUSIC_ID
- Return Body Elements
  - Return Doc
- Response Status Codes
  - 200: Request Successful
  - 400: Platform document cannot be found (incorrect or missing uid)

### POST `/api/music/insert`

- Request Body Elements
  - uid: MUSIC_ID
  - spotifyAccountID: STRING
  - appleMusicID: STRING
- Return Body Elements
  - NONE
- Response Status Codes
  - 200: Request Successful
  - 400: No uid provided in request body
  - 500: No platform document was able to be created

### PATCH `/api/music/update`

- Request Body Elements
  - uid: MUSIC_ID
  - spotifyAccountID: STRING
  - appleMusicID: STRING
- Return Body Elements
  - NONE
- Response Status Codes
  - 200: Request Successful
  - 400: Platform document cannot be found (incorrect or missing uid)
  - 500: No document was able to be updated

## DEVICES (`/api/devices/~`)

### GET `/api/devices/getDevices`

- Request Body Elements
  - uid: DEVICE_ID
- Return Body Elements
  - Result (document or NULL if no document found)
- Response Status Codes
  - 200: Request Successful
  - 400: Document cannot be found (incorrect or missing uid)

### DELETE `/api/devices/delete`

- Request Body Elements
  - uid: DEVICE_ID
- Return Body Elements
  - Return Doc
- Response Status Codes
  - 200: Request Successful
  - 400: Device document cannot be found (incorrect or missing uid)

### POST `/api/devices/insert`

- Request Body Elements
  - uid: DEVICE_ID
  - deviceList: STRING[]
  - selectedDeviceName: STRING
  - selectedDeviceID: STRING
  - tracking: BOOLEAN
- Return Body Elements
  - NONE
- Response Status Codes
  - 200: Request Successful
  - 400: No uid provided in request body
  - 500: No device document was able to be created

### PATCH `/api/devices/update`

- Request Body Elements
  - uid: DEVICE_ID
  - deviceList: STRING[]
  - selectedDeviceName: STRING
  - selectedDeviceID: STRING
  - tracking: BOOLEAN
- Return Body Elements
  - NONE
- Response Status Codes
  - 200: Request Successful
  - 400: Device document cannot be found (incorrect or missing uid)
  - 500: No document was able to be updated

## SPOTIFY (`/api/spotify/~`)

### GET `/api/spotify/currentSong`

- Request token elements
  - accessToken
- Return Body
  - Song Item (in JSON format)
- Response Status Codes
  - 200: Request Successful, song item sent