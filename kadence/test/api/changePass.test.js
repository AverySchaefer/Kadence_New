import { testApiHandler } from 'next-test-api-route-handler';
import { serverSideHash } from '@/lib/passwordUtils';
import handler from '../../pages/api/users/changePass';
import { initTestDB, teardownTestDB } from '../testDB';

describe('POST /users/changePass', () => {
    let mongoServer;
    let client;
    let db;
    beforeAll(async () => {
        ({ mongoServer, client, db } = await initTestDB(handler));
        await db.collection('Users').insertOne({
            _id: '1',
            username: 'JohnDoe',
            password: await serverSideHash('passw0rd'),
        });
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
                expect(res.status).toStrictEqual(400);
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
                expect(res.status).toStrictEqual(400);
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
                expect(res.status).toStrictEqual(400);
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
                expect(res.status).toStrictEqual(400);
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
                expect(res.status).toStrictEqual(200);
            },
        });
    });
});
