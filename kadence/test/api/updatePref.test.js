import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/preferences/update';
import { initTestDB, teardownTestDB } from './testDB';
import { ObjectId } from 'mongodb';

describe('PATCH /preferences/update', () => {
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

    it('should respond with 200 status code if valid', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        uid: new ObjectId('63efd818545984788a2b0242'),
                        allowExplicit: true,
                        lyricalInstrumental: 'Both',
                        lyricalLanguage: 'English',
                        minSongLength: 1,
                        maxSongLength: 20,
                        minPlaylistLength: 1,
                        maxPlaylistLength: 100,
                        faveGenres: ['rock', 'alternative', 'metal'],
                        faveArtists: ['radiohead', 'tool', 'king crimson'],
                        blacklistedArtists: ['oasis', 'genesis'],
                        blacklistedSongs: ['wonderwall'],
                    }),
                });
                console.log(res);
                expect(res.status).toStrictEqual(200);
            },
        });
    });

    it('should respond with 400 status code if no username', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'PATCH',
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
                        faveArtists: ['radiohead', 'tool', 'king crimson'],
                        blacklistedArtists: ['oasis', 'genesis'],
                        blacklistedSongs: ['wonderwall'],
                    }),
                });
                expect(res.status).toStrictEqual(400);
            },
        });
    });

    it("should respond with 400 status code if account can't be found", async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        uid: new ObjectId('63efd818545984788a2b0247'),
                        allowExplicit: true,
                        lyricalInstrumental: 'Both',
                        lyricalLanguage: 'English',
                        minSongLength: 1,
                        maxSongLength: 20,
                        minPlaylistLength: 1,
                        maxPlaylistLength: 100,
                        faveGenres: ['rock', 'alternative', 'metal'],
                        faveArtists: ['radiohead', 'tool', 'king crimson'],
                        blacklistedArtists: ['oasis', 'genesis'],
                        blacklistedSongs: ['wonderwall'],
                    }),
                });

                expect(res.status).toStrictEqual(400);
            },
        });
    });
});
