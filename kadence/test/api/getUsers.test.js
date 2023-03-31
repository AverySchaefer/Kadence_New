import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/users/getUsers'; // TODO: change this to import the desired handler!
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
            .insertOne({ _id: '1', username: "JohnDoe", password: "passw0rd" });
    });

    afterAll(async () => {
        await teardownTestDB(mongoServer, client);
    });

    it('should respond with 200 status code if user is retrieved', async () => {
        await testApiHandler({
            handler,
            url: `/users/getUsers?username=${correctUsername}`, // TODO: change this to the route path!
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(200);
                //await expect(res.json()).resolves.toStrictEqual({}); // TODO: change this object to the expected response!
            },
        });
    });

    it('should respond with 400 status code if user is not in database', async () => {
        await testApiHandler({
            handler,
            url: `/users/getUsers?username=${emptyUsername}`, // TODO: change this to the route path!
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({}); // TODO: change this object to the expected response!
            },
        });
    });

    it('should respond with 400 status code if no username is sent', async () => {
        await testApiHandler({
            handler,
            url: `/users/getUsers?username=${incorrectUsername}`, // TODO: change this to the route path!
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({}); // TODO: change this object to the expected response!
            },
        });
    });
});