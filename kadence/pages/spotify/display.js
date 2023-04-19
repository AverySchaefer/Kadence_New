import Button from '@mui/material/Button';

import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { SessionContext } from '@/lib/session';
import { useState, useContext } from 'react';

import styles from '@/styles/Spotify.module.css';

import PageLayout from '@/components/PageLayout';
import NetworkAPI from '@/lib/networkAPI';

export default function Display() {
    // const { data: session } = useSession();
    const session = useContext(SessionContext);
    const [songName, setSongItem] = useState('');
    const [generatedItems, setAllItems] = useState('');

    const getAndSaveRecommendations = async () => {
        const moodMode = '/api/generation/mood?';
        const res = await fetch(
            moodMode +
                new URLSearchParams({
                    chosenMood: 'happy',
                    playlistLength: 30,
                    username: localStorage.getItem('username'),
                })
        );
        const playlistURIs = await res.json();

        /* NEED TO ADD A SAVE PREFERENCE */
        const saveRoute = '/api/generation/save';
        const saveRes = await fetch(saveRoute, {
            method: 'POST',
            body: JSON.stringify({
                playlistName: 'Kadence Mood Mode',
                playlistArray: playlistURIs,
            }),
        });
        const playlistID = await saveRes.json();

        const queueRoute = '/api/spotify/queue';
        for (let i = 0; i < playlistURIs.length; i++) {
            fetch(queueRoute, {
                method: 'POST',
                body: JSON.stringify({
                    songURI: playlistURIs[i],
                }),
            });
        }

        const playlistRoute = '/api/spotify/getPlaylist?';
        const playlistRes = await fetch(
            playlistRoute +
                new URLSearchParams({
                    playlistID,
                })
        );
        const playlistItems = await playlistRes.json();
        let playlistSongs = playlistItems.items[0].track.name;
        for (let j = 1; j < playlistItems.items.length; j++) {
            playlistSongs = playlistSongs.concat(', ');
            const song = playlistItems.items[j].track.name;
            playlistSongs = playlistSongs.concat(song);
        }
        setAllItems(playlistSongs);
    };

    const getRecommendations = async () => {
        const moodMode = '/api/generation/mood?';
        const res = await fetch(
            moodMode +
                new URLSearchParams({
                    chosenMood: 'happy',
                    playlistLength: 30,
                    username: localStorage.getItem('username'),
                })
        );
        const playlistURIs = await res.json();

        const queueRoute = '/api/spotify/queue';
        const songsToQueue = [];
        for (let i = 0; i < playlistURIs.length; i++) {
            songsToQueue.push(
                fetch(queueRoute, {
                    method: 'POST',
                    body: JSON.stringify({
                        songURI: playlistURIs[i],
                    }),
                })
            );
        }

        await Promise.all(songsToQueue);

        const getQueueRoute = '/api/spotify/getQueue';
        const queueRes = await fetch(getQueueRoute);
        const queueItems = await queueRes.json();
        let queueSongs = queueItems.queue[0].name;
        for (let j = 1; j < queueItems.queue.length; j++) {
            queueSongs = queueSongs.concat(', ');
            const song = queueItems.queue[j].name;
            queueSongs = queueSongs.concat(song);
        }
        setAllItems(queueSongs);
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
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => getAndSaveRecommendations()}
                        >
                            Get And Save Recommendations To Profile!
                        </Button>
                        <h3>Your recs: {generatedItems}</h3>
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
