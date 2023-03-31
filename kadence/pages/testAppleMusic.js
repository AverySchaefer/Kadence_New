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

                await queueSongs(
                    music,
                    songs.map((song) => song.id)
                );
                await music.play();
            }
        }
        startTestPlayback();
    }, [MusicKit]);

    return (
        <PageLayout>
            <h1>Testing Apple Music</h1>
            <MusicPlayer size="large" />
        </PageLayout>
    );
}
