import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const doc = {
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
    }

    const result = await req.db.collection('Preferences').insertOne(doc);
    console.log("A document with the ID: ${result.insertedID} has been added");
    res.json(doc);
})

export default handler;