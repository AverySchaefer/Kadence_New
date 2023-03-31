import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/preferences/delete'; // TODO: change this to import the desired handler!
import { initTestDB, teardownTestDB } from './testDB';
import { ObjectId } from 'mongodb';

describe('DELETE /preferences/delete', () => {
    let mongoServer;
    let client;
    let db;
    beforeAll(async () => {
        ({ mongoServer, client, db } = await initTestDB(handler));
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

    it('should respond with 400 status code if no matching doc was found', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'DELETE',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        uid: new ObjectId('63efd818545984788a2b0247'),
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });

    it('should respond with 200 status code if valid', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'DELETE',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        uid: new ObjectId('63efd818545984788a2b0242'),
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(200);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });

    it('should respond with 400 status code if no UID is provided', async () => {
        await testApiHandler({
            handler,
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'DELETE',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        uid: '',
                    }),
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({});
            },
        });
    });
});