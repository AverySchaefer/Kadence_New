import { testApiHandler } from 'next-test-api-route-handler';
import handler from '@/pages/api/music/getPlatform';
import { initTestDB, teardownTestDB } from '@/test/testDB';
import { ObjectId } from 'mongodb';

describe('GET /api/music/getPlatform', () => {
    const correctId = new ObjectId('63efd818545984788a2b0242');
    const incorrectId = new ObjectId('63efd818545984788a2b0247');
    const emptyId = '';
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

    it('should respond with 200 status code if doc is retrieved', async () => {
        await testApiHandler({
            handler,
            url: `/users/getUsers?_id=${correctId}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });

                expect(res.status).toStrictEqual(200);
            },
        });
    });

    it('should respond with 400 status code if doc is not in database', async () => {
        await testApiHandler({
            handler,
            url: `/users/getUsers?_id=${incorrectId}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(400);
            },
        });
    });

    it('should respond with 400 status code if no _id is sent', async () => {
        await testApiHandler({
            handler,
            url: `/users/getUsers?_id=${emptyId}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(400);
            },
        });
    });
});
