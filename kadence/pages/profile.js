import * as React from 'react';
import Image from 'next/image';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import Head from 'next/head';
import styles from '@/styles/Profile.module.css';
import { BottomNav } from '@/components/';
import { Inter } from '@next/font/google';
import { Dialog } from '@capacitor/dialog';
import { useRouter } from 'next/router';
import { Avatar, Box, Button, Fab, Stack, Tab, Tabs } from '@mui/material/';
import NetworkAPI from '@/lib/networkAPI';

const inter = Inter({ subsets: ['latin'] });

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function BasicTabs({ favArtist, favSong, favAlbum, musicPlatforms }) {
    const [value, setValue] = React.useState(0);
    const router = useRouter();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClick = () => {
        router.push('/platform');
    };

    let platform = "";
    let alt = "";
    let accountLink = "";
    if (musicPlatforms === "Spotify") {
        platform = "/Spotify.jpg";
        alt = "Spotify Logo";
        accountLink = "https://www.spotify.com/us/account/apps/"
    } else if (musicPlatforms === "Apple Music") {
        platform = "/apple-music.jpg";
        alt = "Apple Music Logo";
        accountLink = "https://music.apple.com/login";
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
                            <p>{favArtist}</p>
                            <br />
                            <h4 className={styles.tabTitle}>Favorite Song</h4>
                            <p>{favSong}</p>
                            <br />
                            <h4 className={styles.tabTitle}>Favorite Album</h4>
                            <p>{favAlbum}</p>
                            <br />
                            <Button variant="contained" onClick={() => router.push('/changeProfile')}>Edit</Button>
                        </Stack>
                    </Box>
                )}
                {value === 1 && (
                    <Box>
                        <Stack spacing={2} alignItems="center">
                            <Image
                                src={platform}
                                alt={alt}
                                width="300"
                                height="150"
                                className={styles.platformImage}
                                priority
                            />
                            <Button variant="contained" href={accountLink}>Account</Button>
                            <Button variant="contained" onClick={handleClick}>Change</Button>
                        </Stack>
                    </Box>
                )}
                {value === 2 && (
                    <Box>
                        <Button variant="contained">Connect</Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default function Profile() {
    const [faveArtist, setFaveArtist] = React.useState('Snarky Puppy');
    const [faveAlbum, setFaveAlbum] = React.useState('Lingus');
    const [faveSong, setFaveSong] = React.useState('What About Me?');
    const [bio, setBio] = React.useState('Something about me...');
    const [musicPlatforms, setMusicPlatforms] = React.useState('Spotify');
    const [profilePic, setProfilePic] = React.useState('');

    const [loaded, setLoaded] = React.useState(false);
    
    // Fetch values from database
    React.useEffect(() => {
        async function fetchData() {
            try {
                // Get User Data first
                const { data: userData } = await NetworkAPI.get('/api/users/getUsers', {
                    username: localStorage.getItem('username'),
                });
                setFaveArtist(userData.favoriteArtist);
                setFaveAlbum(userData.favoriteAlbum);
                setFaveSong(userData.favoriteSong);
                setBio(userData.bio);
                setMusicPlatforms(userData.musicPlatforms);
                setProfilePic(userData.profilePic);
            } catch (err) {
                Dialog.alert({
                    title: 'Error',
                    message: `An error occurred while fetching your data: ${err.message}. Some defaults have been set in their place.`,
                });
            } finally {
                setLoaded(true);
            }
        }
        fetchData();
    }, []);

    if (!loaded) return '';

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
                        <Avatar src={profilePic} alt="NS" sx={{ width: 150, height: 150 }}>
                            {localStorage.getItem('username')[0].toUpperCase()}
                        </Avatar>
                    </div>
                </section>
                <div className={styles.card}>
                    <h4 className={styles.cardTitle}>
                        {localStorage.getItem('username')}
                    </h4>
                </div>
                <div className={styles.cardText}>{bio}</div>
                <BasicTabs
                    favArtist={faveArtist}
                    favAlbum={faveAlbum}
                    favSong={faveSong}
                    musicPlatforms={musicPlatforms}
                />
            </main>
            <Header title="Profile" />
            <BottomNav name="profile" />
        </div>
    );
}

function Header({ title }) {
    return (
        <div className={styles.header}>
            <h1>{title}</h1>
            <div className={styles.settingsButton}>
                <Link href="/settings">
                    <Fab size="small" aria-label="settings">
                        <SettingsIcon />
                    </Fab>
                </Link>
            </div>
        </div>
    );
}
