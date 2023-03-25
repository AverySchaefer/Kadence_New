import { useRouter } from 'next/router';
import { PageLayout } from '@/components/';
import { Button, Card } from '@mui/material';
import { useState, useEffect } from 'react';
import NetworkAPI from '@/lib/networkAPI';
import styles from '@/styles/Home.module.css';

export default function Home() {
    /*
  const [isLogged, setIsLogged] = useState();
  useEffect(() => {
      setIsLogged(!!localStorage.getItem('jwt'));
  }, []);

  function handleClick() {
    console.log("Clicking the logout button!")
  }

  if (isLogged) {
    return (
      <div>
        <h1>Home. The user is logged in.</h1>
        <Button onClick={handleClick}>Logout</Button>
        <BottomNav name="home" />
      </div>
    );
  } else {
    console.log("Not logged in.")
    return (
      <div>
        <h1>Home. The user is not logged in.</h1>
        <BottomNav name="home" />
      </div>
    );
  }
  */
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
