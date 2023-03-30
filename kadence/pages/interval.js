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

    let currentSong = '';
    const songCache = [];
    const router = useRouter();

    const checkCurrentSong = async () => {
        const currentSongData = await NetworkAPI.get(
            '/api/spotify/currentSong'
        );
        if (currentSongData) {
            if (currentSong !== currentSongData?.data?.item?.name) {
                currentSong = currentSongData?.data?.item?.name;
                queueNewSong(currentSongData);
            }
        }
    };

    const queueNewSong = async () => {
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
                    status: status,
                    username: localStorage.getItem('username'),
                })
        );
        trackURI = await highRes.json();
        songCache.push(trackURI[0]);
        sessionStorage.setItem("songCache", JSON.stringify(songCache));
        console.log(songCache);
        fetch(queueRoute, {
            method: 'POST',
            body: JSON.stringify({
                songURI: trackURI,
            }),
        });
    };

    const saveToProfile = async (playlistURIs) => {
        console.log(playlistURIs);
        const saveRoute = '/api/generation/save';
        await fetch(saveRoute, {
            method: 'POST',
            body: JSON.stringify({
                playlistName: "Kadence Interval Mode",
                playlistArray: playlistURIs,
            })
        });
    }

    useEffect(() => {
        const counter = setInterval(() => {
            if (ready) {
                setTimer((prev) => {
                    if (prev === 0) {
                        if (currentMode === 'High') {
                            setCurrentMode('Low');
                            return intervalLow;
                        } else {
                            setCurrentMode('High');
                            return intervalHigh;
                        }
                    }
                    checkCurrentSong();
                    return prev - 1;
                });
            }
        }, 1000);
        return () => clearInterval(counter);
    }, [ready]);

    useEffect(() => {
        if (Object.keys(router.query).length > 0 && !ready) {
            const low = parseInt(router.query.intervalLow) * 60;
            const high = parseInt(router.query.intervalHigh) * 60;
            setIntervalLow(low);
            setIntervalHigh(high);
            setTimer(low);
            setReady(true);
        }
    }, [router.query]);

    async function handleEndSession() {
        if (JSON.parse(sessionStorage.getItem('songCache')).length > 0) {
            const { value: saveToPlaylist } = await Dialog.confirm({
                title: 'What did you think?',
                message: 'Would you like to save these songs to a playlist?',
                okButtonTitle: 'Yes',
                cancelButtonTitle: 'No',
            });
            if (saveToPlaylist) {
                console.log(JSON.parse(sessionStorage.getItem('songCache')));
                saveToProfile(JSON.parse(sessionStorage.getItem('songCache')));
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