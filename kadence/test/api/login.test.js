import { testApiHandler } from 'next-test-api-route-handler';
import { hash } from 'bcryptjs';
import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import handler from '@/pages/api/users/login';
import { initTestDB, teardownTestDB } from '@/test/testDB';

describe('GET /api/users/login', () => {
    const username = 'JohnDoe';
    const password = 'passw0rd';
    let mongoServer;
    let client;
    let db;
    beforeAll(async () => {
        ({ mongoServer, client, db } = await initTestDB(handler));

        const saltedPassword = await hash(password, 10);

        await db
            .collection('Users')
            .insertOne({ _id: '1', username, password: saltedPassword });
    });

    afterAll(async () => {
        await teardownTestDB(mongoServer, client);
    });

    it('should respond with 200 status code if correct username and password are provided', async () => {
        const jwtSpy = jest.spyOn(jwt, 'sign').mockReturnValueOnce('abc');

        await testApiHandler({
            handler,
            url: `/users/login?username=${username}&enteredPW=${password}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                const { serverRuntimeConfig } = getConfig();
                expect(jwtSpy).toHaveBeenCalledWith(
                    { sub: username },
                    serverRuntimeConfig.secret,
                    { expiresIn: '7d' }
                );

                expect(res.status).toStrictEqual(200);
                await expect(res.json()).resolves.toEqual({
                    username,
                    token: 'abc',
                });
            },
        });
    });

    it('should respond with 400 status code if no username is provided in request', async () => {
        await testApiHandler({
            handler,
            url: `/users/login?&enteredPW=${password}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(400);
            },
        });
    });

    it('should respond with 400 status code if no password is provided in request', async () => {
        await testApiHandler({
            handler,
            url: `/users/login?&username=${username}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(400);
            },
        });
    });

    it('should respond with 400 status code if account could not be located', async () => {
        const nonexistingUser = 'idontexist';
        const nonexistingPassword = '123';
        await testApiHandler({
            handler,
            url: `/users/login?&username=${nonexistingUser}&enteredPW=${nonexistingPassword}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(400);
                await expect(res.text()).resolves.toStrictEqual(
                    'Login unsuccessful, account could not be located'
                );
            },
        });
    });

    it('should respond with 401 status code if password is incorrect', async () => {
        const wrongPassword = '123';
        await testApiHandler({
            handler,
            url: `/users/login?&username=${username}&enteredPW=${wrongPassword}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(401);
                await expect(res.text()).resolves.toStrictEqual(
                    'Login unsuccessful, password incorrect'
                );
            },
        });
    });
});
