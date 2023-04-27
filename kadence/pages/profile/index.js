/* eslint-disable no-nested-ternary */
import * as React from 'react';
import Image from 'next/image';
import styles from '@/styles/Profile.module.css';
import { Dialog } from '@capacitor/dialog';
import { useRouter } from 'next/router';
import { Avatar, Box, Button, Stack, Tab, Tabs } from '@mui/material/';
import NetworkAPI from '@/lib/networkAPI';
import PageLayout from '@/components/PageLayout';
import { signOut } from 'next-auth/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useState, useEffect, useRef } from 'react';

const allowedImageExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function BasicTabs({ musicPlatform, deviceName, activityLog }) {
    const [value, setValue] = useState(0);
    const router = useRouter();
    const theme = createTheme({
        palette: {
            background: {
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

    const handleDisconnect = () => {
        console.log('hi');
        try {
            const userData = {
                username: localStorage.getItem('username'),
                deviceName: '',
            };
            NetworkAPI.patch('/api/users/update', userData);
            localStorage.setItem('authorization_code', '');
            localStorage.setItem('access_token', '');
            localStorage.setItem('refresh_token', '');
            router.reload();
        } catch (err) {
            Dialog.alert({
                title: 'Error Occurred',
                message: `Error occurred while saving: ${err.message}`,
            });
        }
    }

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
        useLink = '/spotify/display';
        accountLink = 'https://open.spotify.com/';
    } else if (musicPlatform === 'Apple Music') {
        platform = '/apple-music.jpg';
        alt = 'Apple Music Logo';
        accountLink = 'https://music.apple.com/login';
        useLink = '/apple/display';
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
                            <Tab label="Activity" {...a11yProps(0)} />
                            <Tab label="Platform" {...a11yProps(1)} />
                            <Tab label="Devices" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <Box sx={{ padding: 2 }}>
                        {value === 0 && (
                            <Box>
                                {activityLog.length > 0 && (
                                    <div className={styles.activityContainer}>
                                        <div className={styles.activities}>
                                            {activityLog.map((activity) => (
                                                <div
                                                    key={activity.timestamp}
                                                    className={styles.activity}
                                                >
                                                    <p>
                                                        {`You`}
                                                        {activity.actionType === 'gen'
                                                            ? ` generated a playlist in ${activity.genMode} mode. ${activity.timestamp}`
                                                            : activity.actionType === 'save' ? ` saved a playlist in ${activity.genMode} mode called ${activity.saved}. ${activity.timestamp}` :
                                                                ` became friends with ${activity.friend}. ${activity.timestamp}`}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {activityLog.length === 0 && (
                                    <p>No activity to display</p>
                                )}
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
                                                className={styles.button}
                                                onClick={() =>
                                                    router.push(useLink)
                                                }
                                            >
                                                Manage Platform
                                            </Button>
                                            <Button
                                                variant="contained"
                                                className={styles.button}
                                                href={accountLink}
                                                target="_blank"
                                            >
                                                Open {musicPlatform}
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        variant="contained"
                                        className={styles.button}
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
                                                onClick={handleDisconnect}
                                                className={styles.button}
                                            >
                                                Disconnect
                                            </Button>
                                        </>
                                    )}
                                    {!deviceName && (
                                        <>
                                            <Button
                                                variant="contained"
                                                className={styles.button}
                                                onClick={() =>
                                                    router.push('/fitbit')
                                                }
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
    const [bio, setBio] = useState('Something about me...');
    const [musicPlatform, setMusicPlatform] = useState('Spotify');
    const [profilePic, setProfilePic] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [activity, setActivity] = useState([]);

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
                setBio(userData.bio);
                setMusicPlatform(userData.musicPlatform);
                setProfilePic(userData.profilePic ?? '');
                setDeviceName(userData.deviceName ?? '');
            } catch (err) {
                Dialog.alert({
                    title: 'Error',
                    message: `An error occurred while fetching your data: ${err.message}. Some defaults have been set in their place.`,
                });
            }
            try {
                // Get activity data
                NetworkAPI.get('/api/activity/getLogs', {
                    username: localStorage.getItem('username'),
                }).then((res) => {
                    setActivity(res.data);
                });
            } catch (err) {
                Dialog.alert({
                    title: 'Error',
                    message: `An error occurred while fetching activity data: ${err.message}.`,
                });
            } finally {
                setLoaded(true);
            }
        }
        async function connectFitbit() {
            const fromFitbit = localStorage.getItem('fromFitbit');
            if (fromFitbit === 'true') {
                const url = new URLSearchParams(window.location.search);
                const authorizationCode = url.get('code');
                const state = url.get('state');
                const sentState = localStorage.getItem('state');

                // Compare state values to protect against CSRF
                if (state === sentState) {
                    const codeVerifier = localStorage.getItem('pkceVerifier');
                    try {
                        const response = await NetworkAPI.post(
                            '/api/fitbit/getTokens',
                            {
                                authorizationCode,
                                codeVerifier,
                            }
                        );
                        localStorage.setItem(
                            'authorization_code',
                            authorizationCode
                        );
                        // console.log(response);
                        // console.log(response.data.access_token);
                        localStorage.setItem(
                            'access_token',
                            response.data.access_token
                        );
                        // console.log("localStorage: " + localStorage.getItem('access_token'));
                        localStorage.setItem(
                            'refresh_token',
                            response.refresh_token
                        );
                    } catch (err) {
                        Dialog.alert({
                            title: 'Error',
                            message: `An error occurred while authorizing to Fitbit: ${err.message}.`,
                        });
                    }
                }
                localStorage.setItem('fromFitbit', 'false');
            }
        }
        fetchData();
        connectFitbit();
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
                                alt="profile picture"
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
                        musicPlatform={musicPlatform}
                        deviceName={deviceName}
                        activityLog={activity}
                    />
                </main>
            )}
        </PageLayout>
    );
}
