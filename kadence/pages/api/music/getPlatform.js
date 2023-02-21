import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';
import { ObjectId } from 'mongodb';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    if (!req.query.uid) {
        console.log('No UID sent in request');
        res.status(400).send('No UID sent in request');
        return;
    }

    const result = await req.db
        .collection('Music')
        .findOne({ _id: new ObjectId(req.query.uid) });

    if (!result) {
        console.log('Database item could not be found');
        res.status(400).send('Database item could not be found');
    } else {
        console.log('Platform Found');
        res.status(200).json(result);
    }
});

export default handler;
