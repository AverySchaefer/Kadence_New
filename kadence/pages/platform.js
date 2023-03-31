import * as React from 'react';
import styles from '@/styles/Platform.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Dialog } from '@capacitor/dialog';
import { Button } from '@mui/material/';
import NetworkAPI from '@/lib/networkAPI';
import PageLayout from '@/components/PageLayout';
import { signIn } from 'next-auth/react';
import useMusicKit from '@/lib/useMusicKit';

export default function Platform() {
    const router = useRouter();
    const MusicKit = useMusicKit();

    async function handleSpotify() {
        const newPlatformData = {
            username: localStorage.getItem('username'),
            musicPlatform: 'Spotify',
        };

        try {
            NetworkAPI.patch('/api/users/update', newPlatformData);
        } catch (err) {
            Dialog.alert({
                title: 'Error',
                message: `An error occurred while submitting your data: ${err.message}.`,
            });
        } finally {
            localStorage.setItem('platform', 'spotify');
            signIn('spotify', { callbackUrl: '/profile' });
        }
    }

    async function handleApple() {
        const newPlatformData = {
            username: localStorage.getItem('username'),
            musicPlatform: 'Apple Music',
        };

        try {
            NetworkAPI.patch('/api/users/update', newPlatformData);
        } catch (err) {
            Dialog.alert({
                title: 'Error',
                message: `An error occurred while submitting your data: ${err.message}.`,
            });
        } finally {
            // Can't sign them in here due to needing MusicKit, take them here
            // instead and they can sign in there themselves
            if (MusicKit) {
                const music = MusicKit.getInstance();
                music
                    .authorize()
                    .then((token) => {
                        localStorage.setItem('appleMusicUserToken', token);
                        localStorage.setItem('platform', 'apple');
                        NetworkAPI.post('/api/apple/signIn', {
                            username: localStorage.getItem('username'),
                            userToken: token,
                        })
                            .then(() => router.push('/profile'))
                            .catch((err) => console.log(err));
                    })
                    .catch((err) =>
                        console.log(
                            `Error ${err}: You must have an account set up already!`
                        )
                    );
            }
        }
    }

    return (
        <PageLayout title="Select Platform" includeNav={false}>
            <main className={styles.main}>
                <div>
                    <Image
                        src="/Spotify.jpg"
                        alt="Spotify Logo"
                        width="300"
                        height="150"
                        className={styles.platformImage}
                        priority
                    />
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#69e267',
                            '&:active': { backgroundColor: '#69e267' },
                        }}
                        onClick={handleSpotify}
                    >
                        Connect to Spotify!
                    </Button>
                </div>
                <div>
                    <Image
                        src="/apple-music.jpg"
                        alt="Apple Music Logo"
                        width="300"
                        height="150"
                        className={styles.platformImage}
                        priority
                    />
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#69e267',
                            '&:active': { backgroundColor: '#69e267' },
                        }}
                        onClick={handleApple}
                    >
                        Connect to Apple Music!
                    </Button>
                </div>
            </main>
        </PageLayout>
    );
}
