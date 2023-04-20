import { useRouter } from 'next/router';
import { PageLayout } from '@/components/';
import { Button, Card, IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import NetworkAPI from '@/lib/networkAPI';
import styles from '@/styles/Home.module.css';

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

    async function handleLogout() {
        localStorage.removeItem('jwt');
        localStorage.removeItem('username');
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

    const fitnessModeRoute = '/mode/preFitness';
    const intervalModeRoute = '/mode/preInterval';
    const moodModeRoute = '/mode/mood';
    const localModeRoute = '/mode/preLocal';
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
                            onClick={() => router.push(fitnessModeRoute)}
                        >
                            Heart Rate
                        </Button>
                        <Button
                            className={`${styles.modeBtn} ${styles.intervalBtn}`}
                            onClick={() => router.push(intervalModeRoute)}
                        >
                            Interval
                        </Button>
                        <Button
                            className={`${styles.modeBtn} ${styles.moodBtn}`}
                            onClick={() => router.push(moodModeRoute)}
                        >
                            Mood
                        </Button>
                        <Button
                            className={`${styles.modeBtn} ${styles.localArtistBtn}`}
                            onClick={() => router.push(localModeRoute)}
                        >
                            Local Artist
                        </Button>
                    </Card>
                </main>
            </PageLayout>
        )
    );
}
