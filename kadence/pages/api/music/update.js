import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.patch(async (req, res) => {
    if (!req.body._id) {
        console.log('No _id sent in request');
        res.status(400).send('No _id sent in request');
        return;
    }

    const filter = { _id: new ObjectId(req.body._id) };
    const options = { upsert: true };
    const doc = {
        spotifyAccountID: req.body.spotifyAccountID,
        appleMusicAccountID: req.body.appleMusicAccountID,
    };

    const result = await req.db
        .collection('Music')
        .updateOne(filter, { $set: doc }, options);

    if (result.acknowledged === false) {
        console.log('Request not acknowledged by database');
        res.status(500).send('Request not acknowledged by database');
    } else if (result.modifiedCount < 1 && result.matchedCount < 1) {
        console.log('Document could not be located');
        res.status(400).send('Document could not be located');
    } else {
        console.log('Platform Document Updated');
        res.status(200).send();
    }
});

export default handler;
