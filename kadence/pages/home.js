import { useRouter } from 'next/router';
import { PageLayout } from '@/components/';
// We have to use this import style, otherwise the Home test tries to import the entire mui library
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Logout from '@mui/icons-material/Logout';
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
        if (username === null) {
            router.push('/login');
        }
        // TODO: Fix this by implementing a route guard instead
        // https://jasonwatmore.com/post/2021/08/30/next-js-redirect-to-login-page-if-unauthenticated
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

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

    const fitnessModeRoute = '/mode/fitness';
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
