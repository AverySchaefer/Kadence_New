import nextConnect from 'next-connect';
import middleware from '@/middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    const { username } = req.query;

    if (!username) {
        res.status(400).send('Username missing in request');
        return;
    }

    const user = await req.db.collection('Users').findOne({ username });

    if (!user) {
        res.status(400).send('Username not found!');
        return;
    }

    // TODO: get other information (profile pic, bio, etc.)
    res.status(200).json({
        requests: user.friendRequests,
    });
});

export default handler;
