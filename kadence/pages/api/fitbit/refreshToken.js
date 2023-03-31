import { encodeBase64 } from 'bcryptjs';
import nextConnect from 'next-connect';

import middleware from '../../../middleware/database';

const GET_TOKEN_URL = 'https://api.fitbit.com/oauth2/token';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const basic_token = encodeBase64(process.env.FITBIT_CLIENT_ID + ":" + process.env.FITBIT_CLIENT_SECRET);
    const doc = {
        grant_type: "refresh_token",
        refresh_token: req.body.refreshToken,
    }

    const response = fetch(GET_TOKEN_URL, {
        headers: {
            Authorization: `Basic ${basic_token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: "POST",
        body: JSON.stringify(doc)
    });

    console.log(response);
    // TODO ADD ERROR HANDLING
    res.statusCode(response.status).json(response.json());
})

export default handler;