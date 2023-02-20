// const { createMocks } = require('node-mocks-http');
// const handler = require('../pages/api/users/login');
import getTestDB from './init';
import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/users/login';

describe('login test', () => {
    // let req;
    // let res;
    // beforeEach(() => {
    //     const { req, res } = createMocks({
    //         method: 'GET',
    //         query: {
    //             username,
    //             enteredPW: password,
    //         },
    //     });

    //     req = {
    //         query: {
    //             username: 'JohnDoe',
    //         },
    //         db: {
    //             collection: jest.fn(() => ({
    //                 findOne: jest.fn(() => ({
    //                     id: '1',
    //                     username: 'JohnDoe',
    //                     password: 'passw0rd',
    //                 })),
    //             })),
    //         },
    //     };
    //     res = {
    //         status: jest.fn().mockReturnThis(),
    //         send: jest.fn(),
    //         json: jest.fn(),
    //     };
    // });
    // let dbClient;
    // let db;
    // beforeAll(async () => {
    //     const testDB = await getTestDB();
    //     dbClient = testDB.dbClient;
    //     db = testDB.db;
    //     console.log('init db');
    // });

    it('Successful Login', async () => {
        const username = 'JohnDoe';
        const password = 'password';
        console.log('insert user');
        // await db.collection('Users').insertOne({ id: '1', username, password });

        console.log('mocks');
        const { req, res } = createMocks({
            method: 'GET',
            query: {
                username,
                enteredPW: password,
            },
        });
        // req.db = db;
        // req.dbClient = dbClient;

        // const mockReq = {
        //     query: {
        //         username: 'JohnDoe',
        //     },
        //     db: {
        //         collection: jest.fn(() => ({
        //             findOne: jest.fn(() => ({
        //                 id: '1',
        //                 username: 'JohnDoe',
        //                 password: 'passw0rd',
        //             })),
        //         })),
        //     },
        // };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        };

        // await handler(req, { ...res, ...mockRes });
        // console.log('handler');
        await handler(req, res);
        expect(res.statusCode).toBe(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            id: '1',
            username: 'JohnDoe',
            password: 'passw0rd',
        });
    });

    // it('Failed Login', async () => {
    //     const username = 'JohnDoe';
    //     const password = 'wrong';

    //     const { req, res } = createMocks({
    //         method: 'GET',
    //         query: {
    //             username,
    //             enteredPW: password,
    //         },
    //     });

    //     await handler(req, res);
    //     expect(res.statusCode).toBe(401);
    // });
});
