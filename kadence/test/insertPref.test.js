import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/preferences/insert'; // TODO: change this to import the desired handler!
import { initTestDB, teardownTestDB } from './testDB';

describe('POST /preferences/insert', () => {
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
                        allowExplicit: true,
                        lyricalInstrumental: 'Both',
                        lyricalLanguage: 'English',
                        minSongLength: 1,
                        maxSongLength: 20,
                        minPlaylistLength: 1,
                        maxPlaylistLength: 100,
                        faveGenres: ['rock', 'alternative', 'metal'],
                        faveArtists: ['radiohead', 'tool'],
                        blacklistedArtists: ['oasis', 'genesis'],
                        blacklistedSongs: ['wonderwall'],
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(200);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });
});