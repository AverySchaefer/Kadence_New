# API Documentation

## USERS (`/api/users/~`)

### GET     `/api/users/login`
- Request Body Elements
    - username: STRING
    - enteredPW: STRING
- Return Body Elements
    - NONE
- Response Status Codes
    - 200: Login Successful
    - 400: Account cannot be found (incorrect or username) or request body missing
    - 401: Incorrect Password

### GET     `/api/users/getUsers`
- Request Body Elements
    - uid: USER_ID
- Return Body Elements
    - Result
- Response Status Codes
    - 200: Request Successful
    - 400: Account cannot be found (incorrect or missing uid)

### DELETE     `/api/users/delete`
- Request Body Elements
    - uid: USER_ID
- Return Body Elements
    - Return Doc
- Response Status Codes
    - 200: Request Successful
    - 400: Account cannot be found (incorrect or missing uid)

### POST     `/api/users/insert`
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
    - freindRequests: USER_ID
    - friends: USER_ID[]
    - actions: STRING[]
- Return Body Elements
    - NONE
- Response Status Codes
    - 200: Request Successful
    - 400: No uid provided in request body
    - 500: No account was able to be created

### UPDATE     `/api/users/update`
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
    - freindRequests: USER_ID
    - friends: USER_ID[]
    - actions: STRING[]
- Return Body Elements
    - NONE
- Response Status Codes
    - 200: Request Successful
    - 400: Account cannot be found (incorrect or missing uid)
    - 500: No account was able to be updated