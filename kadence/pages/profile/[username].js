import Image from 'next/image';
import styles from '@/styles/Profile.module.css';
import { Dialog } from '@capacitor/dialog';
import { useRouter } from 'next/router';
import { Avatar, Box, Button, Stack, Tab, Tabs } from '@mui/material/';
import { useState, useEffect } from 'react';
import NetworkAPI from '@/lib/networkAPI';
import PageLayout from '@/components/PageLayout';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
    if (userData.musicPlatform === 'Spotify') {
        platform = '/Spotify.jpg';
        alt = 'Spotify Logo';
        accountLink = '';
    } else if (userData.musicPlatform === 'Apple Music') {
        platform = '/apple-music.jpg';
        alt = 'Apple Music Logo';
        accountLink = '';
    } else {
        platform = '';
        alt = 'No Selection';
        accountLink = '';
    }

    return (
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
                                <p>{userData.favoriteArtist}</p>
                                <h4 className={styles.tabTitle}>
                                    Favorite Song
                                </h4>
                                <p>{userData.favoriteSong}</p>
                                <h4 className={styles.tabTitle}>
                                    Favorite Album
                                </h4>
                                <p>{userData.favoriteAlbum}</p>
                            </Stack>
                        </Box>
                    )}
                    {value === 1 && (
                        <Box>
                            <Stack spacing={2} alignItems="center">
                                {userData.private && !userData.isFriend ? (
                                    <p>
                                        This user is private, so you cannot see
                                        their music platform information.
                                    </p>
                                ) : (
                                    <>
                                        {userData.musicPlatform ? (
                                            <>
                                                <Image
                                                    src={platform}
                                                    alt={alt}
                                                    width="300"
                                                    height="150"
                                                    className={
                                                        styles.platformImage
                                                    }
                                                    priority
                                                />
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        width: '25ch',
                                                        backgroundColor:
                                                            'button.primary',
                                                        color: '#242b2e',
                                                    }}
                                                    href={accountLink}
                                                >
                                                    View Account
                                                </Button>
                                            </>
                                        ) : (
                                            <p>
                                                This user has not selected a
                                                music platform!
                                            </p>
                                        )}
                                    </>
                                )}
                            </Stack>
                        </Box>
                    )}
                    {value === 2 && (
                        <Box>
                            <Stack spacing={2} alignItems="center">
                                {userData.private && !userData.isFriend ? (
                                    <p>
                                        This user is private, so you cannot see
                                        their music platform information.
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
        </div>
    );
}

export default function OtherProfile() {
    const [userData, setUserData] = useState(null);

    const router = useRouter();
    const { username } = router.query;

    // Determine friend button text
    const isFriend = userData?.isFriend || false;
    const pendingFriend = userData?.isPendingFriend || false;
    const wasSentRequest = userData?.wasSentRequest || false;

    let friendButtonText = 'Add Friend';
    if (pendingFriend) friendButtonText = 'Cancel Friend Request';
    if (isFriend) friendButtonText = 'Remove Friend';

    // Fetch values from database
    useEffect(() => {
        async function fetchData() {
            try {
                // Get User Data first
                const { data } = await NetworkAPI.get(
                    '/api/users/profileInfo',
                    {
                        viewerUsername: localStorage.getItem('username'),
                        vieweeUsername: username,
                    }
                );
                console.log(data);
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

    function updateFriendStatusSend() {
        if (isFriend) {
            // Remove friend
            console.log('Removing friend');
        } else if (pendingFriend) {
            // Cancel request
            console.log('Cancelling Request');
        } else {
            // Add friend
            console.log('Sending friend request');
        }
    }

    function updateFriendStatusReceive(acceptRequest) {
        if (acceptRequest) {
            // Accept pending friend request
            console.log('Accept request');
        } else {
            // Deny pending friend request
            console.log('Deny request');
        }
    }

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

    return (
        <PageLayout title="User Profile">
            <ThemeProvider theme={theme}>
                {userData && (
                    <main className={styles.main}>
                        <section>
                            <div className={styles.picture}>
                                <Avatar
                                    src={userData.profilePic ?? ''}
                                    alt="NS"
                                    sx={{ width: 150, height: 150 }}
                                >
                                    {username[0].toUpperCase()}
                                </Avatar>
                            </div>
                        </section>
                        <div className={styles.card}>
                            <h4 className={styles.cardTitle}>{username}</h4>
                        </div>
                        <div className={styles.cardText}>{userData.bio}</div>
                        {localStorage.getItem('username') !== username && (
                            <Stack
                                justifyContent="center"
                                spacing={2}
                                direction={'row'}
                            >
                                {wasSentRequest ? (
                                    <>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                width: '25ch',
                                                backgroundColor:
                                                    'button.primary',
                                                color: '#242b2e',
                                                textTransform:
                                                    'none !important',
                                            }}
                                            onClick={() =>
                                                updateFriendStatusReceive(true)
                                            }
                                        >
                                            Accept Request
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                width: '25ch',
                                                backgroundColor:
                                                    'button.primary',
                                                color: '#242b2e',
                                                textTransform:
                                                    'none !important',
                                            }}
                                            onClick={() =>
                                                updateFriendStatusReceive(false)
                                            }
                                        >
                                            Deny Request
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            width: '25ch',
                                            backgroundColor: 'button.primary',
                                            color: '#242b2e',
                                            textTransform: 'none !important',
                                        }}
                                        onClick={updateFriendStatusSend}
                                    >
                                        {friendButtonText}
                                    </Button>
                                )}
                            </Stack>
                        )}
                        <BasicTabs userData={userData} />
                    </main>
                )}
            </ThemeProvider>
        </PageLayout>
    );
}
