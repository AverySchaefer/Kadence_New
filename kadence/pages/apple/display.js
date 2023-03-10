import { useSession, signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Register.module.css';
import Button from '@/components/Button';
import { useState } from 'react';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Display() {
    const { data: session } = useSession();
    const [songName, setSongItem] = useState('');

    const getMyCurrentSong = async () => {
        const res = await fetch('/api/spotify/currentSong');
        const songItem = await res.json();
        console.log(songItem.item.name);
        setSongItem(songItem.item.name);
    };

    if (session) {
        return (
            <>
                <Head>
                    <title>Spotify Connect!</title>
                    <meta
                        name="description"
                        content="Generated by create next app"
                    />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main className={[inter.className, styles.main].join(' ')}>
                    <Image
                        className={styles.img}
                        src="/logo.png"
                        alt="Kadence Logo"
                        width={380}
                        height={200}
                        priority
                    />
                    <Button onClick={() => getMyCurrentSong()}>
                        Get Song!
                    </Button>
                    <h3>Your song: {songName}</h3>
                    Signed in as {session?.token?.email} <br />
                    <Button onClick={() => signOut()}>Sign out</Button>
                </main>
            </>
        );
    }
    return (
        <>
            <Head>
                <title>Not Logged In!</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={[inter.className, styles.main].join(' ')}>
                <Image
                    className={styles.img}
                    src="/logo.png"
                    alt="Kadence Logo"
                    width={380}
                    height={200}
                    priority
                />
                <Button onClick={() => signIn()}>Sign In To Spotify!</Button>
            </main>
        </>
    );
}