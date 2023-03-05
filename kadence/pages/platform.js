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
            router.push('/profile');
        } catch (err) {
            Dialog.alert({
                title: 'Error',
                message: `An error occurred while submitting your data: ${err.message}.`,
            });
        }
    }

    return (
        <PageLayout title="Select Platform" footer="">
            <main className={styles.main}>
                <Box>
                    <Stack spacing={2} alignItems="center">
                        <Image
                            src="/Spotify.jpg"
                            alt="Spotify Logo"
                            width="300"
                            height="150"
                            className={styles.platformImage}
                            priority
                        />
                        <Button variant="contained" onClick={handleSpotify}>
                            Connect to Spotify!
                        </Button>
                        <br />
                        <Image
                            src="/apple-music.jpg"
                            alt="Apple Music Logo"
                            width="300"
                            height="150"
                            className={styles.platformImage}
                            priority
                        />
                        <Button variant="contained" onClick={handleApple}>
                            Connect to Apple Music!
                        </Button>
                    </Stack>
                </Box>
            </main>
        </PageLayout>
    );
}
