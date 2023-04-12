import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/preferences/getPreferences'; // TODO: change this to import the desired handler!
import { initTestDB, teardownTestDB } from './testDB';
import { ObjectId } from 'mongodb';

describe('GET /api/preferences/getPreferences', () => {
    const correct_id = new ObjectId('63efd818545984788a2b0242');
    const incorrect_id = new ObjectId('63efd818545984788a2b0247');
    const empty_id = '';
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

    it('should respond with 200 status code if doc is retrieved', async () => {
        await testApiHandler({
            handler,
            url: `/users/getUsers?_id=${correct_id}`, // TODO: change this to the route path!
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                //console.log(res.status);
                expect(res.status).toStrictEqual(200);
                //await expect(res.json()).resolves.toStrictEqual({}); // TODO: change this object to the expected response!
            },
        });
    });

    it('should respond with 400 status code if doc is not in database', async () => {
        await testApiHandler({
            handler,
            url: `/users/getUsers?_id=${incorrect_id}`, // TODO: change this to the route path!
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({}); // TODO: change this object to the expected response!
            },
        });
    });

    it('should respond with 400 status code if no _id is sent', async () => {
        await testApiHandler({
            handler,
            url: `/users/getUsers?_id=${empty_id}`, // TODO: change this to the route path!
            test: async ({ fetch }) => {
                const res = await fetch({
                    method: 'GET',
                });
                expect(res.status).toStrictEqual(400);
                //await expect(res.json()).resolves.toStrictEqual({}); // TODO: change this object to the expected response!
            },
        });
    });
});