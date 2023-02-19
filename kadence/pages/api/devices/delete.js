import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.delete(async (req, res) => {
    const query = { uid: req.body.uid };
    if (req.body.uid == null) {
        console.log('No UID sent in request');
        res.status(400).send();
        return;
    }
    const result = await req.db.collection('Devices').deleteOne(query);
    if (result.deletedCount === 1) {
        console.log('Successfully deleted one document.');
        res.status(200).json(result).send();
    } else {
        console.log('No documents matched the query. Deleted 0 documents.');
        res.status(400).json().send();
    }
});

export default handler;
