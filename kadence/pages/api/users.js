import nextConnect from 'next-connect';
import middleware from '../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    const doc = await req.db.collection('Users').findOne();
    res.json(doc);
});

export default handler;
