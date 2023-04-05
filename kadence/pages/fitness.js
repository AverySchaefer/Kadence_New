import { useState, useEffect } from 'react';

import styles from '@/styles/Interval.module.css';

import NetworkAPI from '@/lib/networkAPI';

import PageLayout from '@/components/PageLayout';
import { MusicPlayer } from '@/components';
import { Dialog } from '@capacitor/dialog';
import { useRouter } from 'next/router';

import { Button } from '@mui/material';

export default function FitnessPage() {
    const [heartRate, setHeartRate] = useState(null);
    const [currentSong, setCurrentSong] = useState(null);
    const [songCache, setSongCache] = useState([]);

    const router = useRouter();

    const saveToProfile = async (playlistURIs) => {
        console.log(playlistURIs);
        const saveRoute = '/api/generation/save';
        await fetch(saveRoute, {
            method: 'POST',
            body: JSON.stringify({
                playlistName: 'Kadence Fitness Mode',
                playlistArray: playlistURIs,
            }),
        });
    };

    useEffect(() => {
        async function queueNewSong() {
            const fitnessMode = '/api/generation/fitness?';
            const queueRoute = '/api/spotify/queue';
            let trackURI = '';
            const highRes = await fetch(
                fitnessMode +
                    new URLSearchParams({
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
            // TODO: query heart rate
            setHeartRate(Math.floor(Math.random() * 41) + 60);
            checkCurrentSong();
        }, 1000);
        return () => clearInterval(counter);
    }, [currentSong]);

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
        <PageLayout title="Fitness Mode" includeNav={false}>
            <div className={styles.pageWrapper}>
                <p
                    style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2em',
                    }}
                >
                    Current Heart Rate: {heartRate || '?'}
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
