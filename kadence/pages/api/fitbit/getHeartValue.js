import nextConnect from 'next-connect';

import middleware from '../../../middleware/database';

const GET_VALUE_BASE_URL =
    'https://api.fitbit.com/1/user/-/activities/heart/date/today/today/1sec/time/';

const handler = nextConnect();

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
    //TODO Add in handling for if hour or minute are only 1 digit (need to add leading zero so its HH:MM)

    return `${
        GET_VALUE_BASE_URL + pastHour
    }:${pastMinute}/${currHour}:${currMinute}.json`;
}

async function getValue(token) {
    const GET_VALUE_URL = 'https://api.fitbit.com/1/user/-/activities/heart/date/today/today/1sec/time/12:02/12:03.json'//createURL();
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
