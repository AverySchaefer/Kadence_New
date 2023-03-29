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
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';

import { useState, useEffect, useRef } from 'react';

const allowedImageExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function BasicTabs({ favArtist, favSong, favAlbum, musicPlatform, deviceName }) {
    const [value, setValue] = useState(0);
    const router = useRouter();
    const theme = createTheme({
        palette: {
            backgroud: {
                main: '#1e1e1e',
            },
            button: {
                primary: '#69E267',
            },
        },
    });

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

    const handleDeviceConnection = () => {
        console.log("connecting a device");
        window.location.assign('https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23QTD8&scope=activity+cardio_fitness+electrocardiogram+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&code_challenge=vaC5salqWAhM5k50MMvXGPxkTQGyQeLa0NpP_K3689Y&code_challenge_method=S256&state=3j3k386j3x606u7000324b4x4n0b0o06&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Ffitbit');
    }

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
        <ThemeProvider theme={theme}>
            <div className={styles.profileTabs}>
                <Box sx={{ width: '98%', bgcolor: '#222222', borderRadius: 4 }}>
                    <Box
                        sx={{
                            borderTop: 1,
                            borderColor: 'divider',
                            bgcolor: '#1e1e1e',
                            borderRadius: 4,
                        }}
                    >
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="fullWidth"
                            textColor="inherit"
                            TabIndicatorProps={{
                                style: { backgroundColor: '#69E267' },
                            }}
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
                                    <h4 className={styles.tabTitle}>
                                        Favorite Artist
                                    </h4>
                                    <p>{favArtist}</p>
                                    <br />
                                    <h4 className={styles.tabTitle}>
                                        Favorite Song
                                    </h4>
                                    <p>{favSong}</p>
                                    <br />
                                    <h4 className={styles.tabTitle}>
                                        Favorite Album
                                    </h4>
                                    <p>{favAlbum}</p>
                                    <br />
                                    <br />
                                    <Button
                                        variant="contained"
                                        sx={{
                                            width: '25ch',
                                            backgroundColor: 'button.primary',
                                        }}
                                        onClick={() =>
                                            router.push('/changeProfile')
                                        }
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
                                                sx={{
                                                    width: '25ch',
                                                    backgroundColor:
                                                        'button.primary',
                                                }}
                                                onClick={() =>
                                                    router.push(useLink)
                                                }
                                            >
                                                Kadence Player
                                            </Button>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    width: '25ch',
                                                    backgroundColor:
                                                        'button.primary',
                                                }}
                                                href={accountLink}
                                            >
                                                Open {musicPlatform}
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        variant="contained"
                                        sx={{
                                            width: '25ch',
                                            backgroundColor: 'button.primary',
                                        }}
                                        onClick={handleClick}
                                    >
                                        {platform ? 'Change' : 'Choose'}{' '}
                                        Platform
                                    </Button>
                                </Stack>
                            </Box>
                        )}
                        {value === 2 && (
                            <Box>
                                <Stack spacing={2} alignItems="center">
                                    {deviceName && (
                                        <>
                                            <Image
                                                src="Fitbit-Symbol.jpg"
                                                alt="Fitbit Logo"
                                                width="300"
                                                height="150"
                                                className={styles.platformImage}
                                                priority
                                            />
                                            <p>{deviceName} is connected!</p>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    width: '25ch',
                                                    backgroundColor: 'button.primary',
                                                    '&:active': {
                                                        backgroundColor:
                                                            'button.primary',
                                                    },
                                                }}
                                            >
                                                Disconnect
                                            </Button>
                                        </>
                                    )}
                                    {!deviceName && (
                                        <>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    width: '25ch',
                                                    backgroundColor: 'button.primary',
                                                    '&:active': {
                                                        backgroundColor:
                                                            'button.primary',
                                                    },
                                                }}
                                                onClick={() => router.push("/fitbit")}
                                            >
                                                Connect
                                            </Button>
                                        </>
                                    )}
                                </Stack>
                            </Box>
                        )}
                    </Box>
                </Box>
            </div>
        </ThemeProvider>
    );
}

export default function Profile() {
    const [faveArtist, setFaveArtist] = useState('Snarky Puppy');
    const [faveAlbum, setFaveAlbum] = useState('Lingus');
    const [faveSong, setFaveSong] = useState('What About Me?');
    const [bio, setBio] = useState('Something about me...');
    const [musicPlatform, setMusicPlatform] = useState('Spotify');
    const [profilePic, setProfilePic] = useState('');
    const [deviceName, setDeviceName] = useState('');

    const [loaded, setLoaded] = useState(false);

    // Fetch values from database
    useEffect(() => {
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
                setProfilePic(userData.profilePic ?? '');
                setDeviceName(userData.deviceName ?? '');
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

    // References an HTML element (used for file input that is invisible)
    const uploadInput = useRef(null);

    // Function that opens a file chooser dialog to select picture
    // Called when pressing picture icon on profile page
    function promptUserForProfilePicture() {
        const input = uploadInput?.current;
        if (input) {
            input.click();
        }
    }

    // Actually handles the picture change
    // Called when file input is virtually clicked on above
    function handleProfilePictureChange(e) {
        const selectedFiles = e.target.files;
        if (selectedFiles.length > 0) {
            const file = selectedFiles[0];
            const filename = file.name;
            const dotIndex = filename.lastIndexOf('.');
            const extension = filename.substr(dotIndex);
            if (allowedImageExtensions.includes(extension)) {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    const srcData = fileReader.result;
                    setProfilePic(srcData);
                    NetworkAPI.patch('/api/users/update', {
                        username: localStorage.getItem('username'),
                        profilePic: srcData,
                    });
                };
                fileReader.readAsDataURL(file);
            }
        }
    }

    return (
        <PageLayout activeTab="profile" title="Profile" includeUpperRightIcon>
            {loaded && (
                <main className={styles.main}>
                    <section>
                        <div
                            className={styles.picture}
                            style={{ position: 'relative' }}
                            onClick={promptUserForProfilePicture}
                        >
                            <Avatar
                                src={profilePic}
                                alt="NS"
                                sx={{ width: 150, height: 150 }}
                                style={{ objectFit: 'cover' }}
                            >
                                {localStorage
                                    .getItem('username')[0]
                                    .toUpperCase()}
                            </Avatar>
                            <input
                                ref={uploadInput}
                                type="file"
                                accept={allowedImageExtensions.join(', ')}
                                style={{ display: 'none' }}
                                onChange={handleProfilePictureChange}
                            />
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
                        deviceName={deviceName}
                    />
                </main>
            )}
        </PageLayout>
    );
}
