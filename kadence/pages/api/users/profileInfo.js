import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    const { viewerUsername, vieweeUsername } = req.query;

    if (!viewerUsername) {
        res.status(400).send('No username sent in request');
        return;
    }

    if (!vieweeUsername) {
        res.status(400).send('No profile owner username sent in request');
        return;
    }

    const viewer = await req.db
        .collection('Users')
        .findOne({ username: viewerUsername });

    const viewee = await req.db
        .collection('Users')
        .findOne({ username: vieweeUsername });

    if (!viewer || !viewee) {
        res.status(400).send('Users not found');
        return;
    }

    const isFriend = viewer.friends.includes(vieweeUsername);
    const isPendingFriend = viewee.friendRequests.includes(viewerUsername);
    const wasSentRequest = viewer.friendRequests.includes(vieweeUsername);

    const alwaysAvailableData = {
        username: viewee.username,
        bio: viewee.bio,
        profilePic: viewee.profilePic,
        private: viewee.private,
        favoriteAlbum: viewee.favoriteAlbum,
        favoriteArtist: viewee.favoriteArtist,
        favoriteSong: viewee.favoriteSong,
        isFriend,
        isPendingFriend,
        wasSentRequest,
    };

    if (viewee.private && !isFriend) {
        console.log('Sending private user');
        res.status(200).json(alwaysAvailableData);
    } else {
        console.log('Sending public user');
        res.status(200).json({
            ...alwaysAvailableData,
            musicPlatform: viewee.musicPlatform,
            // Other private information (device? activity log?)
        });
    }
});

export default handler;
