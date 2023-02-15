import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const query = { uid: req.body.uid };
    if (req.body.uid == null) {
      console.log("No UID sent in request");
      res.status(400).send();
    }
    const result = await req.db.collection('Preferences').deleteOne(query);
    /*if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }
    res.json(doc);*/
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
      res.status(200).json(doc).send();
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
      res.status(400).json(doc).send();
    }
})

export default handler;