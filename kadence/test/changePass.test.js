import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/users/changePass'; // TODO: change this to import the desired handler!
import { initTestDB, teardownTestDB } from './testDB';

describe('POST /users/changePass', () => {
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

    it('should respond with 400 status code if passwords are the same', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: 'JohnDoe',
                        oldPassword: 'passw0rd',
                        newPassword: 'passw0rd',
                        newConfirmedPassword: 'passw0rd',
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });

    it('should respond with 400 status code if new confirmed password is blank', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: 'JohnDoe',
                        oldPassword: 'passw0rd',
                        newPassword: 'password',
                        newConfirmedPassword: null,
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });

    it('should respond with 400 status code if new password is blank', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: 'JohnDoe',
                        oldPassword: 'passw0rd',
                        newPassword: null,
                        newConfirmedPassword: 'password',
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });

    it('should respond with 400 status code if new password is blank', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: 'IHaveABadName',
                        oldPassword: 'passw0rd',
                        newPassword: 'password',
                        newConfirmedPassword: 'password',
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
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
                        username: 'JohnDoe',
                        oldPassword: 'passw0rd',
                        newPassword: 'password',
                        newConfirmedPassword: 'password',
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(200);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });
});