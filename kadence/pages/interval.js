import { useState, useEffect, useCallback } from 'react';

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

    const [dislikedSongs, setDislikedSongs] = useState([]);

    const router = useRouter();
    const music = useMusicKit()?.getInstance();

    const filterSongs = useCallback(
        (songs) => songs.filter((uri) => !dislikedSongs.includes(uri)),
        [dislikedSongs]
    );

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

        async function onLoad() {
            if (
                Object.keys(router.query).length > 0 &&
                !ready &&
                music &&
                platform
            ) {
                const low = parseInt(router.query.intervalLow, 10) * 60;
                const high = parseInt(router.query.intervalHigh, 10) * 60;
                setIntervalLow(low);
                setIntervalHigh(high);
                setTimer(low);
                await fetchSongs();
                setReady(true);
            }
        }

        onLoad();
    }, [router.query, ready, platform, music]);

    // Save uris to profile with specified name
    const saveToProfile = useCallback(
        async (playlistURIs) => {
            const { value, cancelled } = await Dialog.prompt({
                title: 'Playlist Name',
                message: 'What would you like to name your playlist?',
            });

            if (cancelled) return;

            const playlistName = value.trim() || `Kadence Interval Mode`;

            await NetworkAPI.post('/api/activity/insert', {
                username: localStorage.getItem('username'),
                timestamp: new Date().toLocaleString(),
                actionType: 'save',
                friend: null,
                genMode: 'interval',
                saved: playlistName,
            });

            if (platform === 'Spotify') {
                const saveRoute = '/api/generation/save';
                await fetch(saveRoute, {
                    method: 'POST',
                    body: JSON.stringify({
                        playlistName,
                        playlistArray: playlistURIs,
                    }),
                });
            } else if (platform === 'apple') {
                const saveRoute = '/api/apple/saveToPlaylist';
                await NetworkAPI.post(saveRoute, {
                    name: playlistName,
                    appleURIs: playlistURIs,
                    appleUserToken: music.musicUserToken,
                });
            }
            await Dialog.alert({
                title: 'Success',
                message: 'Saved playlist successfully.',
            });
        },
        [music, platform]
    );

    async function handleEndSession() {
        // Last song is in queue, hasn't been played
        const validSongsToSave = filterSongs(songCache.slice(0, -1));
        if (validSongsToSave.length >= 1) {
            const { value: saveToPlaylist } = await Dialog.confirm({
                title: 'What did you think?',
                message: 'Would you like to save these songs to a playlist?',
                okButtonTitle: 'Yes',
                cancelButtonTitle: 'No',
            });
            if (saveToPlaylist) {
                await saveToProfile(validSongsToSave);
            }
        }
        if (platform === 'apple' && music) {
            // Clear queue
            await queueSongs(music, []);
        }
        router.push('/home');
    }

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
                    try {
                        await NetworkAPI.post('/api/spotify/queue', {
                            songURI: newSong,
                        });
                    } catch (err) {
                        await Dialog.alert({
                            title: 'Spotify Error',
                            message:
                                'Error occurred. Please make sure to leave Spotify open and active during the entirety of interval mode!',
                        });
                        // Last song is in queue, hasn't been played
                        const validSongsToSave = filterSongs(
                            songCache.slice(0, -1)
                        );
                        if (validSongsToSave.length >= 1) {
                            const { value: saveToPlaylist } =
                                await Dialog.confirm({
                                    title: 'What did you think?',
                                    message:
                                        'Would you like to save these songs to a playlist?',
                                    okButtonTitle: 'Yes',
                                    cancelButtonTitle: 'No',
                                });
                            if (saveToPlaylist) {
                                await saveToProfile(validSongsToSave);
                            }
                            router.push('/home');
                        } else {
                            router.replace('/mode/preInterval');
                        }
                    }
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
                    music.player.currentPlaybackTimeRemaining <= 0 ||
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
                setDelayBeforeQueue((prev) => (prev <= 0 ? 0 : prev - 1));
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
        router,
        songCache,
        saveToProfile,
        filterSongs,
    ]);

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
                    {ready
                        ? `${currentMode} Energy: ${secondsToTime(timer)}`
                        : `Fetching songs...`}
                </p>
                {ready && (
                    <MusicPlayer
                        size="large"
                        onDislike={(playerData) =>
                            setDislikedSongs((prev) => [
                                ...prev,
                                playerData.songURI,
                            ])
                        }
                    />
                )}
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
