import { PageLayout, MusicPlayer } from '@/components';
import { getMatchingSongs, queueSongs } from '@/lib/apple/AppleAPI';
import useMusicKit from '@/lib/useMusicKit';
import { useEffect } from 'react';

const songsToQueue = [
    'Let Down',
    'Mr. Saturday Night',
    'Weird Fishes',
    'Creep',
    'Careless Whisper',
];

export default function TestAppleMusic() {
    const MusicKit = useMusicKit();

    useEffect(() => {
        async function startTestPlayback() {
            if (MusicKit) {
                const music = MusicKit.getInstance();

                const songs = await getMatchingSongs(music, songsToQueue);
                console.log(songs);

                await queueSongs(
                    music,
                    songs.map((song) => song.id)
                );
                console.log(music.player);
                await music.prep;
                await music.play();

                // music
                //     .authorize()
                //     .then((token) => {
                //         fetch('https://api.music.apple.com/v1/me/library/songs', {
                //             headers: {
                //                 Authorization: `Bearer ${developerToken}`,
                //                 'Music-User-Token': `${token}`,
                //             },
                //         })
                //             .then((res) => res.json())
                //             .then((data) => {
                //                 music.api.search('sad').then(console.log);
                //                 music.api.library
                //                     .song(data.data[0].id)
                //                     .then((res) => {
                //                         console.log(res);
                //                     })
                //                     .catch(console.log('library failed'));
                //                 console.log(data);
                //                 music.player
                //                     .prepareToPlay('1359293318')
                //                     .then(() => {
                //                         music.play();
                //                         console.log('playing?');
                //                         console.log(music);
                //                     })
                //                     .catch(() => console.log('idk'));
                //             });

                //         console.log(music);
                //     })
                //     .catch((err) => console.log('Error ' + err));
            }
        }
        startTestPlayback();
    }, [MusicKit]);

    return (
        <PageLayout>
            <h1>Testing Apple Music</h1>
            <MusicPlayer size="large" type="apple" />
        </PageLayout>
    );
}
