import { testApiHandler } from 'next-test-api-route-handler';
import handler from '@/pages/api/users/search';
import { initTestDB, teardownTestDB } from '@/test/testDB';

describe('GET /api/users/getUsers', () => {
    let mongoServer;
    let client;
    let db;
    beforeAll(async () => {
        ({ mongoServer, client, db } = await initTestDB(handler));
        await db.collection('Users').insertMany([
            { _id: '1', username: 'JohnDoe', profilePic: 'john' },
            { _id: '2', username: 'Colston', profilePic: 'colston tired' },
            { _id: '3', username: 'ColstonStreit', profilePic: null },
        ]);
    });

    afterAll(async () => {
        await teardownTestDB(mongoServer, client);
    });

    it('should respond with 200 status code and users that match (multiple)', async () => {
        await testApiHandler({
            handler,
            url: `/users/search?username=${'Cols'}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(200);
                await expect(res.json()).resolves.toStrictEqual({
                    results: [
                        { username: 'Colston', profilePic: 'colston tired' },
                        { username: 'ColstonStreit', profilePic: null },
                    ],
                });
            },
        });
    });

    it('should respond with 200 status code and users that match (single)', async () => {
        await testApiHandler({
            handler,
            url: `/users/search?username=${'John'}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(200);
                await expect(res.json()).resolves.toStrictEqual({
                    results: [{ username: 'JohnDoe', profilePic: 'john' }],
                });
            },
        });
    });

    it('should respond with 200 status code even with no results', async () => {
        await testApiHandler({
            handler,
            url: `/users/search?username=${'ThisWillNotMatchAnyone'}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(200);
                await expect(res.json()).resolves.toStrictEqual({
                    results: [],
                });
            },
        });
    });

    it('should respond with 400 status code if no username given', async () => {
        await testApiHandler({
            handler,
            url: `/users/search`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(400);
            },
        });
    });
});
