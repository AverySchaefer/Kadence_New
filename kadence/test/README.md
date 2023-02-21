We use Jest as our test runner:
Run all tests: `npm run test` or `npx jest`

[next-test-api-route-handler](https://github.com/Xunnamius/next-test-api-route-handler#readme) is used to emulate the way Next does API routing.

The `test/testDB.js` module takes care of setting up an [in-memory MongoDB server](https://github.com/nodkz/mongodb-memory-server#readme) and overriding the middleware handler so that all database calls point to that server. Just await `initTestDB` and pass in the `handler` under test to get your db object. For teardown, pass the mongoServer and client into `teardownTestDB`. See the template test file below.

Here's a template test file for testing API routes:

```javascript
import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/path/to/route'; // TODO: change this to import the desired handler!
import { initTestDB, teardownTestDB } from './testDB';

describe('GET /your/route/here', () => {
    let mongoServer;
    let client;
    let db;
    beforeAll(async () => {
        ({ mongoServer, client, db } = await initTestDB(handler));
    });

    afterAll(async () => {
        await teardownTestDB(mongoServer, client);
    });

    it('should respond with 200 status code if ...', async () => {
        await testApiHandler({
            handler,
            url: `/path/to/route?query=abc&another_param=def`, // TODO: change this to the route path!
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(200);
                await expect(res.json()).resolves.toStrictEqual({}); // TODO: change this object to the expected response!
            },
        });
    });
});
```
