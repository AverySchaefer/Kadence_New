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

    const user = await req.db
        .collection('Users')
        .findOne({ username: req.query.username });

    if (!user) {
        console.log('No User found');
        res.status(400).send('No User found');
        return;
    }

    const alwaysAvailableData = {
        username: user.username,
        bio: user.bio,
        profilePic: user.profilePic,
        private: user.private,
        favoriteAlbum: user.favoriteAlbum,
        favoriteArtist: user.favoriteArtist,
        favoriteSong: user.favoriteSong,
    };

    if (user.private) {
        console.log('Sending private user');
        res.status(200).json(alwaysAvailableData);
    } else {
        console.log('Sending public user');
        res.status(200).json({
            ...alwaysAvailableData,
            musicPlatform: user.musicPlatform,
            // Other private information (device?)
        });
    }
});

export default handler;
