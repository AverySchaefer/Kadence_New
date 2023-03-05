import * as React from 'react';
import Image from 'next/image';
import styles from '@/styles/Profile.module.css';
import { Dialog } from '@capacitor/dialog';
import { useRouter } from 'next/router';
import { Avatar, Box, Button, Stack, Tab, Tabs } from '@mui/material/';
import NetworkAPI from '@/lib/networkAPI';
import Default from '@/lib/default';
import PageLayout from '@/components/PageLayout';
import { signOut } from 'next-auth/react';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function BasicTabs({ favArtist, favSong, favAlbum, musicPlatform }) {
    const [value, setValue] = React.useState(0);
    const router = useRouter();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClick = () => {
        const newPlatformData = {
            username: localStorage.getItem('username'),
            musicPlatform: '',
        };
        try {
            NetworkAPI.patch('/api/users/update', newPlatformData);
        } catch (err) {
            console.log(err);
        } finally {
            signOut({ callbackUrl: '/platform' });
        }
    };

    let platform = '';
    let alt = '';
    let useLink = '';
    let accountLink = '';
    if (musicPlatform === 'Spotify') {
        platform = '/Spotify.jpg';
        alt = 'Spotify Logo';
        accountLink = Default.spotifyPlayerData.songURI;
        useLink = '/spotify/display';
    } else if (musicPlatform === 'Apple Music') {
        platform = '/apple-music.jpg';
        alt = 'Apple Music Logo';
        accountLink = 'https://music.apple.com/login';
        useLink = '/spotify/display';
    } else {
        platform = '';
        alt = 'No platform chosen!';
        accountLink = '';
        useLink = '';
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
                            <Button
                                variant="contained"
                                onClick={() => router.push('/changeProfile')}
                            >
                                Edit
                            </Button>
                        </Stack>
                    </Box>
                )}
                {value === 1 && (
                    <Box>
                        <Stack spacing={2} alignItems="center">
                            {platform && (
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
                                        onClick={() => router.push(useLink)}
                                    >
                                        Configure Account
                                    </Button>
                                    <Button
                                        variant="contained"
                                        href={accountLink}
                                    >
                                        View Account In App
                                    </Button>
                                </>
                            )}
                            <Button variant="contained" onClick={handleClick}>
                                {platform ? 'Change' : 'Choose'} Platform
                            </Button>
                        </Stack>
                    </Box>
                )}
                {value === 2 && (
                    <Box>
                        <Stack spacing={2} alignItems="center">
                            <Button variant="contained">Connect</Button>
                        </Stack>
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
    const [musicPlatform, setMusicPlatform] = React.useState('Spotify');

    const [loaded, setLoaded] = React.useState(false);

    // Fetch values from database
    React.useEffect(() => {
        async function fetchData() {
            try {
                // Get User Data first
                const { data: userData } = await NetworkAPI.get(
                    '/api/users/getUsers',
                    {
                        username: localStorage.getItem('username'),
                    }
                );
                setFaveArtist(userData.favoriteArtist);
                setFaveAlbum(userData.favoriteAlbum);
                setFaveSong(userData.favoriteSong);
                setBio(userData.bio);
                setMusicPlatform(userData.musicPlatform);
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

    return (
        <PageLayout activeTab="profile" title="Profile" includeSettings>
            {loaded && (
                <main className={styles.main}>
                    <section>
                        <div className={styles.picture}>
                            <Avatar alt="NS" sx={{ width: 150, height: 150 }}>
                                {localStorage
                                    .getItem('username')[0]
                                    .toUpperCase()}
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
                        musicPlatform={musicPlatform}
                    />
                </main>
            )}
        </PageLayout>
    );
}
