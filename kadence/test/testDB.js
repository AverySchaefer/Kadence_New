import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import middleware from '../middleware/database';

export async function initTestDB(handler) {
    const mongoServer = await MongoMemoryServer.create();

    const client = new MongoClient(mongoServer.getUri(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db('kadenceTestDatabase');
    const dbFunc = (req, res, next) => {
        req.dbClient = client;
        req.db = db;
        return next();
    };

    handler.use(middleware.use(dbFunc));
    return { mongoServer, client, db };
}

export async function teardownTestDB(mongoServer, client) {
    await client.close();
    await mongoServer.stop();
}
