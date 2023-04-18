import nextConnect from 'next-connect';

import middleware from '../../../middleware/database';

const GET_TOKEN_URL = 'https://api.fitbit.com/oauth2/token';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const doc = {
        client_id: process.env.FITBIT_CLIENT_ID,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/profile',
        code: req.body.authorizationCode,
        code_verifier: req.body.codeVerifier,
    };

    const response = await fetch(GET_TOKEN_URL, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: new URLSearchParams(doc),
    });

    // TODO ADD ERROR HANDLING
    const result = await response.json();
    console.log('response in getTokens', result);
    res.status(200).json(result);
});

export default handler;
