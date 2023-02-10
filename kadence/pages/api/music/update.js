import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const filter = { uid: req.body.uid };
    const options = { upsert: true };
    const doc = {
        uid: req.body.uid,
        spotifyAccountID: req.body.spotifyAccountID,
        appleMusicAccountID: req.body.appleMusicAccountID
    };

    const result = await req.db.collection('Music').updateOne(filter, doc, options);
    console.log("A document with the ID: ${result.insertedID} has been updated");
    res.json(doc);
})

export default handler;