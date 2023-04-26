import { ObjectId } from 'mongodb';
import playlistScreening from '@/lib/generation/playlistScreening';

const prefData = {
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
    blacklistedSongs: ['wonderwall']
};

const songItemsWithBlacklist = [{ explicit: false, name: 'wonderwall', artists: ['oasis']}, {explicit: false, name: '15 step', artists: ['radiohead']}];
const songItemsNoBlacklist = [{explicit: false, name: '15 step', artists: ['radiohead']}];

it('should remove nothing', () => {
    expect(playlistScreening(songItemsNoBlacklist, prefData)).toEqual(songItemsNoBlacklist);
});

it('should remove a blacklisted song', () => {
    expect(playlistScreening(songItemsWithBlacklist, prefData)).toEqual(songItemsNoBlacklist);
});

it('should remove a blacklisted artist', () => {
    expect(playlistScreening(songItemsWithBlacklist, prefData)).toEqual(songItemsNoBlacklist);
});