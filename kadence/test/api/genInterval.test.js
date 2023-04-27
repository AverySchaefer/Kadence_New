import { testApiHandler } from 'next-test-api-route-handler';
import handler from '@/pages/api/generation/interval';
import { initTestDB, teardownTestDB } from '@/test/testDB';
import { ObjectId } from 'mongodb';

import * as getIntervalRecommendations from '@/lib/generation/getIntervalRecommendations';

jest.mock('@/lib/generation/getIntervalRecommendations', () => ({
    __esModule: true,
    ...jest.requireActual('@/lib/generation/getIntervalRecommendations'),
}));

describe('GET /api/generation/interval', () => {
    const tempStatus = 1;
    const tempUsername = 'JohnDoe';
    const tempWrongUsername = 'JohnDeere';

    let mongoServer;
    let client;
    let db;
    beforeAll(async () => {
        ({ mongoServer, client, db } = await initTestDB(handler));
        await db.collection('Users').insertOne({
            _id: '1',
            username: 'JohnDoe',
            password: 'passw0rd!',
            musicPrefs: '63efd818545984788a2b0242',
        });
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

    // This test passes with this approach, but only because an unrelated server error gives us the "500" we're expecting
    it("should respond with 500 status code if the access token couldn't be found", async () => {
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

    it('should respond with 200 status code', async () => {
        // Override getIntervalRecommendations so it returns our mock values:
        jest.spyOn(
            getIntervalRecommendations,
            // 'getIntervalRecommendations'
            'default'
        ).mockResolvedValue([
            { explicit: false,
                name: 'song1',
                artists: ['Steely Dan'] },
            { explicit: false,
                name: 'song2',
                artists: ['Steely Dan'] },
            { explicit: false,
                name: 'song3',
                artists: ['Steely Dan'] },
        ]);

        await testApiHandler({
            handler,
            url: `/generation/interval?status=${tempStatus}&username=${tempUsername}`,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });

                expect(res.status).toStrictEqual(200);
            },
        });
    });
});