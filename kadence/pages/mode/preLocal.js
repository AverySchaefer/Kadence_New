import { PageLayout } from '@/components/';
import styles from '@/styles/PreLocal.module.css';
import { Button, Slider, Stack } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const theme = createTheme({
    palette: {
        primary: {
            main: '#69e267',
        },
    },
});

export default function LocalModeSetup() {
    const [waitToSave, setWaitToSave] = useState(false);
    useEffect(() => {
        setWaitToSave(localStorage.getItem('waitSave'));
    }, []);

    const [numSongs, setNumSongs] = useState(20);
    const [songs /* , setSongs */] = useState(null);

    const router = useRouter();

    /* function MakeSong(name, art, key) {
        this.name = name;
        this.art = art;
        this.key = key;
    }

    const getAndSaveRecommendations = async () => {
        const localMode = 'api/generation/local?';
    };

    const getRecommendations = async (numberOfSongs) => {
        const localMode = 'api/generation/local?';
    }; */

    const generateClick = (save) => {
        if (save === 'true') {
            // getRecommendations(numSongs);
        } else {
            // getAndSaveRecommendations();
        }
    };

    return (
        <PageLayout title="Local Artist Mode" prevLink="/home">
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
