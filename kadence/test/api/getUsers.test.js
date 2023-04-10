import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/users/getUsers';
import { initTestDB, teardownTestDB } from './testDB';

describe('GET /api/users/getUsers', () => {
    const correctUsername = 'JohnDoe';
    const incorrectUsername = 'IHaveABadName';
    const emptyUsername = '';
    let mongoServer;
    let client;
    let db;
    beforeAll(async () => {
        ({ mongoServer, client, db } = await initTestDB(handler));
        await db
            .collection('Users')
            .insertOne({ _id: '1', username: 'JohnDoe', password: 'passw0rd' });
    });

    afterAll(async () => {
        await teardownTestDB(mongoServer, client);
    });

    it('should respond with 200 status code if user is retrieved', async () => {
        await testApiHandler({
            handler,
            url: `/users/getUsers?username=${correctUsername}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });

                expect(res.status).toStrictEqual(200);
            },
        });
    });

    it('should respond with 400 status code if user is not in database', async () => {
        await testApiHandler({
            handler,
            url: `/users/getUsers?username=${emptyUsername}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(400);
            },
        });
    });

    it('should respond with 400 status code if no username is sent', async () => {
        await testApiHandler({
            handler,
            url: `/users/getUsers?username=${incorrectUsername}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(400);
            },
        });
    });
});
