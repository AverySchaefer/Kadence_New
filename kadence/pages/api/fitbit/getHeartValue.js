import nextConnect from 'next-connect';

import middleware from '../../../middleware/database';

const GET_VALUE_BASE_URL =
    'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec/time/';

const handler = nextConnect();
var currHourString = '';
var currMinuteString = '';
var pastHourString = '';
var pastMinuteString = '';

handler.use(middleware);

async function createURL() {
    const timeObj = new Date();

    const currHour = timeObj.getHours();
    let pastHour = currHour;

    const currMinute = timeObj.getMinutes();
    let pastMinute = currMinute - 1;
    if (currMinute === 0) {
        pastMinute = 59;
        pastHour -= 1;
    }
   
    //Make sure that times are in HH:MM format, even if hours or minutes are less than 10
    //TODO This is still getting a "Failed to parse URL from [object Promise]" error
    if (currHour < 10) {
        currHourString = '0' + currHour.toString();
    } else {
        currHourString = currHour.toString();
    }
    if (currMinute < 10) {
        currMinuteString = '0' + currMinute.toString();
    } else {
        currMinuteString = currMinute.toString();
    }
    if (pastHour < 10) {
        pastHourString = '0' + pastHour.toString();
    } else {
        pastHourString = pastHour.toString();
    }
    if (pastMinute < 10) {
        pastMinuteString = '0' + pastMinute.toString();
    } else {
        pastMinuteString = pastMinute.toString();
    }

    return `${
        GET_VALUE_BASE_URL + pastHourString
    }:${pastMinuteString}/${currHourString}:${currMinuteString}.json`;
}

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

    // Check response
    if (response.status === 401) {
        res.status(401).message('Authorization Token Expired');
    }
    if (response.status === 400) {
        res.status(400).message('Error in request syntax');
    }

    // Handle correct response
    const responseDoc = await response.json();
    /*const valuesArray =
        responseDoc['activities-heart']['activities-heart-intraday'].dataset;
    const mostRecentVal = valuesArray[0].value;
    console.log(mostRecentVal);
    res.status(200).json({value: mostRecentVal});*/
    res.status(200).json(responseDoc);
});

export default handler;
