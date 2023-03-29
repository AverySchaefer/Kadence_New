import * as React from 'react';
import styles from '@/styles/Platform.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Dialog } from '@capacitor/dialog';
import { Box, Button, Stack } from '@mui/material/';
import NetworkAPI from '@/lib/networkAPI';
import PageLayout from '@/components/PageLayout';
import { signIn } from 'next-auth/react';

export default function Platform() {
    const router = useRouter();

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
            signIn('spotify', { callbackUrl: '/spotify/display' });
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
            router.push('/apple/display');
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
