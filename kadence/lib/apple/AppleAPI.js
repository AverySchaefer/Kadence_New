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

// Maybe do it like this? Can't figure out how to do it with MusicKit
// https://developer.apple.com/documentation/applemusicapi/create_a_new_library_playlist
export function saveToPlaylist(music, idArray) {
    console.log(music, idArray);
}
