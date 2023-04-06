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

    // Get information about users who have sent friend requests to this user
    const cursor = await req.db
        .collection('Users')
        .find({ username: { $in: user.friendRequests } })
        .project({ _id: 0, username: 1, profilePic: 1 });

    const matches = [];
    await cursor.forEach((match) => matches.push(match));

    res.status(200).json({
        requests: matches,
    });
});

export default handler;
