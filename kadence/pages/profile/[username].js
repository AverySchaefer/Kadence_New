import Image from 'next/image';
import Head from 'next/head';
import styles from '@/styles/Profile.module.css';
import { BottomNav } from '@/components/';
import { Inter } from '@next/font/google';
import { Dialog } from '@capacitor/dialog';
import { useRouter } from 'next/router';
import { Avatar, Box, Button, Stack, Tab, Tabs } from '@mui/material/';
import { useState, useEffect } from 'react';
import NetworkAPI from '@/lib/networkAPI';

const inter = Inter({ subsets: ['latin'] });

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function BasicTabs({ userData }) {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let platform = '';
    let alt = '';
    let accountLink = '';
    if (!userData.musicPlatforms) {
        platform = '/Empty.jpg';
        alt = 'No Selection';
        accountLink = `/profile/${userData.username}`;
    } else if (userData.musicPlatforms === 'Spotify') {
        platform = '/Spotify.jpg';
        alt = 'Spotify Logo';
        accountLink = 'https://www.spotify.com/us/account/apps/';
    } else if (userData.musicPlatforms === 'Apple Music') {
        platform = '/apple-music.jpg';
        alt = 'Apple Music Logo';
        accountLink = 'https://music.apple.com/login';
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    variant="fullWidth"
                >
                    <Tab label="About Me" {...a11yProps(0)} />
                    <Tab label="Platform" {...a11yProps(1)} />
                    <Tab label="Devices" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <Box sx={{ padding: 2 }}>
                {value === 0 && (
                    <Box>
                        <Stack spacing={2} alignItems="center">
                            <h4 className={styles.tabTitle}>Favorite Artist</h4>
                            <p>{userData.favoriteArtist}</p>
                            <br />
                            <h4 className={styles.tabTitle}>Favorite Song</h4>
                            <p>{userData.favoriteSong}</p>
                            <br />
                            <h4 className={styles.tabTitle}>Favorite Album</h4>
                            <p>{userData.favoriteAlbum}</p>
                            <br />
                        </Stack>
                    </Box>
                )}
                {value === 1 && (
                    <Box>
                        <Stack spacing={2} alignItems="center">
                            {userData.private ? (
                                <p>
                                    This user is private, so you can't see their
                                    music platform information.
                                </p>
                            ) : (
                                <>
                                    <Image
                                        src={platform}
                                        alt={alt}
                                        width="300"
                                        height="150"
                                        className={styles.platformImage}
                                        priority
                                    />
                                    <Button
                                        variant="contained"
                                        href={accountLink}
                                    >
                                        Account
                                    </Button>
                                </>
                            )}
                        </Stack>
                    </Box>
                )}
                {value === 2 && (
                    <Box>
                        <Stack spacing={2} alignItems="center">
                            {userData.private ? (
                                <p>
                                    This user is private, so you can't see their
                                    device information.
                                </p>
                            ) : (
                                <>
                                    <p>Insert Device Information?</p>
                                </>
                            )}
                        </Stack>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default function OtherProfile() {
    const [userData, setUserData] = useState(null);

    const router = useRouter();
    const { username } = router.query;

    // Fetch values from database
    useEffect(() => {
        async function fetchData() {
            try {
                // Get User Data first
                const { data } = await NetworkAPI.get(
                    '/api/users/profileInfo',
                    {
                        username,
                    }
                );
                setUserData(data);
            } catch (err) {
                Dialog.alert({
                    title: 'Error',
                    message: `An error occurred while fetching profile data: ${err.message}.`,
                });
            }
        }
        // Have to check because on first render, all query parameters are undefined
        if (router.isReady) fetchData();
    }, [username, router.isReady]);

    if (!userData) return '';

    return (
        <div className={inter.className}>
            <Head>
                <title>Profile</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <section>
                    <div className={styles.picture}>
                        <Avatar alt="NS" sx={{ width: 150, height: 150 }}>
                            {username[0].toUpperCase()}
                        </Avatar>
                    </div>
                </section>
                <div className={styles.card}>
                    <h4 className={styles.cardTitle}>{username}</h4>
                </div>
                <div className={styles.cardText}>{userData.bio}</div>
                <BasicTabs userData={userData} />
            </main>
            <Header title="Profile" />
            <BottomNav />
        </div>
    );
}

function Header({ title }) {
    return (
        <div className={styles.header}>
            <h1>{title}</h1>
        </div>
    );
}
