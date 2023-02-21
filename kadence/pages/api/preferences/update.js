import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.patch(async (req, res) => {
    const filter = { uid: req.body.uid };
    const options = { upsert: true };
    const doc = {
        uid: req.body.uid,
        allowExplicit: req.body.allowExplicit,
        lyricalInstrumental: req.body.lyricalInstrumental,
        lyricalLanguage: req.body.lyricalLanguage,
        minSongLength: req.body.minSongLength,
        maxSongLength: req.body.maxSongLength,
        minPlaylistLength: req.body.minPlaylistLength,
        maxPlaylistLength: req.body.maxPlaylistLength,
        faveGenres: req.body.faveGenres,
        faveArtists: req.body.faveArtists,
        blacklistedArtists: req.body.blacklistedArtists,
        blacklistedSongs: req.body.blacklistedSongs,
    };

    if (!req.body.uid) {
        console.log('No UID sent in request');
        res.status(400).send('No UID sent in request');
        return;
    }

    const result = await req.db
        .collection('Preferences')
        .updateOne(filter, doc, options);

    if (result.acknowledged == false) {
        console.log('Request not acknowledged by database');
        res.status(500).send('Request not acknowledged by database');
    } else if (result.modifiedCount < 1) {
        console.log('Document could not be located');
        res.status(400).send('Document could not be located');
    } else {
        console.log('Preference Document Updated');
        res.status(200).send();
    }
});

export default handler;
