import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
    if (!req.query.username) {
        console.log('No username sent in request');
        res.status(400).send('No username sent in request');
        return;
    }

    const result = await req.db
        .collection('Activities')
        .find({ username: req.query.username });

    if (!result) {
        console.log('Database items could not be found');
        res.status(400).send('Database items could not be found');
    } else {
        console.log('Platform Found');
        res.status(200).json(result);
    }
});

export default handler;