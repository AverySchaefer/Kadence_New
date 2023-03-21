import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';

import middleware from '../../../middleware/database';

const GET_VALUE_URL = 'https://api.fitbit.com/1/user/-/activities/heart/date/today/today/1sec.json';

const handler = nextConnect();

handler.use(middleware);

async function getValue(token) {
    const { access_token: accessToken } = await refreshToken(token) //TODO Switch this to the Fitbit token refresh!!!
    return fetch(GET_VALUE_URL, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'content-type': 'application/json',
        },
    });
}

handler.get(async (req, res) => {
    const response = await getValue();

    // Check response
    if (response.status === 401) {
        res.status(401).message("User authentication required");
    }
    if (response.status === 400) {
        res.status(400).message("Error in request syntax");
    }

    // Handle correct response
    const responseDoc = await response.json();
    const valuesArray = responseDoc["activities-heart"]["activities-heart-intraday"]["dataset"];
    const mostRecentVal = valuesArray[0].value;
    console.log(mostRecentVal);
    res.status(200).json(mostRecentVal);
})

export default handler;