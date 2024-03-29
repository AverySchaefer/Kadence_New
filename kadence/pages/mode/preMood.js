import styles from '@/styles/PreMood.module.css';
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
import { PageLayout } from '@/components/';
import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/router';

const theme = createTheme({
    palette: {
        primary: {
            main: '#69e267',
        },
    },
});

export default function MoodModePage() {
    const [activeMood, setActiveMood] = useState('');
    const [waitToSave, setWaitToSave] = useState(false);
    useEffect(() => {
        setActiveMood(localStorage.getItem('mood').toLowerCase());
        setWaitToSave(localStorage.getItem('waitSave'));
    }, []);
    const selectedColor = '#69e267';
    const unselectedColor = '#ffffff';

    const [happyIconColor, setHappyIconColor] = useState(unselectedColor);
    const [sadIconColor, setSadIconColor] = useState(unselectedColor);
    const [angryIconColor, setAngryIconColor] = useState(unselectedColor);
    const [RelaxedIconColor, setRelaxedIconColor] = useState(unselectedColor);
    const [energeticIconColor, setEnergeticIconColor] =
        useState(unselectedColor);
    const [romanticIconColor, setRomanticIconColor] = useState(unselectedColor);
    const [melancholyIconColor, setMelancholyIconColor] =
        useState(unselectedColor);
    const [numSongs, setNumSongs] = useState(20);
    const [songs, setSongs] = useState(null);

    const router = useRouter();

    function MakeSong(name, art, key) {
        this.name = name;
        this.art = art;
        this.key = key;
    }

    // TODO: Remove this when it gets used
    // eslint-disable-next-line no-unused-vars
    const getAndSaveRecommendations = async () => {
        const moodMode = '/api/generation/mood?';
        const res = await fetch(
            moodMode +
                new URLSearchParams({
                    chosenMood: activeMood,
                    playlistLength: numSongs,
                    username: localStorage.getItem('username'),
                })
        );
        const playlistURIs = await res.json();

        /* NEED TO ADD A SAVE PREFERENCE */
        const saveRoute = '/api/generation/save';
        const saveRes = await fetch(saveRoute, {
            method: 'POST',
            body: JSON.stringify({
                playlistName: 'Kadence Mood Mode',
                playlistArray: playlistURIs,
            }),
        });
        const playlistID = await saveRes.json();

        const dequeueRoute = '/api/spotify/clearQueue';
        await fetch(dequeueRoute, {
            method: 'POST',
        });

        const queueRoute = '/api/spotify/queue';
        for (let i = 0; i < playlistURIs.length; i++) {
            fetch(queueRoute, {
                method: 'POST',
                body: JSON.stringify({
                    songURI: playlistURIs[i],
                }),
            });
        }

        const playlistRoute = '/api/spotify/getPlaylist?';
        const playlistRes = await fetch(
            playlistRoute +
                new URLSearchParams({
                    playlistID,
                })
        );

        const songNames = [];
        const playlistItems = await playlistRes.json();
        let playlistSongs = playlistItems.items[0].track.name;
        songNames.push(
            new MakeSong(
                playlistItems.items[0].track.name,
                playlistItems.items[0].track.album.images[0].url,
                0
            )
        );
        for (let j = 1; j < playlistItems.items.length; j++) {
            playlistSongs = playlistSongs.concat(', ');
            const songName = playlistItems.items[j].track.name;
            playlistSongs = playlistSongs.concat(songName);
            songNames.push(
                new MakeSong(
                    songName,
                    playlistItems.items[j].track.album.images[0].url,
                    j
                )
            );
        }
        setSongs(songNames);
    };

    const getRecommendations = async (numberOfSongs, currentMood) => {
        const moodMode = '/api/generation/mood?';
        console.log(numberOfSongs, currentMood);
        const res = await fetch(
            moodMode +
                new URLSearchParams({
                    chosenMood: currentMood,
                    playlistLength: numberOfSongs,
                    username: localStorage.getItem('username'),
                })
        );
        const playlistURIs = await res.json();
        localStorage.setItem('playlistURIs', JSON.stringify(playlistURIs));

        const dequeueRoute = '/api/spotify/clearQueue';
        const dequeueRes = await fetch(dequeueRoute, {
            method: 'POST',
        });
        console.log(dequeueRes);

        const queueRoute = '/api/spotify/queue';
        for (let i = 0; i < playlistURIs.length; i++) {
            // TODO: Fix this
            // eslint-disable-next-line no-await-in-loop
            fetch(queueRoute, {
                method: 'POST',
                body: JSON.stringify({
                    songURI: playlistURIs[i],
                }),
            });
        }

        const songNames = [];
        const getQueueRoute = '/api/spotify/getQueue';
        const queueRes = await fetch(getQueueRoute);
        const queueItems = await queueRes.json();
        let queueSongs = queueItems.queue[0].name;
        songNames.push(
            new MakeSong(
                queueItems.queue[0].name,
                queueItems.queue[0].album.images[0].url,
                0
            )
        );

        for (let j = 1; j < numberOfSongs; j++) {
            queueSongs = queueSongs.concat(', ');
            const songName = queueItems.queue[j].name;
            queueSongs = queueSongs.concat(songName);
            songNames.push(
                new MakeSong(
                    songName,
                    queueItems.queue[j].album.images[0].url,
                    j
                )
            );
        }
        setSongs(songNames);
    };

    const generateClick = (save) => {
        if (save === 'true') {
            getRecommendations(numSongs, activeMood);
        } else {
            getAndSaveRecommendations();
        }
    };

    const initializeMood = (currentMood) => {
        switch (currentMood) {
            case 'happy':
                setHappyIconColor(selectedColor);
                break;
            case 'sad':
                setSadIconColor(selectedColor);
                break;
            case 'angry':
                setAngryIconColor(selectedColor);
                break;
            case 'relaxed':
                setRelaxedIconColor(selectedColor);
                break;
            case 'energetic':
                setEnergeticIconColor(selectedColor);
                break;
            case 'romantic':
                setRomanticIconColor(selectedColor);
                break;
            case 'melancholy':
                setMelancholyIconColor(selectedColor);
                break;
            default:
                break;
        }
    };

    const changeMood = (mood) => {
        switch (activeMood) {
            case 'happy':
                setHappyIconColor(unselectedColor);
                break;
            case 'sad':
                setSadIconColor(unselectedColor);
                break;
            case 'angry':
                setAngryIconColor(unselectedColor);
                break;
            case 'relaxed':
                setRelaxedIconColor(unselectedColor);
                break;
            case 'energetic':
                setEnergeticIconColor(unselectedColor);
                break;
            case 'romantic':
                setRomanticIconColor(unselectedColor);
                break;
            case 'melancholy':
                setMelancholyIconColor(unselectedColor);
                break;
            default:
                break;
        }
        switch (mood) {
            case 'happy':
                setHappyIconColor(selectedColor);
                break;
            case 'sad':
                setSadIconColor(selectedColor);
                break;
            case 'angry':
                setAngryIconColor(selectedColor);
                break;
            case 'relaxed':
                setRelaxedIconColor(selectedColor);
                break;
            case 'energetic':
                setEnergeticIconColor(selectedColor);
                break;
            case 'romantic':
                setRomanticIconColor(selectedColor);
                break;
            case 'melancholy':
                setMelancholyIconColor(selectedColor);
                break;
            default:
                break;
        }
        setActiveMood(mood);
    };

    useEffect(() => {
        initializeMood(activeMood);
    }, [activeMood, waitToSave]);
    return (
        <PageLayout title="Mood Mode" prevLink="/home">
            <p>What mood should your playlist be?</p>
            <Card className={styles.moodsContainer}>
                <Button
                    sx={{ borderRadius: 3, height: 70 }}
                    startIcon={
                        <FontAwesomeIcon
                            icon={faFaceSmile}
                            color={happyIconColor}
                            style={{ width: '45px', height: '45px' }}
                        />
                    }
                    className={`${styles.moodButton}`}
                    onClick={() => changeMood('happy')}
                >
                    Happy
                </Button>
                <Button
                    sx={{ borderRadius: 3 }}
                    startIcon={
                        <FontAwesomeIcon
                            icon={faFaceFrown}
                            color={sadIconColor}
                            style={{ width: '45px', height: '45px' }}
                        />
                    }
                    className={`${styles.moodButton}`}
                    onClick={() => changeMood('sad')}
                >
                    Sad
                </Button>
                <Button
                    sx={{ borderRadius: 3 }}
                    startIcon={
                        <FontAwesomeIcon
                            icon={faFaceAngry}
                            color={angryIconColor}
                            style={{ width: '45px', height: '45px' }}
                        />
                    }
                    className={`${styles.moodButton}`}
                    onClick={() => changeMood('angry')}
                >
                    Angry
                </Button>
                <Button
                    sx={{ borderRadius: 3 }}
                    startIcon={
                        <FontAwesomeIcon
                            icon={faCouch}
                            color={RelaxedIconColor}
                            style={{ width: '45px', height: '45px' }}
                        />
                    }
                    className={`${styles.moodButton}`}
                    onClick={() => changeMood('relaxed')}
                >
                    Relaxed
                </Button>
                <Button
                    sx={{ borderRadius: 3 }}
                    startIcon={
                        <FontAwesomeIcon
                            icon={faBolt}
                            color={energeticIconColor}
                            style={{ width: '45px', height: '45px' }}
                        />
                    }
                    className={`${styles.moodButton}`}
                    onClick={() => changeMood('energetic')}
                >
                    Energetic
                </Button>
                <Button
                    sx={{ borderRadius: 3 }}
                    startIcon={
                        <FontAwesomeIcon
                            icon={faHeart}
                            color={romanticIconColor}
                            style={{ width: '45px', height: '45px' }}
                        />
                    }
                    className={`${styles.moodButton}`}
                    onClick={() => changeMood('romantic')}
                >
                    Romantic
                </Button>
                <Button
                    sx={{ borderRadius: 3 }}
                    startIcon={
                        <FontAwesomeIcon
                            icon={faCloudRain}
                            color={melancholyIconColor}
                            style={{ width: '45px', height: '45px' }}
                        />
                    }
                    className={`${styles.moodButton}`}
                    onClick={() => changeMood('melancholy')}
                >
                    Melancholy
                </Button>
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
                <Stack alignItems="center" spacing={2}>
                    <Button
                        variant="contained"
                        sx={{ borderRadius: 3, width: '100%' }}
                        className={`${styles.generateButton}`}
                        onClick={() => generateClick(waitToSave)}
                    >
                        Generate Playlist
                    </Button>
                </Stack>
                <br />
                {songs && (
                    <>
                        <div className={styles.songDisplay}>
                            <h3>Your Playlist:</h3>
                            <div className={styles.resultsContainer}>
                                <div className={styles.songResults}>
                                    {songs.map((song) => (
                                        <div
                                            key={song.key}
                                            className={styles.songContainer}
                                        >
                                            <div
                                                className={
                                                    styles.albumArtContainer
                                                }
                                            >
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
                        <br />
                        <Stack alignItems="center" spacing={2}>
                            <Button
                                variant="contained"
                                sx={{ borderRadius: 3, width: '100%' }}
                                className={`${styles.generateButton}`}
                                onClick={() => router.push('/moodPlayer')}
                            >
                                Kadence Player
                            </Button>
                        </Stack>
                    </>
                )}
            </ThemeProvider>
        </PageLayout>
    );
}
