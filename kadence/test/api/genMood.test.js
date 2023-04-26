import { testApiHandler } from 'next-test-api-route-handler';
import handler from '@/pages/api/generation/interval';

describe('GET /api/generation/interval', () => {
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

                expect(res.status).toStrictEqual(200);
            },
        });
    })
})