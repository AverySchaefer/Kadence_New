import { testApiHandler } from 'next-test-api-route-handler';
import handler from '@/pages/api/generation/interval';
import { initTestDB, teardownTestDB } from '@/test/testDB';
import { ObjectId } from 'mongodb';

describe('GET /api/generation/interval', () => {
    const tempStatus = 1;
    const tempUsername = 'JohnDoe';
    const tempWrongUsername = 'JohnDeere';

    let mongoServer;
    let client;
    let db;
    beforeAll(async () => {
        ({ mongoServer, client, db } = await initTestDB(handler));
        await db
            .collection('Users')
            .insertOne({ 
                _id: '1',
                username: 'JohnDoe',
                password: 'passw0rd!',
                musicPrefs: '63efd818545984788a2b0242'});
        await db
            .collection('Preferences')
            .insertOne({
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

    it('should respond with 500 status code if username is wrong', async () => {
        await testApiHandler({
            handler,
            url: `/generation/interval?status=${tempStatus}&username=${tempWrongUsername}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });

                expect(res.status).toStrictEqual(500);
            },
        });
    });

    it('should respond with 500 status code if the access token couldn\'t be found', async () => {
        await testApiHandler({
            handler,
            url: `/generation/interval?status=${tempStatus}&username=${tempUsername}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });

                expect(res.status).toStrictEqual(500);
            },
        });
    });
})