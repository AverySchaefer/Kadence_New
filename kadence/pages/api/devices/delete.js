import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.delete(async (req, res) => {
    if (!req.body._id) {
        console.log('No _id sent in request');
        res.status(400).send('No _id sent in request');
        return;
    }

    const query = { _id: new ObjectId(req.body._id) };
    const result = await req.db.collection('Devices').deleteOne(query);

    if (result.deletedCount === 1) {
        console.log('Successfully deleted one document.');
        res.status(200).json(result);
    } else {
        console.log('No documents matched the query. Deleted 0 documents.');
        res.status(400).send(
            'No documents matched the query. Deleted 0 documents.'
        );
    }
});

export default handler;
