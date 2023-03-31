import { useState, useEffect } from 'react';

import NetworkAPI from '@/lib/networkAPI';
import PageLayout from '@/components/PageLayout';
import { MusicPlayer } from '@/components';
import { useRouter } from 'next/router';

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
    const songsToSave = [];
    const router = useRouter();

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
                    status,
                    username: localStorage.getItem('username'),
                })
        );
        trackURI = await highRes.json();
        songsToSave.push(trackURI[0]);
        console.log(songsToSave);
        fetch(queueRoute, {
            method: 'POST',
            body: JSON.stringify({
                songURI: trackURI,
            }),
        });
    };

    const checkCurrentSong = async () => {
        const currentSongData = await NetworkAPI.get(
            '/api/spotify/currentSong'
        );
        if (currentSongData) {
            if (currentSong !== currentSongData.data.item.name) {
                currentSong = currentSongData.data.item.name;
                queueNewSong(currentSongData);
            }
        }
    };

    useEffect(() => {
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
    }, [ready]);

    useEffect(() => {
        if (Object.keys(router.query).length > 0 && !ready) {
            const low = parseInt(router.query.intervalLow, 10) * 60;
            const high = parseInt(router.query.intervalHigh, 10) * 60;
            setIntervalLow(low);
            setIntervalHigh(high);
            setTimer(low);
            setReady(true);

            // Queue songs? Might have to return them as well
            // in the handler as the response so that I can cue
            // them for Apple Music on the frontend
            NetworkAPI.get('/').then(console.log);
        }
    }, [router.query]);

    return (
        <PageLayout title="Interval Mode" includeNav={true}>
            <div style={{ overflow: 'hidden', height: '100%' }}>
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
            </div>
        </PageLayout>
    );
}
