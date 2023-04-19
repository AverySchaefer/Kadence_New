import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();
handler.use(middleware);

function compareLogs(a, b) {
    return Date.parse(a.timestamp) > Date.parse(b.timestamp);
}

handler.get(async (req, res) => {
    /* Getting the record of the user from the database */
    if (!req.query.username) {
        console.log('No username sent in request');
        res.status(400).send('No username sent in request');
        return;
    }

    const user = await req.db
        .collection('Users')
        .findOne({ username: req.query.username });
    if (!user) {
        console.log('User could not be found');
        res.status(400).send('User could not be found');
    }

    /* Finding the user's friends */
    const friendList = user.friends;
    
    /* Getting the activity log of the user */
    const userLogResults = await req.db
        .collection('Activities')
        .find({ username: req.query.username })
        .limit(20)
        .project({ _id: 0 });
    if (!userLogResults) {
        console.log('User logs could not be found');
        res.status(400).send('User logs could not be found');
    }

    /* Getting the activity log of each of the friends */
    const totalFriendResults = await req.db
        .collection('Activities')
        .find({ username: { $in: friendList } })
        .limit(50)
        .project({ _id: 0 });
    if (!totalFriendResults) {
        console.log('Friend logs could not be found');
        res.status(400).send('Friend logs could not be found');
    }

    const totalLogs = [];
    await userLogResults.forEach((log) => totalLogs.push(log));
    await totalFriendResults.forEach((log) => totalLogs.push(log));
    totalLogs.sort(compareLogs);
    res.status(200).json(totalLogs);
});

export default handler;