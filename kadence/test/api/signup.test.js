import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/users/signup'; // TODO: change this to import the desired handler!
import { initTestDB, teardownTestDB } from './testDB';

describe('POST /users/signup', () => {
    let mongoServer;
    let client;
    let db;
    beforeAll(async () => {
        ({ mongoServer, client, db } = await initTestDB(handler));
        await db
            .collection('Users')
            .insertOne({ _id: '1', email: "you@aol.com", username: "JaneDoe", password: "passw0rd" });
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
                        email: 'me@aol.com',
                        username: 'JohnDoe',
                        password: 'password',
                        confirmedPassword: 'password',
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(200);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });

    it('should respond with 400 status code if email is blank', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        //email: 'me@aol.com',
                        username: 'JohnDoe',
                        password: 'password',
                        confirmedPassword: 'password',
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });

    it('should respond with 400 status code if password is blank', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'me@aol.com',
                        username: 'JohnDoe',
                        //password: 'password',
                        confirmedPassword: 'password',
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });

    it('should respond with 400 status code if email is invalid', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'meaol.com',
                        username: 'JohnDoe',
                        password: 'password',
                        confirmedPassword: 'password',
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });

    it('should respond with 400 status code if passwords don\'t match', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'me@aol.com',
                        username: 'JohnDoe',
                        password: 'password',
                        confirmedPassword: 'passw0rd',
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });

    it('should respond with 400 status code if username is taken', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'me@aol.com',
                        username: 'JaneDoe',
                        password: 'password',
                        confirmedPassword: 'password',
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });

    it('should respond with 400 status code if email is taken', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'you@aol.com',
                        username: 'JohnDoe',
                        password: 'password',
                        confirmedPassword: 'password',
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });
});