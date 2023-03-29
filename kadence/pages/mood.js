import styles from '@/styles/MoodPage.module.css';
import { Button, Card, Slider, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faFaceFrown, faFaceAngry, faCouch, faBolt, faHeart, faCloudRain } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { PageLayout } from '@/components/';
import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: '#69e267',
      },
    },
  });

export default function moodModePage() {
    const [activeMood, setActiveMood] = useState(null);
    useEffect(() => {
        setActiveMood(localStorage.getItem('mood'));
    }, []);
    const router = useRouter();
    const selectedColor = '#69e267';
    const unselectedColor = '#ffffff';

    const [happyIconColor, setHappyIconColor] = useState(unselectedColor);
    const [sadIconColor, setSadIconColor] = useState(unselectedColor);
    const [angryIconColor, setAngryIconColor] = useState(unselectedColor);
    const [chillIconColor, setChillIconColor] = useState(unselectedColor);
    const [energeticIconColor, setEnergeticIconColor] = useState(unselectedColor);
    const [romanticIconColor, setRomanticIconColor] = useState(unselectedColor);
    const [melancholyIconColor, setMelancholyIconColor] = useState(unselectedColor);
    const [numSongs, setNumSongs] = useState(20);
    const [generatedItems, setAllItems] = useState('');

    const getAndSaveRecommendations = async () => {
        const moodMode = '/api/generation/mood?';
        const res = await fetch(moodMode + new URLSearchParams({
            chosenMood: activeMood,
            playlistLength: numSongs,
            username: localStorage.getItem('username'),
        }));
        const playlistURIs = await res.json();

        /* NEED TO ADD A SAVE PREFERENCE */
        const saveRoute = '/api/generation/save'
        const saveRes = await fetch(saveRoute, {
            method: 'POST',
            body: JSON.stringify({
                playlistName: "Kadence Mood Mode",
                playlistArray: playlistURIs,
            })
        });
        const playlistID = await saveRes.json();

        const queueRoute = '/api/spotify/queue'
        for (let i = 0; i < playlistURIs.length; i++) {
            fetch(queueRoute, {
                method: 'POST',
                body: JSON.stringify({
                    songURI: playlistURIs[i]
                })
            });
        }

        const playlistRoute = '/api/spotify/getPlaylist?'
        const playlistRes = await fetch(playlistRoute + new URLSearchParams({
            playlistID: playlistID,
        }));
        const playlistItems = await playlistRes.json();
        let playlistSongs = playlistItems.items[0].track.name;
        for (let j = 1; j < playlistItems.items.length; j++) {
            playlistSongs = playlistSongs.concat(', ');
            const songName = playlistItems.items[j].track.name;
            playlistSongs = playlistSongs.concat(songName);
        }
        setAllItems(playlistSongs);
    };

    const getRecommendations = async (numSongs, activeMood) => {
        const moodMode = '/api/generation/mood?';
        console.log(numSongs, activeMood);
        const res = await fetch(moodMode + new URLSearchParams({
            chosenMood: activeMood,
            playlistLength: numSongs,
            username: localStorage.getItem('username'),
        }));
        const playlistURIs = await res.json();

        const queueRoute = '/api/spotify/queue'
        for (let i = 0; i < playlistURIs.length; i++) {
            await fetch(queueRoute, {
                method: 'POST',
                body: JSON.stringify({
                    songURI: playlistURIs[i]
                })
            });
        }

        const getQueueRoute = '/api/spotify/getQueue'
        const queueRes = await fetch(getQueueRoute);
        const queueItems = await queueRes.json();
        let queueSongs = queueItems.queue[0].name;
        for (let j = 1; j < queueItems.queue.length; j++) {
            queueSongs = queueSongs.concat(', ');
            const songName = queueItems.queue[j].name;
            queueSongs = queueSongs.concat(songName);
        }
        setAllItems(queueSongs);
    }

    const initializeMood = (activeMood) => {
        switch(activeMood) {
            case 'Happy':
                setHappyIconColor(selectedColor);
                break;
            case 'Sad':
                setSadIconColor(selectedColor);
                break;
            case 'Angry':
                setAngryIconColor(selectedColor);
                break;
            case 'Chill':
                setChillIconColor(selectedColor);
                break;
            case 'Energetic':
                setEnergeticIconColor(selectedColor);
                break;
            case 'Romantic':
                setRomanticIconColor(selectedColor);
                break;
            case 'Melancholy':
                setMelancholyIconColor(selectedColor);
                break;
        }
    };
    
    const changeMood = (mood) => {
        switch(activeMood) {
            case 'Happy':
                setHappyIconColor(unselectedColor);
                break;
            case 'Sad':
                setSadIconColor(unselectedColor);
                break;
            case 'Angry':
                setAngryIconColor(unselectedColor);
                break;
            case 'Chill':
                setChillIconColor(unselectedColor);
                break;
            case 'Energetic':
                setEnergeticIconColor(unselectedColor);
                break;
            case 'Romantic':
                setRomanticIconColor(unselectedColor);
                break;
            case 'Melancholy':
                setMelancholyIconColor(unselectedColor);
                break;
        }
        switch(mood) {
            case 'Happy':
                setHappyIconColor(selectedColor);
                break;
            case 'Sad':
                setSadIconColor(selectedColor);
                break;
            case 'Angry':
                setAngryIconColor(selectedColor);
                break;
            case 'Chill':
                setChillIconColor(selectedColor);
                break;
            case 'Energetic':
                setEnergeticIconColor(selectedColor);
                break;
            case 'Romantic':
                setRomanticIconColor(selectedColor);
                break;
            case 'Melancholy':
                setMelancholyIconColor(selectedColor);
                break;
        }
        setActiveMood(mood);
    };

    useEffect(() => {
        initializeMood(activeMood);
    }, [activeMood]);
    return (
        <PageLayout title="Mood Mode" prevLink="/home">
            <p>What mood should your playlist be?</p>
            <Card className={styles.moodsContainer}>
                <Button
                    sx={{ borderRadius: 3, height: 70 }}
                    startIcon={<FontAwesomeIcon icon={faFaceSmile} color={happyIconColor} style={{width:'45px', height: '45px'}}/>}
                    className={`${styles.moodButton}`}
                    onClick={() => changeMood('Happy')}
                >
                    Happy
                </Button>
                <Button
                    sx={{ borderRadius: 3 }}
                    startIcon={<FontAwesomeIcon icon={faFaceFrown} color={sadIconColor} style={{width:'45px', height: '45px'}}/>}
                    className={`${styles.moodButton}`}
                    onClick={() => changeMood('Sad')}
                >
                    Sad
                </Button>
                <Button
                    sx={{ borderRadius: 3 }}
                    startIcon={<FontAwesomeIcon icon={faFaceAngry} color={angryIconColor} style={{width:'45px', height: '45px'}}/>}
                    className={`${styles.moodButton}`}
                    onClick={() => changeMood('Angry')}
                >
                    Angry
                </Button>
                <Button
                    sx={{ borderRadius: 3 }}
                    startIcon={<FontAwesomeIcon icon={faCouch} color={chillIconColor} style={{width:'45px', height: '45px'}}/>}
                    className={`${styles.moodButton}`}
                    onClick={() => changeMood('Chill')}
                >
                    Chill
                </Button>
                <Button
                    sx={{ borderRadius: 3 }}
                    startIcon={<FontAwesomeIcon icon={faBolt} color={energeticIconColor} style={{width:'45px', height: '45px'}}/>}
                    className={`${styles.moodButton}`}
                    onClick={() => changeMood('Energetic')}
                >
                    Energetic
                </Button>
                <Button
                    sx={{ borderRadius: 3 }}
                    startIcon={<FontAwesomeIcon icon={faHeart} color={romanticIconColor} style={{width:'45px', height: '45px'}}/>}
                    className={`${styles.moodButton}`}
                    onClick={() => changeMood('Romantic')}
                >
                    Romantic
                </Button>
                <Button
                    sx={{ borderRadius: 3 }}
                    startIcon={<FontAwesomeIcon icon={faCloudRain} color={melancholyIconColor} style={{width:'45px', height: '45px'}}/>}
                    className={`${styles.moodButton}`}
                    onClick={() => changeMood('Melancholy')}
                >
                    Melancholy
                </Button>
            </Card>
            <ThemeProvider theme={theme}>
                <div className={styles.sliderContainer}>
                    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center" >
                        <p className={styles.muiSliderLabel}>Length</p>
                        <Slider
                            min={10}
                            step={1}
                            max={30}
                            value={numSongs}
                            onChange={(e) =>
                                setNumSongs(
                                    parseInt(e.target.value, 10)
                                )
                            }
                        />
                        <p className={styles.muiSliderLabel}>{numSongs} songs</p>
                    </Stack>
                </div>
                <Stack alignItems="center" spacing={2}>
                    <Button
                        variant="contained"
                        sx={{ borderRadius: 3, width: '100%' }}
                        className={`${styles.generateButton}`}
                        onClick={() => getRecommendations(numSongs, activeMood)}
                    >
                        Generate Playlist
                    </Button>
                    <h3>GENERATION PREVIEW: {generatedItems}</h3>
                </Stack>
            </ThemeProvider>
        </PageLayout>
    );
        
}