import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const doc = {
        spotifyAccountID: req.body.spotifyAccountID,
        appleMusicAccountID: req.body.appleMusicAccountID,
    };

    const result = await req.db.collection('Music').insertOne(doc);
    if (result.acknowledged === false) {
        console.log('Request not acknowledged by database');
        res.status(500).send('Request not acknowledged by database');
    } else {
        console.log('Document Created');
        res.status(200).json({ id: result.insertedID });
    }
});

export default handler;
