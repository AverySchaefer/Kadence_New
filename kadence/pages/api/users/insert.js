import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const doc = {
        uid: req.body.uid,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        bio: req.body.bio,
        profilePic: req.body.profilePic,
        private: req.body.private,
        devices: req.body.devices,
        selectedDevice: req.body.selectedDevice,
        musicPlatforms: req.body.musicPlatforms,
        selectedMusic: req.body.selectedMusic,
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

    if (req.body.uid == null) {
        console.log('No UID sent in request');
        res.status(400).send();
        return;
    }

    const result = await req.db.collection('Users').insertOne(doc);
    //console.log("A document with the ID: ${result.insertedID} has been added");
    //res.json(doc);
    if (result.acknowledged == false) {
        console.log('Request not acknowledged by database');
        res.status(500).send();
    } else {
        console.log('Account Updated');
        res.status(200).send();
    }
});

export default handler;
