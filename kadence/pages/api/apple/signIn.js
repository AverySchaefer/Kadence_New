import nextConnect from 'next-connect';

import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    if (!req.body.username) {
        res.status(400).send('Missing username!');
        return;
    }

    if (!req.body.userToken) {
        res.status(400).send('Missing userToken!');
        return;
    }

    const result = await req.db.collection('Users').updateOne(
        { username: req.body.username },
        {
            $set: {
                appleMusicUserToken: userToken,
            },
        }
    );

    if (result.acknowledged === false) {
        console.log('Request not acknowledged by database');
        res.status(500).send('Request not acknowledged by database');
    } else if (result.matchedCount < 1) {
        console.log('Account could not be located');
        res.status(400).send('Account could not be located');
    } else {
        console.log('Token saved');
        res.status(200).send();
    }
});

export default handler;
