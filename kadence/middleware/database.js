import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';

const client = new MongoClient('mongodb+srv://root:qVjKct8wfAeCnwOq@kadenceinstance1.lsepn.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function database(req, res, next) {
  await client.connect();
  //if (!client.isConnected()) await client.connect();
  req.dbClient = client;
  req.db = client.db('kadenceDatabase');
  return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;