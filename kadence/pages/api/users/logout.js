import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
    console.log('Logout successful');
    res.status(200).send();
});

export default handler;
