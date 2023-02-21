import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    if (!req.query.username) {
        console.log('No Username sent in request');
        res.status(400).send('No Username sent in request');
        return;
    }

    let result = await req.db
        .collection('Users')
        .findOne({ username: req.query.username });

    console.log(result);

    if (!result) {
        console.log('Database item could not be found');
        res.status(400).send('Database item could not be found');
    } else {
        console.log('Account Found');
        res.status(200).json(result);
    }
});

export default handler;
