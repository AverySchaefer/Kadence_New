import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    if (req.query.uid == null) {
        console.log('No UID sent in request');
        res.status(400).send();
        return;
    }

    let result = await req.db
        .collection('Preferences')
        .findOne({ uid: req.body.uid });

    if (result == null) {
        console.log('Database item could not be found');
        res.status(400).json(result);
    } else {
        console.log('Document Found');
        res.status(200).json(result);
    }
});

export default handler;
