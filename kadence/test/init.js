import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function getTestDB() {
    const mongod = await MongoMemoryServer.create();

    const dbClient = new MongoClient(mongod.getUri(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('🚀 ~ file: init.js:11 ~ dbClient ~ dbClient', dbClient);

    const db = dbClient.db('kadenceDatabase');
    console.log('🚀 ~ file: init.js:15 ~ getTestDB ~ db', db);

    return { dbClient, db };
}

// (async function main() {
//     const mongod = await MongoMemoryServer.create();

//     dbClient = new MongoClient(mongod.getUri(), {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });

//     db = dbClient.db('kadenceDatabase');

//     return { dbClient, db };
// })();

// await seedData(client, seed, database, 'users');

// req needs db and dbClient
// function teardown() {

// }
