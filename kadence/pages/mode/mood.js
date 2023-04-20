import { Button, Card, Slider, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFaceSmile,
    faFaceFrown,
    faFaceAngry,
    faCouch,
    faBolt,
    faHeart,
    faCloudRain,
} from '@fortawesome/free-solid-svg-icons';
import { MusicPlayer, PageLayout } from '@/components/';
import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/router';
import NetworkAPI from '@/lib/networkAPI';
import useMusicKit from '@/lib/useMusicKit';
import { queueSongs } from '@/lib/apple/AppleAPI';
import { Dialog } from '@capacitor/dialog';
import styles from '@/styles/Mood.module.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#69e267',
        },
    },
});

const selectedColor = '#69e267';
const unselectedColor = '#ffffff';
const moods = [
    { name: 'happy', icon: faFaceSmile },
    { name: 'sad', icon: faFaceFrown },
    { name: 'angry', icon: faFaceAngry },
    { name: 'relaxed', icon: faCouch },
    { name: 'energetic', icon: faBolt },
    { name: 'romantic', icon: faHeart },
    { name: 'melancholy', icon: faCloudRain },
];

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

export default function MoodModePage() {
    const [activeMood, setActiveMood] = useState('');
    const [waitToSave, setWaitToSave] = useState(false);
    const [platform, setPlatform] = useState(null);
    useEffect(() => {
        setActiveMood(localStorage.getItem('mood').toLowerCase());
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
            '/api/generation/mood',
            {
                chosenMood: activeMood,
                playlistLength: numSongs,
                username: localStorage.getItem('username'),
            }
        );

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
        await NetworkAPI.post('/api/activity/insert', {
            username: localStorage.getItem('username'),
            timestamp: new Date().toLocaleString(),
            actionType: 'save',
            friend: null,
            genMode: 'mood',
            saved: `Kadence Mood Mode - ${activeMood.toUpperCase()}`,
        }); 

        if (platform === 'Spotify') {
            const saveRoute = '/api/generation/save';
            await fetch(saveRoute, {
                method: 'POST',
                body: JSON.stringify({
                    playlistName: `Kadence Mood Mode - ${activeMood.toUpperCase()}`,
                    playlistArray: playlistURIs,
                }),
            });
        } else if (platform === 'apple') {
            const saveRoute = '/api/apple/saveToPlaylist';
            await NetworkAPI.post(saveRoute, {
                name: `Kadence Mood Mode - ${activeMood.toUpperCase()}`,
                appleURIs: playlistURIs,
                appleUserToken: music.musicUserToken,
            });
        }
    }

    async function queueURIs(playlistURIs) {
        if (platform === 'Spotify') {
            await NetworkAPI.put('/api/spotify/play', {
                uris: playlistURIs,
            });
            await NetworkAPI.put('/api/spotify/pause');
        } else if (platform === 'apple') {
            await queueSongs(music, playlistURIs);
        }
    }

    async function handleGenerateClick() {
        await NetworkAPI.post('/api/activity/insert', {
            username: localStorage.getItem('username'),
            timestamp: new Date().toLocaleString(),
            actionType: 'gen',
            friend: null,
            genMode: 'mood',
            saved: null,
        }); 

        const recommendations = await getRecommendedSongs();

        await queueURIs(recommendations.map((rec) => rec.uri));

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
                async () => {
                    Dialog.alert({
                        title: 'Success',
                        message: 'Saved playlist successfully.',
                    });
                    setAlreadySavedPlaylist(true);
                    setConfirmedPlaylist(true);
                    if (platform === 'apple') {
                        await music.play();
                    } else if (platform === 'spotify') {
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
        <PageLayout includeNav={false} title="Mood Player">
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
                                () => {
                                    Dialog.alert({
                                        title: 'Success',
                                        message: 'Saved playlist successfully.',
                                    });
                                    setAlreadySavedPlaylist(true);
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
                            await NetworkAPI.put('/api/spotify/pause');
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
        <PageLayout title="Mood Mode" prevLink="/home">
            <p>What mood should your playlist be?</p>
            <Card className={styles.moodsContainer}>
                {moods.map((mood) => (
                    <Button
                        key={mood.name}
                        sx={{ borderRadius: 3 }}
                        startIcon={
                            <FontAwesomeIcon
                                icon={mood.icon}
                                color={
                                    activeMood === mood.name
                                        ? selectedColor
                                        : unselectedColor
                                }
                                style={{ width: '45px', height: '45px' }}
                            />
                        }
                        className={`${styles.moodButton}`}
                        onClick={() => setActiveMood(mood.name)}
                    >
                        {mood.name}
                    </Button>
                ))}
            </Card>
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
