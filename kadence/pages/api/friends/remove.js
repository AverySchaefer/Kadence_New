import nextConnect from 'next-connect';
import middleware from '@/middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const { username, usernameToRemove } = req.body;

    if (!username || !usernameToRemove) {
        res.status(400).send('Username missing in request');
        return;
    }

    // If same, don't do anything
    if (username === usernameToRemove) {
        res.status(400).send('Cannot remove yourself as a friend!');
        return;
    }

    await req.db
        .collection('Users')
        .updateOne({ username }, { $pull: { friends: usernameToRemove } });

    await req.db
        .collection('Users')
        .updateOne(
            { username: usernameToRemove },
            { $pull: { friends: username } }
        );

    res.status(200).send();
});

export default handler;
