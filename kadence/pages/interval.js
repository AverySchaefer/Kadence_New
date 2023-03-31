import { useState, useEffect } from 'react';

import styles from '@/styles/Interval.module.css';

import NetworkAPI from '@/lib/networkAPI';
import PageLayout from '@/components/PageLayout';
import { MusicPlayer } from '@/components';
import { Dialog } from '@capacitor/dialog';
import { useRouter } from 'next/router';

import { Button } from '@mui/material';

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

    const router = useRouter();

    const saveToProfile = async (playlistURIs) => {
        console.log(playlistURIs);
        const saveRoute = '/api/generation/save';
        await fetch(saveRoute, {
            method: 'POST',
            body: JSON.stringify({
                playlistName: 'Kadence Interval Mode',
                playlistArray: playlistURIs,
            }),
        });
    };

    useEffect(() => {
        async function queueNewSong() {
            const intervalMode = '/api/generation/interval?';
            const queueRoute = '/api/spotify/queue';
            let trackURI = '';
            let status = '1';
            if (currentMode === 'Low') {
                status = '0';
            }
            const highRes = await fetch(
                intervalMode +
                    new URLSearchParams({
                        status,
                        username: localStorage.getItem('username'),
                    })
            );
            trackURI = await highRes.json();
            setSongCache((prev) => {
                const newCache = [...prev, trackURI[0]];
                console.log('New Cache', newCache);
                return newCache;
            });
            fetch(queueRoute, {
                method: 'POST',
                body: JSON.stringify({
                    songURI: trackURI,
                }),
            });
        }

        async function checkCurrentSong() {
            const currentSongData = await NetworkAPI.get(
                '/api/spotify/currentSong'
            );
            if (currentSongData) {
                if (currentSong !== currentSongData?.data?.item?.name) {
                    setCurrentSong(currentSongData?.data?.item?.name);
                    queueNewSong(currentSongData);
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
                    checkCurrentSong();
                    return prev - 1;
                });
            }
        }, 1000);
        return () => clearInterval(counter);
    }, [ready, currentMode, currentSong, intervalHigh, intervalLow]);

    useEffect(() => {
        if (Object.keys(router.query).length > 0 && !ready) {
            const low = parseInt(router.query.intervalLow, 10) * 60;
            const high = parseInt(router.query.intervalHigh, 10) * 60;
            setIntervalLow(low);
            setIntervalHigh(high);
            setTimer(low);
            setReady(true);
        }
    }, [router.query, ready]);

    async function handleEndSession() {
        if (songCache.length > 0) {
            const { value: saveToPlaylist } = await Dialog.confirm({
                title: 'What did you think?',
                message: 'Would you like to save these songs to a playlist?',
                okButtonTitle: 'Yes',
                cancelButtonTitle: 'No',
            });
            if (saveToPlaylist) {
                console.log('Saving', songCache);
                saveToProfile(songCache);
            }
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
