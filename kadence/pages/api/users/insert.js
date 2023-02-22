import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const doc = {
        username: req.body.username,
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
        favoriteArtists: req.body.favoriteArtists,
        favoriteSong: req.body.favoriteSong,
        favoriteAlbum: req.body.favoriteAlbum,
    };

    if (!req.body.username) {
        console.log('No username sent in request');
        res.status(400).send('No username sent in request');
        return;
    }

    const result = await req.db.collection('Users').insertOne(doc);
    if (result.acknowledged === false) {
        console.log('Request not acknowledged by database');
        res.status(500).send('Request not acknowledged by database');
    } else {
        console.log('Account Created');
        res.status(200).send();
    }
});

export default handler;
