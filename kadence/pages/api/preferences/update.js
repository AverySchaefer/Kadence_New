import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
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
        blacklistedSongs: req.body.blacklistedSongs
    };

    if (req.body.uid == null) {
        console.log("No UID sent in request");
        res.status(400).send();
    }

    const result = await req.db.collection('Preferences').updateOne(filter, doc, options);
    //console.log("A document with the ID: ${result.insertedID} has been updated");
    //res.json(doc);
    if (result.acknowledged == false) {
        console.log("Request not acknowledged by database");
        res.status(500).send();
    } else if (result.modifiedCount < 1) {
        console.log("Document could not be located");
        res.status(400).send();
    } else {
        console.log("Preference Document Updated");
        res.status(200).send();
    }
})

export default handler;