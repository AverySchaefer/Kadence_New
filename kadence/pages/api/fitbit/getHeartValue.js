import nextConnect from 'next-connect';

import middleware from '../../../middleware/database';

const GET_VALUE_BASE_URL = 'https://api.fitbit.com/1/user/-/activities/heart/date/today/today/1sec/time/';

const handler = nextConnect();

handler.use(middleware);

async function createURL() {
    let time_obj = new Date();

    let curr_hour = time_obj.getHours();
    let past_hour = curr_hour;

    let curr_minute = time_obj.getMinutes();
    let past_minute = curr_minute - 1;
    if (curr_minute == 0) {
        past_minute = 59;
        past_hour = past_hour - 1;
    }

    return (GET_VALUE_BASE_URL + past_hour + ':' + past_minute + '/' + curr_hour + ':' + curr_minute + '.json');
} 

async function getValue(token) {
    let GET_VALUE_URL = createURL()
    return fetch(GET_VALUE_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
        },
    });
}

handler.get(async (req, res) => {
    const access_token = req.body.access_token;
    const response = await getValue(access_token);

    // Check response
    if (response.status === 401) {

        res.status(401).message("Authorization Token Expired");

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