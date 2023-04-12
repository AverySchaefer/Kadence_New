import { testApiHandler } from 'next-test-api-route-handler';
import handler from '@/pages/api/preferences/getPreferences';
import { initTestDB, teardownTestDB } from '@/test/testDB';
import { ObjectId } from 'mongodb';

describe('GET /api/preferences/getPreferences', () => {
    const correctId = new ObjectId('63efd818545984788a2b0242');
    const incorrectId = new ObjectId('63efd818545984788a2b0247');
    const emptyId = '';
    let mongoServer;
    let client;
    let db;
    beforeAll(async () => {
        ({ mongoServer, client, db } = await initTestDB(handler));
        await db.collection('Preferences').insertOne({
            _id: new ObjectId('63efd818545984788a2b0242'),
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
        });
    });

    afterAll(async () => {
        await teardownTestDB(mongoServer, client);
    });

    it('should respond with 200 status code if doc is retrieved', async () => {
        await testApiHandler({
            handler,
            url: `/users/getUsers?_id=${correctId}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });

                expect(res.status).toStrictEqual(200);
            },
        });
    });

    it('should respond with 400 status code if doc is not in database', async () => {
        await testApiHandler({
            handler,
            url: `/users/getUsers?_id=${incorrectId}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(400);
            },
        });
    });

    it('should respond with 400 status code if no _id is sent', async () => {
        await testApiHandler({
            handler,
            url: `/users/getUsers?_id=${emptyId}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(400);
            },
        });
    });
});
