import Button from '@mui/material/Button';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { Stack } from '@mui/material';
import MusicPlayer from '@/components/MusicPlayer';

import styles from '@/styles/Spotify.module.css';

import PageLayout from '@/components/PageLayout';
import NetworkAPI from '@/lib/networkAPI';

export default function Display() {
    const { data: session } = useSession();

    function doSignOut() {
        const newPlatformData = {
            username: localStorage.getItem('username'),
            musicPlatform: '',
        };

        try {
            NetworkAPI.patch('/api/users/update', newPlatformData);
        } catch (err) {
            console.log(err);
        } finally {
            localStorage.removeItem('platform');
            signOut({ callbackUrl: '/profile' });
        }
    }

    return (
        <PageLayout
            includeNav={false}
            title="Kadence Player"
            prevLink={'/profile'}
        >
            {session ? <MusicPlayer size="large" /> : null}
            <Stack
                alignItems="center"
                flexDirection={'row'}
                justifyContent={'space-around'}
            >
                {session ? (
                    <>
                        <Button
                            variant="contained"
                            size="large"
                            className={styles.button}
                            onClick={doSignOut}
                        >
                            Sign out
                        </Button>
                    </>
                ) : (
                    <>
                        <div>
                            <Image
                                className={styles.platformImage}
                                src="/Spotify.jpg"
                                alt="Spotify Logo"
                                width={700}
                                height={350}
                                priority
                            />
                        </div>
                        <div>
                            <Button
                                variant="contained"
                                size="large"
                                className={styles.button}
                                onClick={() => signIn('spotify')}
                            >
                                Sign In!
                            </Button>
                        </div>
                    </>
                )}
            </Stack>
        </PageLayout>
    );
}
