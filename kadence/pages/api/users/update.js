import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.patch(async (req, res) => {
    if (!req.body.username) {
        console.log('No username sent in request');
        res.status(400).send('No username sent in request');
        return;
    }

    const filter = { username: req.body.username };
    const options = { upsert: true };
    const doc = {
        email: req.body.email,
        password: req.body.password,
        bio: req.body.bio,
        profilePic: req.body.profilePic,
        private: req.body.private,
        devices: req.body.devices,
        musicPlatforms: req.body.musicPlatforms,
        musicPrefs: req.body.musicPrefs,
        waitToSave: req.body.waitToSave,
        intervalShort: req.body.intervalShort,
        intervalLong: req.body.intervalLong,
        rampUpTime: req.body.rampUpTime,
        rampDownTime: req.body.rampDownTime,
        mood: req.body.mood,
        zipCode: req.body.zipCode,
        friendRequests: req.body.friendRequests,
        friends: req.body.friends,
        actions: req.body.actions,
    };
    for (const field in doc) {
        if (doc[field] === undefined) delete doc[field];
    }

    const result = await req.db
        .collection('Users')
        .updateOne(filter, { $set: doc }, options);

    if (result.acknowledged == false) {
        console.log('Request not acknowledged by database');
        res.status(500).send('Request not acknowledged by database');
    } else if (result.modifiedCount < 1 && result.matchedCount < 1) {
        console.log('Account could not be located');
        res.status(400).send('Account could not be located');
    } else {
        console.log('Account Updated');
        res.status(200).send();
    }
});

export default handler;
