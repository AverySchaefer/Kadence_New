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
})

export default handler;