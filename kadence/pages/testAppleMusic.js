import { PageLayout } from '@/components';
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
                .authorize()
                .then((token) => {
                    fetch('https://api.music.apple.com/v1/me/library/songs', {
                        headers: {
                            Authorization: `Bearer ${developerToken}`,
                            'Music-User-Token': `${token}`,
                        },
                    })
                        .then((res) => res.json())
                        .then(console.log);

                    console.log(token);
                    console.log(music);
                })
                .catch((err) => console.log('Error ' + err));
        }
    }, [MusicKit]);

    return (
        <PageLayout>
            <h1>Testing Apple Music</h1>
        </PageLayout>
    );
}
