import generateIntervalParams from '@/lib/generation/generateIntervalParams';
import generateFitnessParams from '@/lib/generation/generateFitnessParams';
import generateLocalParams from '@/lib/generation/generateLocalParams';
import generateMoodParams from '@/lib/generation/generateMoodParams';
import { ObjectId } from 'mongodb';

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

it('should return high interval params', () => {
    expect(generateIntervalParams(prefData, '1').get("target_danceability")).toBe('0.65');
});

it('should return low interval params', () => {
    expect(generateIntervalParams(prefData, '0').get("target_danceability")).toBe('0.25');
});

it('should return local params', () => {
    console.log(generateLocalParams('seed', prefData));
    expect(generateLocalParams('seed', prefData).get("max_popularity")).toBe('20');
    expect(generateLocalParams('seed', prefData).get("seed_tracks")).toBe('seed');
});

it('should return happy params', () => {
    expect(generateMoodParams(prefData, 'happy').get("target_danceability")).toBe('0.65');
});

it('should return sad params', () => {
    expect(generateMoodParams(prefData, 'sad').get("target_energy")).toBe('0.25');
});

it('should return fitness params', () => {
    expect(generateFitnessParams(prefData, 80).get("target_tempo")).toBe('80');
});
