import { useState, useEffect, useCallback } from 'react';

import styles from '@/styles/Interval.module.css';

import NetworkAPI from '@/lib/networkAPI';

import PageLayout from '@/components/PageLayout';
import { MusicPlayer } from '@/components';
import { Dialog } from '@capacitor/dialog';
import { useRouter } from 'next/router';

import { Button } from '@mui/material';
import { queueSongs } from '@/lib/apple/AppleAPI';
import useMusicKit from '@/lib/useMusicKit';

const heartRefreshRateSeconds = 5;

export default function FitnessPage() {
    const [heartRate, setHeartRate] = useState(null);
    const [songCache, setSongCache] = useState([]);
    const [platform, setPlatform] = useState(null);

    // Used to detect when song ends for Spotify
    // We call play() with an array containing the uri twice and skip
    // Once the song ends, it will loop to beginning and pause. This is
    // detected (since we somehow went back in time) and a new song is queued
    const [currentProgress, setCurrentProgress] = useState(0);

    const [didInitialLoad, setDidInitialLoad] = useState(false);

    // Flag to denote whether song was just queued (for Apple)
    const [delayBeforeQueue, setDelayBeforeQueue] = useState(0);

    const [, setTimer] = useState(0);

    const [dislikedSongs, setDislikedSongs] = useState([]);

    const router = useRouter();
    const music = useMusicKit()?.getInstance();

    // Initialize platform on page load
    useEffect(() => {
        setPlatform(localStorage.getItem('platform'));
    }, []);

    const filterSongs = useCallback(
        (songs) => songs.filter((uri) => !dislikedSongs.includes(uri)),
        [dislikedSongs]
    );

    // Save uris to profile with specified name
    const saveToProfile = useCallback(
        async (playlistURIs) => {
            // Get playlist name
            const { value, cancelled } = await Dialog.prompt({
                title: 'Playlist Name',
                message: 'What would you like to name your playlist?',
            });
            if (cancelled) return;
            const playlistName = value.trim() || `Kadence Fitness Mode`;

            // Save playlist with specified name
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

            // Add activity log record
            await NetworkAPI.post('/api/activity/insert', {
                username: localStorage.getItem('username'),
                timestamp: new Date().toLocaleString(),
                actionType: 'save',
                friend: null,
                genMode: 'fitness',
                saved: playlistName,
            });
        },
        [music, platform]
    );

    const handleEndSession = useCallback(async () => {
        const validSongsToSave = filterSongs(songCache);
        if (validSongsToSave.length >= 1) {
            const { value: saveToPlaylist } = await Dialog.confirm({
                title: 'What did you think?',
                message: 'Would you like to save these songs to a playlist?',
                okButtonTitle: 'Yes',
                cancelButtonTitle: 'No',
            });
            if (saveToPlaylist) {
                // Last song is in queue, hasn't been played
                await saveToProfile(validSongsToSave);
            }
        }
        if (platform === 'apple' && music) {
            // Clear queue
            await queueSongs(music, []);
        }
        router.push('/home');
    }, [songCache, music, platform, router, saveToProfile, filterSongs]);

    const getHeartRate = useCallback(async () => {
        try {
            // console.log("token: " + localStorage.getItem('access_token'));
            const heartValue = await NetworkAPI.get(
                '/api/fitbit/getHeartValue?' + new URLSearchParams({
                    access_token: localStorage.getItem('access_token'),
                })
            );
            // console.log(heartValue.data.value);
            setHeartRate(heartValue.data.value);
            return heartValue.data.value;
        } catch (err) {
            console.log('Fitbit Heart Rate Fetch Error', err);
            await Dialog.alert({
                title: 'Error Occurred',
                message:
                    'Something went wrong getting your heart rate from your device. Please check your device and try again.',
            });
            await handleEndSession();
            return null;
        }
    }, [handleEndSession]);

    const getRecommendedSong = useCallback(async () => {
        const currentHeartRate = await getHeartRate();
        setHeartRate(currentHeartRate);
        if (!currentHeartRate) return null;

        const { data: songURIs } = await NetworkAPI.get(
            '/api/generation/fitness',
            {
                heartrate: currentHeartRate,
                username: localStorage.getItem('username'),
            }
        );

        // If Spotify, just return first song (was shuffled server-side)
        if (platform === 'Spotify') {
            return songURIs[0];
        }

        // If apple, convert and then pick one
        if (platform === 'apple' && music) {
            const { data } = await NetworkAPI.get('/api/apple/conversion', {
                spotifyURIs: JSON.stringify(songURIs),
                appleUserToken: music.musicUserToken,
            });
            return data.appleURIs[0];
        }

        return null;
    }, [getHeartRate, music, platform]);

    const queueNewSong = useCallback(async () => {
        if (delayBeforeQueue > 0) return;

        const newSong = await getRecommendedSong();
        if (!newSong) return;

        setSongCache((prev) => {
            const newCache = [...prev, newSong];
            console.log('New Cache: ', newCache);
            return newCache;
        });

        if (platform === 'Spotify') {
            try {
                await NetworkAPI.put('/api/spotify/play', {
                    uris: [newSong, newSong],
                });
                await NetworkAPI.post('/api/spotify/skip');
            } catch (err) {
                await Dialog.alert({
                    title: 'Spotify Error',
                    message:
                        'Error occurred. Please make sure to leave Spotify open and active during the entirety of fitness mode!',
                });
                const validSongsToSave = filterSongs(songCache);
                if (validSongsToSave.length >= 1) {
                    const { value: saveToPlaylist } = await Dialog.confirm({
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
                    router.replace('/home');
                }
            }
        } else if (platform === 'apple') {
            await queueSongs(music, [newSong]);
            await music.play();
        }

        // Try to prevent double queues
        setDelayBeforeQueue(2);
    }, [
        delayBeforeQueue,
        getRecommendedSong,
        music,
        platform,
        router,
        saveToProfile,
        songCache,
        filterSongs,
    ]);

    useEffect(() => {
        async function updateState() {
            if (platform === 'Spotify') {
                try {
                    const currentSongData = await NetworkAPI.get(
                        '/api/spotify/playerInfo'
                    );
                    // Check to make sure still playing
                    if (!currentSongData?.data?.songURI)
                        throw new Error('Stopped playing!');

                    const newProgress = currentSongData?.data?.progressSeconds;
                    setCurrentProgress(newProgress);
                    if (currentProgress > newProgress) {
                        setCurrentProgress(0);
                        await queueNewSong();
                    }
                } catch (err) {
                    await Dialog.alert({
                        title: 'Spotify Error',
                        message:
                            'Error occurred. Please make sure to leave Spotify open and active during the entirety of fitness mode!',
                    });
                    const validSongsToSave = filterSongs(songCache);
                    if (validSongsToSave.length >= 1) {
                        const { value: saveToPlaylist } = await Dialog.confirm({
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
                        router.replace('/home');
                    }
                }
            } else if (platform === 'apple' && music) {
                if (music.player.currentPlaybackTimeRemaining <= 0) {
                    await queueNewSong();
                }
            }
        }

        if (didInitialLoad) {
            const counter = setInterval(() => {
                updateState();
                setDelayBeforeQueue((prev) => (prev <= 0 ? 0 : prev - 2));
                setTimer((prev) => {
                    if (prev <= 0) {
                        getHeartRate().then((newHeart) =>
                            setHeartRate(newHeart)
                        );
                        return heartRefreshRateSeconds - 2;
                    }
                    return prev - 2;
                });
            }, 2000);
            return () => clearInterval(counter);
        }
        return undefined;
    }, [
        currentProgress,
        getHeartRate,
        music,
        platform,
        queueNewSong,
        didInitialLoad,
        filterSongs,
        router,
        saveToProfile,
        songCache,
    ]);

    // Get heart rate and do first queue on page load
    useEffect(() => {
        async function onLoad() {
            if (!didInitialLoad && platform && music) {
                // Get heart rate
                const currentHeartRate = await getHeartRate();
                setHeartRate(currentHeartRate);

                // Queue first song
                setDidInitialLoad(true);
                await queueNewSong();
            }
        }
        onLoad();
    }, [didInitialLoad, getHeartRate, music, platform, queueNewSong]);

    return (
        <PageLayout title="Fitness Mode" includeNav={false}>
            <div className={styles.pageWrapper}>
                <p
                    style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2em',
                    }}
                >
                    Current Heart Rate: {heartRate ?? '?'}
                </p>
                <MusicPlayer
                    size="large"
                    onDislike={(playerData) =>
                        setDislikedSongs((prev) => [
                            ...prev,
                            playerData.songURI,
                        ])
                    }
                />
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
