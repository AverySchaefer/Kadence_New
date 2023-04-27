export default function generateMoodParamsSpotifyOnly(prefData, songSeedID, chosenMood) {
    /* Generate the general search parameters */
    const minSongLength = prefData.minSongLength * 1000; // convert to ms
    const maxSongLength = prefData.maxSongLength * 1000; // convert to ms
    const lyricalInstrumental = prefData.lyricalInstrumental / 100; // convert to 0-1 scale

    if (chosenMood === 'happy') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.65,
            max_valence: 1.0,
            target_energy: 0.75,
            target_danceability: 0.65,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'sad') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.0,
            max_valence: 0.35,
            target_energy: 0.25,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'angry') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.0,
            max_valence: 0.35,
            target_energy: 0.75,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'relaxed') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.35,
            max_valence: 0.65,
            target_danceability: 0.25,
            target_tempo: 80,
            max_tempo: 100,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'energetic') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.5,
            max_valence: 0.75,
            min_danceability: 0.65,
            min_energy: 0.75,
            target_energy: 0.8,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'romantic') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.5,
            max_valence: 0.75,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    if (chosenMood === 'melancholy') {
        return new URLSearchParams({
            limit: 100,
            seed_tracks: songSeedID,
            target_instrumentalness: lyricalInstrumental,
            min_duration_ms: minSongLength,
            max_duration_ms: maxSongLength,
            min_valence: 0.0,
            max_valence: 0.35,
            target_danceability: 0.25,
            target_tempo: 80,
            max_tempo: 100,
            // Using this as a method for randomization
            target_popularity: Math.floor(Math.random() * 101),
        });
    }
    return new URLSearchParams({
        limit: 100,
        seed_tracks: songSeedID,
        seed_genres: `${prefData.faveGenres.join(',')}` || undefined,
        target_instrumentalness: lyricalInstrumental,
        min_duration_ms: minSongLength,
        max_duration_ms: maxSongLength,
        // Using this as a method for randomization
        target_popularity: Math.floor(Math.random() * 101),
    });
} 