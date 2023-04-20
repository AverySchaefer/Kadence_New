import nextConnect from 'next-connect';
import middleware from '@/middleware/database';
import { ObjectId } from 'mongodb';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const { username, songName } = req.body;

    const user = await req.db.collection('Users').findOne({ username });

    if (!user) {
        res.status(400).send('User does not exist!');
        return;
    }

    await req.db.collection('Preferences').updateOne(
        { _id: new ObjectId(user.musicPrefs) },
        {
            $addToSet: { blacklistedSongs: songName },
        }
    );

    res.status(200).send();
});

export default handler;
