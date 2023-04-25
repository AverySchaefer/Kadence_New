import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    if (!req.query._id) {
        console.log('No _id sent in request');
        res.status(400).send('No _id sent in request');
        return;
    }

    const result = await req.db
        .collection('Music')
        .findOne({ _id: new ObjectId(req.query._id) });

    if (!result) {
        console.log('Database item could not be found');
        res.status(400).send('Database item could not be found');
    } else {
        console.log('Platform Found');
        res.status(200).json(result);
    }
});

export default handler;
