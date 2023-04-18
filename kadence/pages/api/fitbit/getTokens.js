import { encodeBase64 } from 'bcryptjs';
import nextConnect from 'next-connect';
import axios from 'axios';

import middleware from '../../../middleware/database';

const GET_TOKEN_URL = 'https://api.fitbit.com/oauth2/token';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const basicToken = encodeBase64(
        `${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`
    );
    //var hardcodedToken = encodeBase64("23QTD8:aa71de2f3675289bfe176b95838656d1");
    let data = '23QTD8:aa71de2f3675289bfe176b95838656d1';
    let buff = new Buffer.from(data);
    let hardcodedToken = buff.toString('base64', "utf8");
    //console.log('basicToken: ' + basicToken);
    const doc = {
        client_id: process.env.FITBIT_CLIENT_ID,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/profile',
        code: req.body.authorizationCode,
        // code_verifier: "3q4u0f3f2830404x2j5d70483n6f200n593s2h261c0401076e0r6a5x0a6u3e313c516p55500u4162541b0t0f735u5d5b263k6n1w0e24504n6s15060e5i0w356n",
    };
    console.log('hardcodedToken: ' + hardcodedToken);
    console.log(doc);

    let response = await axios.post(GET_TOKEN_URL, {
        headers: {
            Authorization: `Basic ${hardcodedToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: JSON.stringify(doc),
    });
    /*let response = fetch(GET_TOKEN_URL, {
        headers: {
            Authorization: `Basic ${basicToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: JSON.stringify(doc),
    });*/
    let responseJSON = await response.data;

    //console.log(responseJSON);
    // TODO ADD ERROR HANDLING
    res.send(responseJSON);
});

export default handler;
