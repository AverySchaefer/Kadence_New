import Image from 'next/image';
import styles from '@/styles/Spotify.module.css';
import Button from '@mui/material/Button';
import { PageLayout } from '@/components';
import { useState, useEffect } from 'react';
import { Inter } from '@next/font/google';
import useMusicKit from '@/lib/useMusicKit';
import NetworkAPI from '@/lib/networkAPI';

const inter = Inter({ subsets: ['latin'] });

export default function Display() {
    const [loggedIn, setLoggedIn] = useState(false);
    const MusicKit = useMusicKit();

    function signInToApple() {
        const music = MusicKit.getInstance();
        console.log(music);
        music
            .authorize()
            .then((token) => {
                localStorage.setItem('appleMusicUserToken', token);
                console.log(token);
                setLoggedIn(true);
                NetworkAPI.post('/api/apple/signIn', {
                    username: localStorage.getItem('username'),
                    userToken: token,
                }).catch((err) => console.log(err));
            })
            .catch((err) =>
                console.log(
                    `Error ${err}: You must have an account set up already!`
                )
            );
    }

    function signOutFromApple() {
        const music = MusicKit.getInstance();
        music.unauthorize();
        localStorage.removeItem('appleMusicUserToken');
        setLoggedIn(false);
        NetworkAPI.post('/api/apple/signOut', {
            username: localStorage.getItem('username'),
        }).catch((err) => console.log(err));
    }

    // Check if signed in from cookies
    useEffect(() => {
        if (localStorage.getItem('appleMusicUserToken') !== null) {
            setLoggedIn(true);
        }
    }, []);

    return (
        <PageLayout title="Apple Music" player={loggedIn ? 'apple' : ''}>
            <div className={styles.main}>
                <Image
                    className={styles.img}
                    src="/apple-music.jpg"
                    alt="Apple Music Logo"
                    width={380}
                    height={200}
                    priority
                />
                {loggedIn ? (
                    <Button
                        onClick={signOutFromApple}
                        variant="contained"
                        size="large"
                    >
                        Sign Out From Apple Music!
                    </Button>
                ) : (
                    <Button
                        onClick={signInToApple}
                        variant="contained"
                        size="large"
                    >
                        Sign In To Apple Music!
                    </Button>
                )}
            </div>
        </PageLayout>
    );
}
