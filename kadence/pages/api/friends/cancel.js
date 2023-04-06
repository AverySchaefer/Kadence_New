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

    if (senderUsername === recipientUsername) {
        res.status(400).send('Cannot cancel request to yourself!');
        return;
    }

    // Remove sender from recipient's list of friend requests
    await req.db
        .collection('Users')
        .updateOne(
            { username: recipientUsername },
            { $pull: { friendRequests: senderUsername } }
        );

    res.status(200).send();
});

export default handler;
