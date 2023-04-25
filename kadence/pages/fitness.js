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

    // Flag to denote whether the first song has been queued yet (for Spotify)
    const [doneInitialQueue, setDoneInitialQueue] = useState(false);

    const [didInitialLoad, setDidInitialLoad] = useState(false);

    // Flag to denote whether song was just queued (for Apple)
    const [delayBeforeQueue, setDelayBeforeQueue] = useState(0);
    const [canQueue, setCanQueue] = useState(true);

    const router = useRouter();
    const music = useMusicKit()?.getInstance();

    // Initialize platform on page load
    useEffect(() => {
        setPlatform(localStorage.getItem('platform'));
    }, []);

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
        if (songCache.length >= 1) {
            const { value: saveToPlaylist } = await Dialog.confirm({
                title: 'What did you think?',
                message: 'Would you like to save these songs to a playlist?',
                okButtonTitle: 'Yes',
                cancelButtonTitle: 'No',
            });
            if (saveToPlaylist) {
                // Last song is in queue, hasn't been played
                await saveToProfile(songCache);
            }
        }
        if (platform === 'apple' && music) {
            // Clear queue
            await queueSongs(music, []);
        }
        router.push('/home');
    }, [songCache, music, platform, router, saveToProfile]);

    // const updateHeartRate = useCallback(async () => {
    //     try {
    //         // TODO: update this to use endpoint
    //         const newHeartRate = Math.floor(Math.random() * 41 + 60);
    //         setHeartRate(newHeartRate);
    //     } catch (err) {
    //         console.log('Fitbit Heart Rate Fetch Error', err);
    //         await Dialog.alert({
    //             title: 'Error Occurred',
    //             message:
    //                 'Something went wrong getting your heart rate from your device. Please check your device and try again.',
    //         });
    //         await handleEndSession();
    //     }
    // }, [handleEndSession]);

    // useEffect(() => {
    //     const heartRateFetchLoop = setInterval(
    //         updateHeartRate,
    //         heartRefreshRateSeconds * 1000
    //     );
    //     return () => clearInterval(heartRateFetchLoop);
    // }, [updateHeartRate]);

    // useEffect(() => {
    //     async function getRecommendedSong() {
    //         const { data: songURIs } = await NetworkAPI.get(
    //             '/api/generation/fitness',
    //             {
    //                 heartrate: heartRate,
    //                 username: localStorage.getItem('username'),
    //             }
    //         );

    //         // If Spotify, just return first song (was shuffled server-side)
    //         if (platform === 'Spotify') {
    //             return songURIs[0];
    //         }

    //         // If apple, convert and then pick one
    //         if (platform === 'apple' && music) {
    //             const { data } = await NetworkAPI.get('/api/apple/conversion', {
    //                 spotifyURIs: JSON.stringify(songURIs),
    //                 appleUserToken: music.musicUserToken,
    //             });
    //             return data.appleURIs[0];
    //         }

    //         return null;
    //     }

    //     async function queueNewSong() {
    //         if (heartRate === null || delayBeforeQueue !== 0) return;

    //         const newSong = await getRecommendedSong();

    //         setSongCache((prev) => {
    //             const newCache = [...prev, newSong];
    //             console.log('New Cache: ', newCache);
    //             return newCache;
    //         });

    //         // Try to prevent double queues
    //         setDelayBeforeQueue(2);

    //         if (platform === 'Spotify') {
    //             try {
    //                 await NetworkAPI.put('/api/spotify/play', {
    //                     uris: [newSong, newSong],
    //                 });
    //                 await NetworkAPI.post('/api/spotify/skip');
    //                 setDoneInitialQueue(true);
    //             } catch (err) {
    //                 await Dialog.alert({
    //                     title: 'Spotify Error',
    //                     message:
    //                         'Error occurred. Please make sure to leave Spotify open during the entirety of interval mode!',
    //                 });
    //                 if (songCache.length > 1) {
    //                     const { value: saveToPlaylist } = await Dialog.confirm({
    //                         title: 'What did you think?',
    //                         message:
    //                             'Would you like to save these songs to a playlist?',
    //                         okButtonTitle: 'Yes',
    //                         cancelButtonTitle: 'No',
    //                     });
    //                     if (saveToPlaylist) {
    //                         await saveToProfile(songCache);
    //                     }
    //                     router.push('/home');
    //                 } else {
    //                     router.replace('/home');
    //                 }
    //             }
    //         } else if (platform === 'apple') {
    //             await queueSongs(music, [newSong]);
    //             await music.play();
    //         }
    //     }

    //     async function updateState() {
    //         if (platform === 'Spotify') {
    //             const currentSongData = await NetworkAPI.get(
    //                 '/api/spotify/currentSong'
    //             );
    //             const newProgress = currentSongData?.data?.progress_ms;
    //             setCurrentProgress(newProgress);
    //             if (currentProgress > newProgress || !doneInitialQueue) {
    //                 setCurrentProgress(0);
    //                 await queueNewSong();
    //             }
    //         } else if (platform === 'apple' && music) {
    //             if (
    //                 music.player.currentPlaybackTimeRemaining <= 0 ||
    //                 music.player.queue.isEmpty
    //             ) {
    //                 console.log('queueing');
    //                 await queueNewSong();
    //             }
    //         }
    //     }

    //     const counter = setInterval(() => {
    //         updateState();
    //         setDelayBeforeQueue((prev) => (prev <= 0 ? 0 : prev - 1));
    //     }, 1000);
    //     return () => clearInterval(counter);
    // }, [
    //     platform,
    //     music,
    //     currentProgress,
    //     router,
    //     songCache,
    //     saveToProfile,
    //     heartRate,
    //     doneInitialQueue,
    //     delayBeforeQueue,
    // ]);

    const [, setTimer] = useState(0);

    const getHeartRate = useCallback(async () => {
        try {
            // TODO: update this to use endpoint
            const newHeartRate = Math.floor(Math.random() * 41 + 60);
            setHeartRate(newHeartRate);
            return newHeartRate;
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
                        'Error occurred. Please make sure to leave Spotify open during the entirety of interval mode!',
                });
                if (songCache.length >= 1) {
                    const { value: saveToPlaylist } = await Dialog.confirm({
                        title: 'What did you think?',
                        message:
                            'Would you like to save these songs to a playlist?',
                        okButtonTitle: 'Yes',
                        cancelButtonTitle: 'No',
                    });
                    if (saveToPlaylist) {
                        await saveToProfile(songCache);
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
    ]);

    useEffect(() => {
        async function updateState() {
            if (platform === 'Spotify') {
                const currentSongData = await NetworkAPI.get(
                    '/api/spotify/currentSong'
                );
                const newProgress = currentSongData?.data?.progress_ms;
                setCurrentProgress(newProgress);
                if (currentProgress > newProgress) {
                    setCurrentProgress(0);
                    await queueNewSong();
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
        doneInitialQueue,
        getHeartRate,
        music,
        platform,
        queueNewSong,
        didInitialLoad,
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
                <MusicPlayer size="large" />
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

// export default function FitnessPage() {
//     const [heartRate, setHeartRate] = useState(null);
//     const [currentSong, setCurrentSong] = useState(null);
//     const [songCache, setSongCache] = useState([]);

//     const router = useRouter();

//     const saveToProfile = async (playlistURIs) => {
//         await NetworkAPI.post('/api/activity/insert', {
//             username: localStorage.getItem('username'),
//             timestamp: new Date().toLocaleString(),
//             actionType: 'save',
//             friend: null,
//             genMode: 'fitness',
//             saved: 'Kadence Fitness Mode',
//         });
//         console.log(playlistURIs);
//         const saveRoute = '/api/generation/save';
//         await fetch(saveRoute, {
//             method: 'POST',
//             body: JSON.stringify({
//                 playlistName: 'Kadence Fitness Mode',
//                 playlistArray: playlistURIs,
//             }),
//         });
//     };

//     useEffect(() => {
//         async function queueNewSong() {
//             const fitnessMode = '/api/generation/fitness?';
//             const queueRoute = '/api/spotify/queue';
//             let trackURI = '';
//             const highRes = await fetch(
//                 fitnessMode +
//                     new URLSearchParams({
//                         username: localStorage.getItem('username'),
//                     })
//             );
//             trackURI = await highRes.json();
//             setSongCache((prev) => {
//                 const newCache = [...prev, trackURI[0]];
//                 console.log('New Cache', newCache);
//                 return newCache;
//             });
//             fetch(queueRoute, {
//                 method: 'POST',
//                 body: JSON.stringify({
//                     songURI: trackURI,
//                 }),
//             });
//         }

//         async function checkCurrentSong() {
//             const currentSongData = await NetworkAPI.get(
//                 '/api/spotify/currentSong'
//             );
//             if (currentSongData) {
//                 if (currentSong !== currentSongData?.data?.item?.name) {
//                     setCurrentSong(currentSongData?.data?.item?.name);
//                     queueNewSong(currentSongData);
//                 }
//             }
//         }

//         const counter = setInterval(() => {
//             // TODO: query heart rate
//             setHeartRate(Math.floor(Math.random() * 41) + 60);
//             checkCurrentSong();
//         }, 1000);
//         return () => clearInterval(counter);
//     }, [currentSong]);

//     async function handleEndSession() {
//         if (songCache.length > 0) {
//             const { value: saveToPlaylist } = await Dialog.confirm({
//                 title: 'What did you think?',
//                 message: 'Would you like to save these songs to a playlist?',
//                 okButtonTitle: 'Yes',
//                 cancelButtonTitle: 'No',
//             });
//             if (saveToPlaylist) {
//                 console.log('Saving', songCache);
//                 saveToProfile(songCache);
//             }
//         }
//         router.push('/home');
//     }

//     return (
//         <PageLayout title="Fitness Mode" includeNav={false}>
//             <div className={styles.pageWrapper}>
//                 <p
//                     style={{
//                         textAlign: 'center',
//                         fontWeight: 'bold',
//                         fontSize: '1.2em',
//                     }}
//                 >
//                     Current Heart Rate: {heartRate || '?'}
//                 </p>
//                 <MusicPlayer size="large" />
//                 <Button
//                     variant="contained"
//                     sx={{
//                         width: '25ch',
//                         backgroundColor: 'button.primary',
//                     }}
//                     onClick={handleEndSession}
//                 >
//                     End Session
//                 </Button>
//             </div>
//         </PageLayout>
//     );
// }
