import { useState, useEffect } from 'react';

import styles from '@/styles/Interval.module.css';

import NetworkAPI from '@/lib/networkAPI';
import PageLayout from '@/components/PageLayout';
import { MusicPlayer } from '@/components';
import { Dialog } from '@capacitor/dialog';
import { useRouter } from 'next/router';

import { Button } from '@mui/material';
import useMusicKit from '@/lib/useMusicKit';
import { queueSongs } from '@/lib/apple/AppleAPI';

function secondsToTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds - minutes * 60;
    return `${minutes <= 9 ? `0${minutes}` : minutes}:${
        secs <= 9 ? `0${secs}` : secs
    }`;
}

export default function IntervalPage() {
    const [ready, setReady] = useState(false);
    const [timer, setTimer] = useState(0);
    const [intervalLow, setIntervalLow] = useState(0);
    const [intervalHigh, setIntervalHigh] = useState(0);
    const [currentMode, setCurrentMode] = useState('Low');
    const [currentSong, setCurrentSong] = useState(null);
    const [songCache, setSongCache] = useState([]);
    const [platform, setPlatform] = useState(null);
    const [delayBeforeQueue, setDelayBeforeQueue] = useState(0);

    const [lowSongsToQueue, setLowSongsToQueue] = useState([]);
    const [highSongsToQueue, setHighSongsToQueue] = useState([]);

    const router = useRouter();
    const music = useMusicKit()?.getInstance();

    // Initialize platform on page load
    useEffect(() => {
        setPlatform(localStorage.getItem('platform'));
    }, []);

    // Get intervalLow and intervalHigh values and songs when ready
    useEffect(() => {
        async function getRecommendedSongs(status) {
            const intervalEndpoint = '/api/generation/interval?';
            const response = await fetch(
                intervalEndpoint +
                    new URLSearchParams({
                        status,
                        username: localStorage.getItem('username'),
                    })
            );

            const trackURIs = await response.json();

            if (platform === 'apple' && music !== undefined) {
                const { data } = await NetworkAPI.get('/api/apple/conversion', {
                    spotifyURIs: JSON.stringify(trackURIs),
                    appleUserToken: music.musicUserToken,
                });
                return data.appleURIs;
            }
            if (platform === 'Spotify') {
                return trackURIs;
            }
            return null;
        }

        async function fetchSongs() {
            try {
                if (platform === 'Spotify' || (music && platform === 'apple')) {
                    setLowSongsToQueue(await getRecommendedSongs('0'));
                    setHighSongsToQueue(await getRecommendedSongs('1'));
                }
            } catch (err) {
                Dialog.alert({
                    title: 'Error Occurred',
                    message:
                        'Something went wrong while getting recommendations from Spotify.',
                });
                setTimeout(fetchSongs, 10000);
            }
        }

        if (Object.keys(router.query).length > 0 && !ready) {
            const low = parseInt(router.query.intervalLow, 10) * 60;
            const high = parseInt(router.query.intervalHigh, 10) * 60;
            setIntervalLow(low);
            setIntervalHigh(high);
            setTimer(low);
            fetchSongs().then(() => setReady(true));
        }
    }, [router.query, ready, platform, music]);

    useEffect(() => {
        async function queueNewSong() {
            if (
                lowSongsToQueue.length > 1 &&
                highSongsToQueue.length > 1 &&
                delayBeforeQueue === 0
            ) {
                let newSong;
                let rest;

                if (currentMode === 'Low') {
                    [newSong, ...rest] = lowSongsToQueue;
                    setLowSongsToQueue([...rest, newSong]);
                } else {
                    [newSong, ...rest] = highSongsToQueue;
                    setHighSongsToQueue([...rest, newSong]);
                }

                setSongCache((prev) => {
                    const newCache = [...prev, newSong];
                    console.log('New Cache: ', newCache);
                    return newCache;
                });

                if (platform === 'Spotify') {
                    const queueRoute = '/api/spotify/queue';
                    await fetch(queueRoute, {
                        method: 'POST',
                        body: JSON.stringify({
                            songURI: [newSong],
                        }),
                    });
                } else if (platform === 'apple') {
                    await queueSongs(music, [newSong]);
                    await music.play();
                }

                // Try to prevent double queues
                setDelayBeforeQueue(2);
            }
        }

        async function updateState() {
            if (platform === 'Spotify') {
                const currentSongData = await NetworkAPI.get(
                    '/api/spotify/currentSong'
                );
                const currentURI = currentSongData?.data?.item?.name;
                if (currentSong !== currentURI) {
                    setCurrentSong(currentURI);
                    queueNewSong();
                }
            } else if (platform === 'apple' && music) {
                if (
                    music.player.currentPlaybackTimeRemaining === 0 ||
                    music.player.queue.isEmpty
                ) {
                    queueNewSong();
                }
            }
        }

        const counter = setInterval(() => {
            if (ready) {
                setTimer((prev) => {
                    if (prev === 0) {
                        if (currentMode === 'High') {
                            setCurrentMode('Low');
                            return intervalLow;
                        }
                        setCurrentMode('High');
                        return intervalHigh;
                    }
                    return prev - 1;
                });
                updateState();
                setDelayBeforeQueue((prev) => (prev === 0 ? 0 : prev - 1));
            }
        }, 1000);

        return () => clearInterval(counter);
    }, [
        currentMode,
        intervalLow,
        intervalHigh,
        ready,
        highSongsToQueue,
        lowSongsToQueue,
        platform,
        music,
        currentSong,
        delayBeforeQueue,
    ]);

    async function saveToProfile(playlistURIs) {
        if (platform === 'Spotify') {
            const saveRoute = '/api/generation/save';
            await fetch(saveRoute, {
                method: 'POST',
                body: JSON.stringify({
                    playlistName: 'Kadence Interval Mode',
                    playlistArray: playlistURIs,
                }),
            });
        } else if (platform === 'apple') {
            const saveRoute = '/api/apple/saveToPlaylist';
            await NetworkAPI.post(saveRoute, {
                name: 'Kadence Interval Mode',
                appleURIs: playlistURIs,
                appleUserToken: music.musicUserToken,
            });
        }
    }

    async function handleEndSession() {
        if (songCache.length > 0) {
            const { value: saveToPlaylist } = await Dialog.confirm({
                title: 'What did you think?',
                message: 'Would you like to save these songs to a playlist?',
                okButtonTitle: 'Yes',
                cancelButtonTitle: 'No',
            });
            if (saveToPlaylist) {
                saveToProfile(songCache);
            }
        }
        if (platform === 'apple' && music) {
            // Clear queue
            await music.skipToNextItem();
            await music.stop();
        }
        router.push('/home');
    }

    return (
        <PageLayout title="Interval Mode" includeNav={false}>
            <div className={styles.pageWrapper}>
                <p
                    style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2em',
                    }}
                >
                    {currentMode} Energy: {ready && secondsToTime(timer)}
                </p>
                <MusicPlayer size="large" type="spotify" />
                <Button
                    variant="contained"
                    sx={{
                        width: '25ch',
                        backgroundColor: 'button.primary',
                    }}
                    onClick={handleEndSession}
                >
                    End Session
                </Button>
            </div>
        </PageLayout>
    );
}
