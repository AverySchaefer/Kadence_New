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
        res.status(400).send('Cannot send request to yourself!');
        return;
    }

    const sender = await req.db
        .collection('Users')
        .findOne({ username: senderUsername });

    if (!sender) {
        res.status(400).send('Sender does not exist!');
        return;
    }

    // Check if already friends, if so do nothing
    if (sender.friends.includes(recipientUsername)) {
        res.status(200).send();
        return;
    }

    // Check if they've sent friend requests to each other
    // If so make them friends
    if (sender.friendRequests.includes(recipientUsername)) {
        await req.db.collection('Users').updateOne(
            { username: senderUsername },
            {
                $pull: { friendRequests: recipientUsername },
                $addToSet: { friends: recipientUsername },
            }
        );

        await req.db.collection('Users').updateOne(
            { username: recipientUsername },
            {
                $pull: { friendRequests: senderUsername },
                $addToSet: { friends: senderUsername },
            }
        );

        res.status(200).send();
        return;
    }

    const recipient = await req.db
        .collection('Users')
        .findOne({ username: recipientUsername });

    if (!recipient) {
        res.status(400).send('Recipient does not exist!');
        return;
    }

    // Add sender to recipient's list of friend requests
    await req.db
        .collection('Users')
        .updateOne(
            { username: recipientUsername },
            { $addToSet: { friendRequests: senderUsername } }
        );

    res.status(200).send();
});

export default handler;
