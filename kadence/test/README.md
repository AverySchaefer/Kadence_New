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

### next-test-api-route-handler
This package mainly revolves around the `testApiHandler` function, which takes in the following: 
- the API handler you're testing
- optional `requestPatcher` and `responsePatcher` functions, which allow you to add or override properties on the `req` and `res` objects before they get passed to your handler. Useful for adding stuff like tokens to the request headers.
- optional `url` string which is used to pass in GET query parameters
- a `test` function, which is where you fetch from the endpoint and then perform your test assertions

#### GET request example:
```javascript
await testApiHandler({
    handler,
    url: `/path/to/route?query=abc&another_param=def`, // TODO: change this to the route path!
    test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' });
        expect(res.status).toStrictEqual(200);
        await expect(res.json()).resolves.toStrictEqual({ id: 'blahblahblah', otherStuff: 'blahblah' });
    },
});
```

#### POST request example:
```javascript
await testApiHandler({
    handler,
    requestPatcher: (req) => (req.headers = { key: process.env.SPECIAL_TOKEN }),
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'POST', body: 'data' });
      await expect(res.json()).resolves.toStrictEqual({ hello: 'world' });
    }
});
```

### testDB.js
All we're doing here is creating an in-memory MongoDB server, and then overriding the middleware function of the passed in API handler, so that `req.db` gets assigned with our test database instead of the normal one.
