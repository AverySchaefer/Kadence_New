import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';

import middleware from '../../../middleware/database';

const GET_VALUE_BASE_URL = 'https://api.fitbit.com/1/user/-/activities/heart/date/today/today/1sec/time/';

const handler = nextConnect();

handler.use(middleware);

async function createURL() {
    let time_obj = new Date();
    let curr_hour = time_obj.getHours();
    let curr_minute = time_obj.getMinutes();
    return (GET_VALUE_BASE_URL + curr_hour + '/' + curr_minute + '.json');
} 

async function getValue(token) {
    const { access_token: accessToken } = await refreshToken(token)
    let GET_VALUE_URL = createURL()
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