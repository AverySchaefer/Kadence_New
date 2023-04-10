import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../../pages/api/devices/insert';
import { initTestDB, teardownTestDB } from '../testDB';

describe('POST /devices/insert', () => {
    let mongoServer;
    let client;
    let db;
    beforeAll(async () => {
        ({ mongoServer, client, db } = await initTestDB(handler));
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
                        deviceList: [],
                        selectedDeviceName: 'my watch',
                        selectedDeviceID: '12345',
                        tracking: true,
                    }),
                });

                expect(res.status).toStrictEqual(200);
            },
        });
    });
});
