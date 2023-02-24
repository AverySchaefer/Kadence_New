import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/music/insert'; // TODO: change this to import the desired handler!
import { initTestDB, teardownTestDB } from './testDB';

describe('POST /music/insert', () => {
    let mongoServer;
    let client;
    let db;
    beforeAll(async () => {
        ({ mongoServer, client, db } = await initTestDB(handler));
    });

    afterAll(async () => {
        await teardownTestDB(mongoServer, client);
    });

    it('should respond with 200 status code if valid', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        //_id: new ObjectId('63efd818545984788a2b0242'), 
                        spotifyAccountID: '12345',
                        appleMusicAccountID: '67890',
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(200);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });
});