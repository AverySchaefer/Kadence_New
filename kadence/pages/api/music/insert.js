import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const doc = {
        uid: req.body.uid,
        spotifyAccountID: req.body.spotifyAccountID,
        appleMusicAccountID: req.body.appleMusicAccountID
    }

    if (req.body.uid == null) {
        console.log("No UID sent in request");
        res.status(400).send();
    }

    const result = await req.db.collection('Music').insertOne(doc);
    //console.log("A document with the ID: ${result.insertedID} has been added");
    //res.json(doc);
    if (result.acknowledged == false) {
        console.log("Request not acknowledged by database");
        res.status(500).send();
    } else {
        console.log("Document Created");
        res.status(200).send();
    }
})

export default handler;