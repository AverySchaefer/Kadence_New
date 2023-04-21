import { testApiHandler } from 'next-test-api-route-handler';
import handler from '@/pages/api/music/insert';
import { initTestDB, teardownTestDB } from '@/test/testDB';

describe('POST /music/insert', () => {
    let mongoServer;
    let client;
    beforeAll(async () => {
        ({ mongoServer, client } = await initTestDB(handler));
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
                        spotifyAccountID: '12345',
                        appleMusicAccountID: '67890',
                    }),
                });

                expect(res.status).toStrictEqual(200);
            },
        });
    });
});
