export default async function generateSearchParams(
    songSeedID,
    prefData,
) {
    /* Generate the general search parameters */
    const minSongLength = prefData.minSongLength * 1000; // convert to ms
    const maxSongLength = prefData.maxSongLength * 1000; // convert to ms
    const lyricalInstrumental = prefData.lyricalInstrumental / 100; // convert to 0-1 scale

    return new URLSearchParams({
        limit: 100,
        seed_tracks: songSeedID,
        target_instrumentalness: lyricalInstrumental,
        min_duration_ms: minSongLength,
        max_duration_ms: maxSongLength,
        min_popularity: 0,
        max_popularity: 20,
    });
}