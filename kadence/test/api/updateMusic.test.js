import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/music/update';
import { initTestDB, teardownTestDB } from './testDB';
import { ObjectId } from 'mongodb';

describe('PATCH /music/update', () => {
    let mongoServer;
    let client;
    let db;
    beforeAll(async () => {
        ({ mongoServer, client, db } = await initTestDB(handler));
        await db.collection('Music').insertOne({
            _id: new ObjectId('63efd818545984788a2b0242'),
            spotifyAccountID: '12345',
            appleMusicAccountID: '67890',
        });
    });

    afterAll(async () => {
        await teardownTestDB(mongoServer, client);
    });

    it('should respond with 200 status code if valid', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        uid: new ObjectId('63efd818545984788a2b0242'),
                        spotifyAccountID: '12345',
                        appleMusicAccountID: '12345',
                    }),
                });
                console.log(res);
                expect(res.status).toStrictEqual(200);
            },
        });
    });

    it('should respond with 400 status code if no uid', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        uid: '',
                        spotifyAccountID: '12345',
                        appleMusicAccountID: '12345',
                    }),
                });
                expect(res.status).toStrictEqual(400);
            },
        });
    });

    it("should respond with 400 status code if doc can't be found", async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        uid: new ObjectId('63efd818545984788a2b0247'),
                        spotifyAccountID: '12345',
                        appleMusicAccountID: '12345',
                    }),
                });

                expect(res.status).toStrictEqual(400);
            },
        });
    });
});
