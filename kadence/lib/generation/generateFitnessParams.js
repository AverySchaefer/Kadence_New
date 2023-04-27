export default function generateFitnessParams(prefData, heartrate) {
    /* Generate the general search parameters */
    const minSongLength = prefData.minSongLength * 1000; // convert to ms
    const maxSongLength = prefData.maxSongLength * 1000; // convert to ms
    const lyricalInstrumental = prefData.lyricalInstrumental / 100; // convert to 0-1 scale
    const tempoMin = heartrate - 5;
    const tempoMax = heartrate + 5;

    return new URLSearchParams({
        // Get 10 so Apple will be able to have one too
        limit: 10,
        seed_genres: `${prefData.faveGenres.join(',')}`,
        target_instrumentalness: lyricalInstrumental,
        min_duration_ms: minSongLength,
        max_duration_ms: maxSongLength,
        target_tempo: heartrate,
        min_tempo: tempoMin,
        max_tempo: tempoMax,
        // Using this as a method for randomization
        target_popularity: Math.floor(Math.random() * 101),
    });
}