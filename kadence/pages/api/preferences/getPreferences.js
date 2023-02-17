import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    if (req.body.uid == null) {
        console.log('No UID sent in request');
        res.status(400).send();
        return;
    }

    let result = await req.db
        .collection('Preferences')
        .findOne({ uid: req.body.uid });

    if (result == false) {
        console.log('Request not acknowledged by database');
        res.status(400).send();
    } else {
        console.log('Document Found');
        res.status(200).json(result);
    }
});

export default handler;
