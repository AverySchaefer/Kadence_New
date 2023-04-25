import nextConnect from 'next-connect';

import middleware from '../../../middleware/database';

const GET_TOKEN_URL = 'https://api.fitbit.com/oauth2/token';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const string = `${process.env.FITBIT_PERSONAL_CLIENT_ID}:${process.env.FITBIT_PERSONAL_CLIENT_SECRET}`;
    const base64Token = Buffer.from(string, 'utf8').toString('base64');
    const doc = {
        client_id: process.env.FITBIT_PERSONAL_CLIENT_ID,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/profile',
        code: req.body.authorizationCode,
        code_verifier: req.body.codeVerifier,
    };

    const response = await fetch(GET_TOKEN_URL, {
        headers: {
            Authorization: `Basic ${base64Token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: new URLSearchParams(doc),
    });

    const result = await response.json();

    //! Why does this default to "Unhandled Status Code" on a 200?
    if (result.status === 400) {
        console.log("Bad Request");
        res.status(400).json(result);
    } else if (result.status === 401) {
        console.log("Authentication Error");
        res.status(401).json(result);
    } else if (result.status === 200) {
        console.log("Request Successful");
        res.status(200).json(result);
    } else {
        console.log("Unhandled Status Code, Check Response");
        res.status(200).json(result);
    }
});

export default handler;