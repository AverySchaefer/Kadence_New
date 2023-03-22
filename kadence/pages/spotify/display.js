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
    const [playlist, setPlaylist] = useState('');

    const getRecommendations = async () => {
        const moodMode = '/api/generation/mood?';
        const res = await fetch(moodMode + new URLSearchParams({
            chosenMood: 'happy',
            playlistLength: 30,
        }));
        const songItems = await res.json();
        console.log("Back on the display side");
        console.log(songItems);
        let newPlaylist = '';
        const playlistURIs = [];
        for (let i = 0; i < songItems.tracks.length; i++) {
            console.log(songItems.tracks[i].name);
            newPlaylist += songItems.tracks[i].name;
            playlistURIs.push(songItems.tracks[i].uri);
            newPlaylist = newPlaylist.concat(", ");
        }
        setPlaylist(newPlaylist);

        const saveRoute = '/api/generation/save'
        const saveRes = await fetch(saveRoute, {
            method: 'POST',
            body: JSON.stringify({
                playlistName: "Kadence Mood Mode",
                playlistArray: playlistURIs,
            })
        });
        console.log(saveRes);

        const queueRoute = '/api/spotify/queue'
        for (let i = 0; i < playlistURIs.length; i++) {
            fetch(queueRoute, {
                method: 'POST',
                body: JSON.stringify({
                    songURI: playlistURIs[i]
                })
            });
        }
    };

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

                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => getRecommendations()}
                        >
                            Get Recommendations!
                        </Button>
                        <h3>Your recs: {playlist}</h3>
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
