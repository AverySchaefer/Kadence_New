import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/devices/delete'; // TODO: change this to import the desired handler!
import { initTestDB, teardownTestDB } from './testDB';
import { ObjectId } from 'mongodb';

describe('DELETE /devices/delete', () => {
    let mongoServer;
    let client;
    let db;
    beforeAll(async () => {
        ({ mongoServer, client, db } = await initTestDB(handler));
        await db
            .collection('Devices')
            .insertOne({
                _id: new ObjectId('63efd818545984788a2b0242'), 
                deviceList: [],
                selectedDeviceName: 'my watch',
                selectedDeviceID: '12345',
                tracking: true,
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
                    method: 'DELETE',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        _id: new ObjectId('63efd818545984788a2b0242'),
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(200);
                //await expect(res.json()).resolves.toStrictEqual({});
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
                //console.log(res.status);
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });
});