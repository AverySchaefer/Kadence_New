import { PageLayout } from '@/components';
import useMusicKit from '@/lib/useMusicKit';
import { useContext, useEffect } from 'react';
import { MusicKitContext } from './_app';

export default function TestAppleMusic() {
    const MusicKit = useMusicKit();

    useEffect(() => {
        if (MusicKit) {
            const music = MusicKit.getInstance();
            console.log(music);
            music.authorize().then(() => {
                console.log(music.player.nowPlayingItem.title);
            });
        }
    }, [MusicKit]);

    return (
        <PageLayout>
            <h1>Testing Apple Music</h1>
        </PageLayout>
    );
}
