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
    - 400: Account cannot be found (incorrect username)
    - 401: Incorrect Password