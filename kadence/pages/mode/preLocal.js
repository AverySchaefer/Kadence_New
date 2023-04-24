import { MusicPlayer, PageLayout } from '@/components/';
import styles from '@/styles/PreLocal.module.css';
import { Button, Slider, Stack } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import NetworkAPI from '@/lib/networkAPI';
import useMusicKit from '@/lib/useMusicKit';
import { queueSongs } from '@/lib/apple/AppleAPI';
import { Dialog } from '@capacitor/dialog';

const theme = createTheme({
    palette: {
        primary: {
            main: '#69e267',
        },
    },
});

function MakeSong(uri, name, art, key) {
    this.uri = uri;
    this.name = name;
    this.art = art;
    this.key = key;
}

function PlaylistView({ songs }) {
    return (
        <div className={styles.songDisplay}>
            <h3>Your Playlist:</h3>
            <div className={styles.resultsContainer}>
                <div className={styles.songResults}>
                    {songs.map((song) => (
                        <div key={song.key} className={styles.songContainer}>
                            <div className={styles.albumArtContainer}>
                                <Image
                                    src={
                                        song.art ??
                                        'https://demofree.sirv.com/nope-not-here.jpg'
                                    }
                                    alt="Album Cover"
                                    width={50}
                                    height={50}
                                />
                            </div>
                            <div className={styles.songName}>
                                <p>{song.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function LocalModeSetup() {
    const [waitToSave, setWaitToSave] = useState(false);
    const [platform, setPlatform] = useState(null);
    useEffect(() => {
        setWaitToSave(localStorage.getItem('waitSave') === 'true');
        setPlatform(localStorage.getItem('platform'));
    }, []);

    const [numSongs, setNumSongs] = useState(20);
    const [songs, setSongs] = useState(null);
    const [confirmedPlaylist, setConfirmedPlaylist] = useState(false);
    const [alreadySavedPlaylist, setAlreadySavedPlaylist] = useState(false);

    const router = useRouter();
    const music = useMusicKit()?.getInstance();

    async function getRecommendedSongs() {
        const { data: playlistObjs } = await NetworkAPI.get(
            '/api/generation/local',
            {
                playlistLength: numSongs,
                username: localStorage.getItem('username'),
            }
        );
        console.log(playlistObjs);

        if (platform === 'apple' && music !== undefined) {
            const { data } = await NetworkAPI.get('/api/apple/conversion', {
                spotifyURIs: JSON.stringify(playlistObjs.map((obj) => obj.uri)),
                appleUserToken: music.musicUserToken,
            });
            return data.appleURIs.map((uri) => ({ uri }));
        }
        if (platform === 'Spotify') {
            return playlistObjs;
        }
        return null;
    }

    async function saveToPlaylist(playlistURIs) {
        const { value, cancelled } = await Dialog.prompt({
            title: 'Playlist Name',
            message: 'What would you like to name your playlist?',
        });

        if (cancelled) return false;

        const playlistName =
            value.trim() || `Kadence Local Mode`;

        await NetworkAPI.post('/api/activity/insert', {
            username: localStorage.getItem('username'),
            timestamp: new Date().toLocaleString(),
            actionType: 'save',
            friend: null,
            genMode: 'local',
            saved: playlistName,
        });    

        if (platform === 'Spotify') {
            const saveRoute = '/api/generation/save';
            await fetch(saveRoute, {
                method: 'POST',
                body: JSON.stringify({
                    playlistName,
                    playlistArray: playlistURIs,
                }),
            });
        } else if (platform === 'apple') {
            const saveRoute = '/api/apple/saveToPlaylist';
            await NetworkAPI.post(saveRoute, {
                name: playlistName,
                appleURIs: playlistURIs,
                appleUserToken: music.musicUserToken,
            });
        }
        return true;
    }

    async function queueURIs(playlistURIs) {
        if (platform === 'Spotify') {
            try {
                await NetworkAPI.put('/api/spotify/play', {
                    uris: playlistURIs,
                });
                await NetworkAPI.put('/api/spotify/pause');
                return true;
            } catch (err) {
                await Dialog.alert({
                    title: 'Spotify Error',
                    message:
                        'Error occurred. Make sure Spotify is open before generating!',
                });
                return false;
            }
        } else if (platform === 'apple') {
            await queueSongs(music, playlistURIs);
            return true;
        }
        return false;
    }

    async function handleGenerateClick() {
        await NetworkAPI.post('/api/activity/insert', {
            username: localStorage.getItem('username'),
            timestamp: new Date().toLocaleString(),
            actionType: 'gen',
            friend: null,
            genMode: 'local',
            saved: null,
        }); 

        const recommendations = await getRecommendedSongs();

        const successfullyQueued = await queueURIs(
            recommendations.map((rec) => rec.uri)
        );
        if (!successfullyQueued) return;

        // Get song info and art for display
        if (platform === 'apple') {
            const songInfoObjs = music.player.queue.items.map((item, idx) => {
                // Not sure why width and height of image would only load in
                // for first song in queue, but this fixed it
                const artwork = item.artworkURL
                    .replace('{w}', 600)
                    .replace('{h}', 600);
                return new MakeSong(item.id, item.title, artwork, idx);
            });
            setSongs(songInfoObjs);
        } else if (platform === 'Spotify') {
            const songInfoObjs = recommendations.map(
                (rec, idx) => new MakeSong(rec.uri, rec.name, rec.artwork, idx)
            );
            setSongs(songInfoObjs);
        }

        if (!waitToSave) {
            saveToPlaylist(recommendations.map((rec) => rec.uri)).then(
                async (saved) => {
                    if (saved) {
                        Dialog.alert({
                            title: 'Success',
                            message: 'Saved playlist successfully.',
                        });
                        setAlreadySavedPlaylist(true);
                    }
                    setConfirmedPlaylist(true);
                    if (platform === 'apple') {
                        await music.play();
                    } else if (platform === 'Spotify') {
                        await NetworkAPI.put('/api/spotify/play');
                    }
                }
            );
        }
    }

    async function handleConfirmClick() {
        if (platform === 'apple') {
            await music.play();
        } else if (platform === 'Spotify') {
            await NetworkAPI.put('/api/spotify/play');
        }
        setConfirmedPlaylist(true);
    }

    return confirmedPlaylist ? (
        // Confirmed playlist, just show player
        <PageLayout includeNav={false} title="Local Mode Player">
            <MusicPlayer size="large" />
            <PlaylistView songs={songs} />
            <Stack
                alignItems="center"
                flexDirection={'row'}
                justifyContent={'space-around'}
            >
                {!alreadySavedPlaylist && (
                    <Button
                        variant="contained"
                        type="submit"
                        sx={{ borderRadius: 3, width: '100%' }}
                        className={`${styles.generateButton}`}
                        onClick={() =>
                            saveToPlaylist(songs.map((song) => song.uri)).then(
                                (saved) => {
                                    if (saved) {
                                        Dialog.alert({
                                            title: 'Success',
                                            message:
                                                'Saved playlist successfully.',
                                        });
                                        setAlreadySavedPlaylist(true);
                                    }
                                }
                            )
                        }
                    >
                        Save Playlist
                    </Button>
                )}
                <Button
                    variant="contained"
                    sx={{ borderRadius: 3 }}
                    className={`${styles.generateButton}`}
                    onClick={async () => {
                        if (platform === 'Spotify') {
                            try {
                                await NetworkAPI.put('/api/spotify/pause');
                            } catch (err) {
                                console.log('Pausing with no device active');
                            }
                        } else if (platform === 'apple') {
                            await queueSongs(music, []);
                            await music.stop();
                        }
                        router.push('/home');
                    }}
                >
                    Exit
                </Button>
            </Stack>
        </PageLayout>
    ) : (
        // Haven't confirmed playlist yet
        <PageLayout title="Local Mode" prevLink="/home">
            <div className={styles.explanation}>
                <p className={styles.explanationTitle}>
                    What is Local Artist Mode?
                </p>
                <p>
                    Local Artist Mode helps you discover atrists in your area.
                    All you have to do is know one artist near you and
                    we&apos;ll do the rest. Play a song from an artist in your
                    area, select how many songs you would like in your playlist,
                    and then press generate. You will be able to view your
                    playlist below once it has been generated.
                </p>
            </div>
            <ThemeProvider theme={theme}>
                <div className={styles.sliderContainer}>
                    <Stack
                        spacing={2}
                        direction="row"
                        sx={{ mb: 1 }}
                        alignItems="center"
                    >
                        <p className={styles.muiSliderLabel}>Length</p>
                        <Slider
                            min={10}
                            step={1}
                            max={30}
                            value={numSongs}
                            onChange={(e) =>
                                setNumSongs(parseInt(e.target.value, 10))
                            }
                        />
                        <p className={styles.muiSliderLabel}>
                            {numSongs} songs
                        </p>
                    </Stack>
                </div>
                {!songs && (
                    <Stack alignItems="center" spacing={2}>
                        <Button
                            variant="contained"
                            sx={{ borderRadius: 3, width: '100%' }}
                            className={`${styles.generateButton}`}
                            onClick={handleGenerateClick}
                        >
                            Generate Playlist
                        </Button>
                    </Stack>
                )}
                {songs && (
                    <>
                        <PlaylistView songs={songs} />
                        <Stack
                            alignItems="center"
                            flexDirection={'row'}
                            justifyContent={'space-around'}
                        >
                            <Button
                                variant="contained"
                                sx={{ borderRadius: 3 }}
                                className={`${styles.generateButton}`}
                                onClick={handleGenerateClick}
                            >
                                Regenerate
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ borderRadius: 3 }}
                                className={`${styles.generateButton}`}
                                onClick={handleConfirmClick}
                            >
                                Confirm
                            </Button>
                        </Stack>
                    </>
                )}
            </ThemeProvider>
        </PageLayout>
    );
}
