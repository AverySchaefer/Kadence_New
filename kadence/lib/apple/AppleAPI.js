export const AppleMusicConfiguration = {
    developerToken:
        'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlRSNjhKSjlDSEcifQ.eyJpYXQiOjE2ODAwNDI2MjMsImV4cCI6MTY5NTU5NDYyMywiaXNzIjoiOFc0Nzk4SFNZNSJ9.WlMKX6aB2sZSK1sft2npNN3sbgiahHDXXn8fQqWKERvT1w5dkQDpPaVTIjrp5ueJIaHBDAFQNvshRd4OSJ6-VQ',
    app: {
        name: 'Kadence',
        build: '1.0',
    },
};

// Returns the first song that is returned by Apple Music
// when querying "query"
export async function getFirstMatchingSong(music, query) {
    const searchResults = await music.api.search(query);
    const song = searchResults.songs.data[0];
    return song;
}

// Returns the first song matched by Apple Music for
// each query in the queryArray
export async function getMatchingSongs(music, queryArray) {
    const results = await Promise.all(
        queryArray.map((query) => getFirstMatchingSong(music, query))
    );
    return results;
}

// Sets the queue to be the song with the given ID
export function queueSong(music, id) {
    return music.setQueue({
        song: id,
    });
}

// Sets the queue to be an array of songs with the given IDs
export function queueSongs(music, idArray) {
    return music.setQueue({
        songs: idArray,
    });
}
