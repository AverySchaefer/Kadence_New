import Button from '@mui/material/Button';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';

import styles from '@/styles/Spotify.module.css';

import PageLayout from '@/components/PageLayout';
import NetworkAPI from '@/lib/networkAPI';

export default function Display() {
    const { data: session } = useSession();
    const [songName, setSongItem] = useState('');

    const getMyCurrentSong = async () => {
        const res = await fetch('/api/spotify/currentSong');
        const songItem = await res.json();
        setSongItem(songItem.item.name);
    };

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
        <PageLayout player={session ? 'spotify' : ''}>
            <main className={styles.main}>
                <Image
                    className={styles.platformImage}
                    src="/Spotify.jpg"
                    alt="Spotify Logo"
                    width={700}
                    height={350}
                    priority
                />
                {session ? (
                    <>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => getMyCurrentSong()}
                        >
                            Get Song!
                        </Button>
                        <h3>Your song: {songName}</h3>
                        Signed in as {session?.token?.email} <br />
                        <Button
                            variant="contained"
                            size="large"
                            onClick={doSignOut}
                        >
                            Sign out
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => signIn('spotify')}
                    >
                        Sign In!
                    </Button>
                )}
            </main>
        </PageLayout>
    );
}
