import { useRouter } from 'next/router';
import { PageLayout } from '@/components/';
import { Button, Card } from '@mui/material';
import { useState, useEffect } from 'react';
import NetworkAPI from '@/lib/networkAPI';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
    const router = useRouter();

    async function handleClick() {
        console.log('Clicking the logout button!');
        localStorage.removeItem('jwt');
        // localStorage.removeItem('username');
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

    const [username, setUsername] = useState('Unknown User');
    useEffect(() => {
        setUsername(localStorage.getItem('username'));
    });

    return (
        <PageLayout title="Home" activeTab="home">
            <main className={styles.main}>
                <h4>
                    Welcome, <b>{username}</b>
                </h4>
                <Card className={styles.moodContainer}>
                    <Button
                        className={`${styles.modeBtn} ${styles.heartRateBtn}`}
                    >
                        Heart Rate
                    </Button>
                    <Button
                        className={`${styles.modeBtn} ${styles.intervalBtn}`}
                        onClick={() => router.push('/preInterval')}
                    >
                        Interval
                    </Button>
                    <Button className={`${styles.modeBtn} ${styles.moodBtn}`}>
                        Mood
                    </Button>
                    <Button
                        className={`${styles.modeBtn} ${styles.localArtistBtn}`}
                    >
                        Local Artist
                    </Button>
                    <Button className={styles.generateBtn}>
                        Generate Playlist
                    </Button>
                </Card>
                <Button className={styles.logoutBtn} onClick={handleClick}>
                    Log Out
                </Button>
            </main>
        </PageLayout>
    );
}
