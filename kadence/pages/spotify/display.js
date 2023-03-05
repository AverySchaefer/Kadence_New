import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Button from '@mui/material/Button';
import { useState } from 'react';
import styles from '@/styles/Spotify.module.css';
import PageLayout from '@/components/PageLayout';

export default function Display() {
    const { data: session } = useSession();
    const [songName, setSongItem] = useState('');

    const getMyCurrentSong = async () => {
        const res = await fetch('/api/spotify/currentSong');
        const songItem = await res.json();
        setSongItem(songItem.item.name);
    };

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
                            onClick={() => signOut()}
                        >
                            Sign out
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => signIn()}
                    >
                        Sign In!
                    </Button>
                )}
            </main>
        </PageLayout>
    );
}
