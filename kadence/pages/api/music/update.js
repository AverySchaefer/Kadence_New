import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.patch(async (req, res) => {
    const filter = { uid: req.body.uid };
    const options = { upsert: true };
    const doc = {
        uid: req.body.uid,
        spotifyAccountID: req.body.spotifyAccountID,
        appleMusicAccountID: req.body.appleMusicAccountID,
    };

    if (req.body.uid == null) {
        console.log('No UID sent in request');
        res.status(400).send();
        return;
    }

    const result = await req.db
        .collection('Music')
        .updateOne(filter, doc, options);
    if (result.acknowledged === false) {
        console.log('Request not acknowledged by database');
        res.status(500).send();
    } else if (result.modifiedCount < 1) {
        console.log('Document could not be located');
        res.status(400).send();
    } else {
        console.log('Platform Document Updated');
        res.status(200).send();
    }
});

export default handler;
