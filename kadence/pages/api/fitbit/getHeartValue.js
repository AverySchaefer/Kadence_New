import nextConnect from 'next-connect';

import middleware from '../../../middleware/database';

const GET_VALUE_BASE_URL =
    'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec/time/';

const handler = nextConnect();
let currHourString = '0';
let currMinuteString = '0';
let pastHourString = '0';
let pastMinuteString = '0';

handler.use(middleware);

// Create the URL that this endpoint will request data from
function createURL() {
    const timeObj = new Date();

    const currHour = timeObj.getHours();
    let pastHour = currHour;

    // *There is a 1-minute delay just to make sure that the app is using sync'd data
    const currMinute = timeObj.getMinutes() - 5;
    let pastMinute = currMinute - 1;
    if (currMinute === 0) {
        pastMinute = 59;
        pastHour -= 1;
    }
   
    // Make sure that times are in HH:MM format, even if hours or minutes are less than 10
    if (currHour < 10) {
        currHourString = currHourString.concat(currHour.toString());
    } else {
        currHourString = currHour.toString();
    }
    if (currMinute < 10) {
        currMinuteString = currMinuteString.concat(currMinute.toString());
    } else {
        currMinuteString = currMinute.toString();
    }
    if (pastHour < 10) {
        pastHourString = pastHourString.concat(pastHour.toString());
    } else {
        pastHourString = pastHour.toString();
    }
    if (pastMinute < 10) {
        pastMinuteString = pastMinuteString.concat(pastMinute.toString());
    } else {
        pastMinuteString = pastMinute.toString();
    }

    const url = `${
        GET_VALUE_BASE_URL + pastHourString
    }:${pastMinuteString}/${currHourString}:${currMinuteString}.json`;
    currHourString = '0';
    currMinuteString = '0';
    pastHourString = '0';
    pastMinuteString = '0';
    return encodeURI(url);
}

// Send the request to the endpoint and return the result
async function getValue(token) {
    const GET_VALUE_URL = createURL();
    console.log(GET_VALUE_URL);
    return fetch(GET_VALUE_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
        },
    });
}

handler.get(async (req, res) => {
    const accessToken = req.query.access_token;
    const response = await getValue(accessToken);
    console.log(response);

    // Check response
    if (response.status === 401) {
        res.status(401).message('Authorization Token Expired');
    }
    if (response.status === 400) {
        res.status(400).message('Error in request syntax');
    }

    // Handle correct response
    const responseDoc = await response.json();
    // console.log(responseDoc);
    const values = responseDoc['activities-heart-intraday'].dataset;
    const mostRecentVal = values[values.length - 1].value;
    // console.log('backend response: ' + mostRecentVal);
    res.status(200).json({value: mostRecentVal});
});

export default handler;
