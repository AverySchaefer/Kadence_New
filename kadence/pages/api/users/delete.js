import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.delete(async (req, res) => {
    const query = { username: req.body.username };
    if (!req.body.username) {
        console.log('No username sent in request');
        res.status(400).send('No username sent in request');
        return;
    }
    const result = await req.db.collection('Users').deleteOne(query);
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
