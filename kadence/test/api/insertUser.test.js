import { testApiHandler } from 'next-test-api-route-handler';
import handler from '@/pages/api/users/insert';
import { initTestDB, teardownTestDB } from '@/test/testDB';

describe('POST /users/insert', () => {
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
                        username: 'JohnDoe',
                        email: 'me@aol.com',
                        password: 'password',
                        bio: 'yo',
                        profilePic: '',
                        private: true,
                        devices: [],
                        musicPlatform: '',
                        musicPrefs: [],
                        waitToSave: true,
                        intervalShort: 1,
                        intervalLong: 100,
                        rampUpTime: 5,
                        rampDownTime: 5,
                        mood: 'happy',
                        zipCode: '47906',
                        friendRequests: [],
                        friends: [],
                        actions: [],
                    }),
                });

                expect(res.status).toStrictEqual(200);
            },
        });
    });

    it('should respond with 400 status code if no username', async () => {
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
                        password: 'password',
                        bio: 'yo',
                        profilePic: '',
                        private: true,
                        devices: [],
                        musicPlatform: '',
                        musicPrefs: [],
                        waitToSave: true,
                        intervalShort: 1,
                        intervalLong: 100,
                        rampUpTime: 5,
                        rampDownTime: 5,
                        mood: 'happy',
                        zipCode: '47906',
                        friendRequests: [],
                        friends: [],
                        actions: [],
                    }),
                });

                expect(res.status).toStrictEqual(400);
            },
        });
    });
});
