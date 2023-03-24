import { useRouter } from 'next/router';
import { PageLayout } from '@/components/';
import { Button, Card } from '@mui/material';
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
    });

    async function handleClick() {
        console.log('Clicking the logout button!');
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

    const fitnessModeRoute = '/mode/fitness';
    const intervalModeRoute = '/mode/interval';
    const moodModeRoute = '/mode/mood';
    const localModeRoute = '/mode/local';
    return (
        isLoggedIn && (
            <PageLayout title="Home" activeTab="home">
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
                    <Button
                        className={`${styles.logoutBtn}`}
                        onClick={handleClick}
                    >
                        Log Out
                    </Button>
                </main>
            </PageLayout>
        )
    );
}
