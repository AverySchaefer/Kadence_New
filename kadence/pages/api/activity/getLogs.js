import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();
handler.use(middleware);

function compareLogs(a, b) {
    if (Date.parse(a.timestamp) === Date.parse(b.timestamp)) {
        return 0;
    }
    if (Date.parse(a.timestamp) > Date.parse(b.timestamp)) {
        return -1;
    }
    return 1;
}

handler.get(async (req, res) => {
    if (!req.query.username) {
        console.log('No username sent in request');
        res.status(400).send('No username sent in request');
        return;
    }

    /* Getting the activity log of the user */
    const userLogResults = await req.db
        .collection('Activities')
        .find({ username: req.query.username })
        .project({ _id: 0 });
    if (!userLogResults) {
        console.log('User logs could not be found');
        res.status(400).send('User logs could not be found');
    } else {
        const totalLogs = [];
        await userLogResults.forEach((log) => totalLogs.push(log));
        totalLogs.sort(compareLogs);
        res.status(200).json(totalLogs);
    }
});

export default handler;
