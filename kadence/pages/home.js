import { useRouter } from 'next/router';
import { PageLayout } from '@/components/';
import { Button, Card, IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import NetworkAPI from '@/lib/networkAPI';
import styles from '@/styles/Home.module.css';
import { Dialog } from '@capacitor/dialog';

export default function Home() {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('Unknown User');

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('jwt'));
        setUsername(localStorage.getItem('username'));
    }, []);

    useEffect(() => {
        if (localStorage.getItem('username') == null) {
            router.push('/login');
        }
    }, [router]);

    async function handleFitness() {
        if (localStorage.getItem('platform')) {
            const fitnessModeRoute = '/mode/preFitness';
            await NetworkAPI.post('/api/activity/insert', {
                username: localStorage.getItem('username'),
                timestamp: new Date().toLocaleString(),
                actionType: 'gen',
                friend: null,
                genMode: 'fitness',
                saved: null,
            });
            router.push(fitnessModeRoute);
        } else {
            await Dialog.alert({
                title: 'Music Platform Error',
                message: 'You need to connect a music platform first!',
            });
            router.push('/platform');
        }
    }

    async function handleInterval() {
        if (localStorage.getItem('platform')) {
            const intervalModeRoute = '/mode/preInterval';
            await NetworkAPI.post('/api/activity/insert', {
                username: localStorage.getItem('username'),
                timestamp: new Date().toLocaleString(),
                actionType: 'gen',
                friend: null,
                genMode: 'interval',
                saved: null,
            });
            router.push(intervalModeRoute);
        } else {
            await Dialog.alert({
                title: 'Music Platform Error',
                message: 'You need to connect a music platform first!',
            });
            router.push('/platform');
        }
    }

    async function handleMood() {
        if (localStorage.getItem('platform')) {
            const moodModeRoute = '/mode/mood';
            await NetworkAPI.post('/api/activity/insert', {
                username: localStorage.getItem('username'),
                timestamp: new Date().toLocaleString(),
                actionType: 'gen',
                friend: null,
                genMode: 'mood',
                saved: null,
            });
            router.push(moodModeRoute);
        } else {
            await Dialog.alert({
                title: 'Music Platform Error',
                message: 'You need to connect a music platform first!',
            });
            router.push('/platform');
        }
    }

    async function handleLocal() {
        if (localStorage.getItem('platform')) {
            const localModeRoute = '/mode/preLocal';
            await NetworkAPI.post('/api/activity/insert', {
                username: localStorage.getItem('username'),
                timestamp: new Date().toLocaleString(),
                actionType: 'gen',
                friend: null,
                genMode: 'local',
                saved: null,
            });
            router.push(localModeRoute);
        } else {
            await Dialog.alert({
                title: 'Music Platform Error',
                message: 'You need to connect a music platform first!',
            });
            router.push('/platform');
        }
    }

    async function handleLogout() {
        localStorage.removeItem('jwt');
        localStorage.removeItem('username');
        localStorage.removeItem('platform');
        // Send Request
        try {
            const data = await NetworkAPI.get('/api/users/logout', {});
            if (data) {
                router.push('/login');
            }
        } catch (err) {
            console.log('Error: ', err.status, err);
        }
    }

    return (
        isLoggedIn && (
            <PageLayout
                title="Home"
                activeTab="home"
                includeUpperRightIcon
                upperRightIcon={
                    <IconButton
                        className={styles.logoutBtn}
                        onClick={handleLogout}
                        aria-label="logout"
                    >
                        <Logout />
                    </IconButton>
                }
            >
                <main className={styles.main}>
                    <h4>
                        Welcome, <b>{username}</b>
                    </h4>
                    <h4>Select a mode to begin.</h4>
                    <Card className={styles.moodContainer}>
                        <Button
                            className={`${styles.modeBtn} ${styles.heartRateBtn}`}
                            onClick={handleFitness}
                        >
                            Heart Rate
                        </Button>
                        <Button
                            className={`${styles.modeBtn} ${styles.intervalBtn}`}
                            onClick={handleInterval}
                        >
                            Interval
                        </Button>
                        <Button
                            className={`${styles.modeBtn} ${styles.moodBtn}`}
                            onClick={handleMood}
                        >
                            Mood
                        </Button>
                        <Button
                            className={`${styles.modeBtn} ${styles.localArtistBtn}`}
                            onClick={handleLocal}
                        >
                            Local Artist
                        </Button>
                    </Card>
                </main>
            </PageLayout>
        )
    );
}
