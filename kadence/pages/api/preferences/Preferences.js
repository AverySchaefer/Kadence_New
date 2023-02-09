import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    let doc = await req.db.collection('Preferences').findOne()
    //console.log(doc);
    res.json(doc);
});

handler.post(async (req, res) => {
    const doc = {
        allowExplicit: req.allowExplicit,
        lyricalInstrumental: req.lyricalInstrumental,
        lyricalLanguage: req.lyricalLanguage,
        minSongLength: req.minSongLength,
        maxSongLength: req.maxSongLength,
        minPlaylistLength: req.minPlaylistLength,
        maxPlaylistLength: req.maxPlaylistLength,
        faveGenres: req.faveGenres,
        faveArtists: req.faveArtists,
        blacklistedArtists: req.blacklistedArtists,
        blacklistedSongs: req.blacklistedSongs
    }

    const result = await req.db.collection('Preferences').insertOne(doc);
    console.log("A document with the ID: ${result.insertedID} has been added");
    res.json(doc);
})

export default handler;