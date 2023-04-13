import { testApiHandler } from 'next-test-api-route-handler';
import handler from '@/pages/api/preferences/insert';
import { initTestDB, teardownTestDB } from '@/test/testDB';

describe('POST /preferences/insert', () => {
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

                expect(res.status).toStrictEqual(200);
            },
        });
    });
});
