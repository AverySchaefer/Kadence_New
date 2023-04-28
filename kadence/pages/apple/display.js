import Image from 'next/image';
import styles from '@/styles/Spotify.module.css';
import Button from '@mui/material/Button';
import { PageLayout } from '@/components';
import { useState, useEffect } from 'react';
import { queueSongs } from '@/lib/apple/AppleAPI';
import useMusicKit from '@/lib/useMusicKit';
import NetworkAPI from '@/lib/networkAPI';
import { useRouter } from 'next/router';

export default function Display() {
    const [loggedIn, setLoggedIn] = useState(false);
    const router = useRouter();

    const MusicKit = useMusicKit();

    useEffect(() => {
        setLoggedIn(localStorage.getItem('appleMusicUserToken') !== null);
    }, []);

    useEffect(() => {
        async function startTestPlayback() {
            if (MusicKit) {
                const music = MusicKit.getInstance();

                // Test conversion
                const { data } = await NetworkAPI.post(
                    '/api/apple/conversion',
                    {
                        appleUserToken: music.musicUserToken,
                        spotifyURIs: [
                            'spotify:track:15irEKZ9D6FQqLoZ1qJ1Cx',
                            'spotify:track:2fuYa3Lx06QQJAm0MjztKr',
                        ],
                    }
                );

                await queueSongs(music, data.appleURIs);
                await music.play();
                await music.pause();
            }
        }
        startTestPlayback();
    }, [MusicKit]);

    function signInToApple() {
        const music = MusicKit.getInstance();
        music
            .authorize()
            .then((token) => {
                localStorage.setItem('appleMusicUserToken', token);
                localStorage.setItem('platform', 'apple');
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
        const newPlatformData = {
            username: localStorage.getItem('username'),
            musicPlatform: '',
        };

        const music = MusicKit.getInstance();
        music.unauthorize();
        localStorage.removeItem('appleMusicUserToken');
        setLoggedIn(false);
        NetworkAPI.post('/api/apple/signOut', {
            username: localStorage.getItem('username'),
        }).catch((err) => console.log(err));

        try {
            NetworkAPI.patch('/api/users/update', newPlatformData);
        } catch (err) {
            console.log(err);
        } finally {
            localStorage.removeItem('platform');
            router.replace('/profile');
        }
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
