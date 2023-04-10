import nextConnect from 'next-connect';
import middleware from '@/middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const { senderUsername, recipientUsername } = req.body;

    if (!senderUsername || !recipientUsername) {
        res.status(400).send('Username missing in request');
        return;
    }

    // If same, don't do anything
    if (senderUsername === recipientUsername) {
        res.status(400).send('Cannot deny request from yourself!');
        return;
    }

    await req.db
        .collection('Users')
        .updateOne(
            { username: recipientUsername },
            { $pull: { friendRequests: senderUsername } }
        );

    res.status(200).send();
});

export default handler;
