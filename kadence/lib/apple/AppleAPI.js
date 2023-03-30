export async function getFirstMatchingSong(music, query) {
    const searchResults = await music.api.search(query);
    const song = searchResults.songs.data[0];
    console.log(song);
    return song;
}

export async function queueSong(music, id) {
    return await music.setQueue({
        song: id,
    });
}

export async function prepareToPlay(music, id) {
    return await music.player.prepareToPlay(id);
}

export async function changeToMediaItem(music, id) {
    return await music.player.changeToMediaItem(id);
}
