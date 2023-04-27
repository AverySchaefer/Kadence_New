import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const doc = {
        allowExplicit: req.body.allowExplicit,
        lyricalInstrumental: req.body.lyricalInstrumental,
        minSongLength: req.body.minSongLength,
        maxSongLength: req.body.maxSongLength,
        faveGenres: req.body.faveGenres,
        faveArtists: req.body.faveArtists,
        blacklistedArtists: [],
        blacklistedSongs: [],
    };

    const result = await req.db.collection('Preferences').insertOne(doc);
    if (result.acknowledged === false) {
        console.log('Request not acknowledged by database');
        res.status(500).send();
    } else {
        console.log('Document Created');
        res.status(200).json({ id: result.insertedId });
    }
});

export default handler;
