import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    if (!req.query.username) {
        console.log('No Username sent in request');
        res.status(400).send('No Username sent in request');
        return;
    }

    // Get matching usernames
    const regex = new RegExp(`^${req.query.username}`, 'i');
    const cursor = await req.db
        .collection('Users')
        .find({ username: { $regex: regex } })
        .project({ _id: 0, username: 1, profilePic: 1, bio: 1 });

    const matches = [];
    await cursor.forEach((match) => matches.push(match));

    // Return list of usernames matching query
    res.status(200).json({ results: matches });
});

export default handler;
