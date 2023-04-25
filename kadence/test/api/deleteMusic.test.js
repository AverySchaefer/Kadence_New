import { testApiHandler } from 'next-test-api-route-handler';
import handler from '@/pages/api/music/delete';
import { initTestDB, teardownTestDB } from '@/test/testDB';
import { ObjectId } from 'mongodb';

describe('DELETE /music/delete', () => {
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

    it('should respond with 400 status code if no matching doc was found', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'DELETE',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        _id: new ObjectId('63efd818545984788a2b0247'),
                    }),
                });

                expect(res.status).toStrictEqual(400);
            },
        });
    });

    it('should respond with 200 status code if valid', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'DELETE',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        _id: new ObjectId('63efd818545984788a2b0242'),
                    }),
                });

                expect(res.status).toStrictEqual(200);
            },
        });
    });

    it('should respond with 400 status code if no _id is provided', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'DELETE',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        _id: '',
                    }),
                });

                expect(res.status).toStrictEqual(400);
            },
        });
    });
});
