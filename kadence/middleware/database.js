import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';
import { MongoMemoryServer } from 'mongodb-memory-server';

async function database(req, res, next) {
    const client = new MongoClient(
        'mongodb+srv://root:qVjKct8wfAeCnwOq@kadenceinstance1.lsepn.mongodb.net/?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );

    await client.connect();
    req.dbClient = client;
    req.db = client.db('kadenceDatabase');
    return next();
}

async function testDatabase(req, res, next) {
    const mongod = await MongoMemoryServer.create();
    const client = new MongoClient(mongod.getUri(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    req.dbClient = client;
    req.db = client.db('kadenceDatabase');
    return next();
}

const middleware = nextConnect();

middleware.use(process.env.NODE_ENV === 'test' ? testDatabase : database);

export default middleware;
