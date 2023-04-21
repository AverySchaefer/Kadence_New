import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res) => {
    const doc = {
        username: req.body.username,
        timestamp: req.body.timestamp,
        actionType: req.body.actionType, // friend, gen, save
        friend: req.body.friend,
        genMode: req.body.genMode,
        saved: req.body.saved,
    };

    if (!req.body.username) {
        console.log('No username sent in request');
        res.status(400).send('No username sent in request');
        return;
    }

    const result = await req.db.collection('Activities').insertOne(doc);
    if (result.acknowledged === false) {
        console.log('Request not acknowledged by database');
        res.status(500).send('Request not acknowledged by database');
    } else {
        console.log('Activity Log Created');
        res.status(200).send();
    }
});

export default handler;