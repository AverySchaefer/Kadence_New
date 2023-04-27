export default function generateIntervalParams(prefData, intervalStatus) {
    /* Generate the general search parameters */
    const minSongLength = prefData.minSongLength * 1000; // convert to ms
    const maxSongLength = prefData.maxSongLength * 1000; // convert to ms
    const lyricalInstrumental = prefData.lyricalInstrumental / 100; // convert to 0-1 scale

    if (intervalStatus === '1') {
        return new URLSearchParams({
            limit: 100,
            seed_genres: `rock, ${prefData.faveGenres.join(',')}`,
            // seed_tracks: songSeedID
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            target_danceability: 0.65,
            min_energy: 0.6,
            min_tempo: 100,
            target_tempo: 120,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    return new URLSearchParams({
        limit: 100,
        seed_genres: `study, rainy-day, chill, ${prefData.faveGenres.join(
            ','
        )}`,
        target_instrumentalness: lyricalInstrumental,
        min_duration_ms: minSongLength,
        max_duration_ms: maxSongLength,
        target_danceability: 0.25,
        target_tempo: 80,
        max_energy: 0.6,
        max_tempo: 100,
        // Using this as a method for randomization
        target_popularity: Math.floor(Math.random() * 101),
    });
}