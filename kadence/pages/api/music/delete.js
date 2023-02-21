import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';
import { ObjectId } from 'mongodb';

const handler = nextConnect();

handler.use(middleware);

handler.delete(async (req, res) => {
    if (!req.body.uid) {
        console.log('No UID sent in request');
        res.status(400).send('No UID sent in request');
        return;
    }
    const query = { _id: new ObjectId(req.body.uid) };
    const result = await req.db.collection('Music').deleteOne(query);

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
