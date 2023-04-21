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
        res.status(400).send('Cannot accept request from yourself!');
        return;
    }

    const recipient = await req.db
        .collection('Users')
        .findOne({ username: recipientUsername });

    if (!recipient) {
        res.status(400).send('Recipient does not exist!');
        return;
    }

    if (!recipient.friendRequests.includes(senderUsername)) {
        res.status(400).send('No existing friend request to accept!');
        return;
    }

    await req.db.collection('Users').updateOne(
        { username: recipientUsername },
        {
            $pull: { friendRequests: senderUsername },
            $addToSet: { friends: senderUsername },
        }
    );

    await req.db.collection('Users').updateOne(
        { username: senderUsername },
        {
            $pull: { friendRequests: recipientUsername },
            $addToSet: { friends: recipientUsername },
        }
    );

    res.status(200).send();
});

export default handler;
