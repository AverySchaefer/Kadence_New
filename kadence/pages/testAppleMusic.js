import { PageLayout, MusicPlayer } from '@/components';
import { getFirstMatchingSong } from '@/lib/apple/AppleAPI';
import useMusicKit from '@/lib/useMusicKit';
import { useEffect } from 'react';

const developerToken =
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlRSNjhKSjlDSEcifQ.eyJpYXQiOjE2ODAwNDI2MjMsImV4cCI6MTY5NTU5NDYyMywiaXNzIjoiOFc0Nzk4SFNZNSJ9.WlMKX6aB2sZSK1sft2npNN3sbgiahHDXXn8fQqWKERvT1w5dkQDpPaVTIjrp5ueJIaHBDAFQNvshRd4OSJ6-VQ';

export default function TestAppleMusic() {
    const MusicKit = useMusicKit();

    useEffect(() => {
        if (MusicKit) {
            const music = MusicKit.getInstance();
            console.log(music);
            music
                .setQueue({
                    song: '1097861834', // Let Down by Radiohead
                })
                .then((res) => {
                    const item = res.items[0];
                    console.log(item);
                    music.player.prepareToPlay('1097861834').then(() => {
                        music.player
                            .changeToMediaItem(item)
                            .then(() => music.play());
                    });
                })
                .catch(() => console.log("I'm sad"));

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
    }, [MusicKit]);

    return (
        <PageLayout>
            <h1>Testing Apple Music</h1>
            <MusicPlayer size="large" type="apple" />
        </PageLayout>
    );
}
