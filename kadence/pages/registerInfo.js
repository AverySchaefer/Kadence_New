import * as React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Register.module.css';
import Button from '@/components/Button';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Textbox from '@/components/Textbox';
import TextArea from '@/components/TextArea';
import { languages, genres, moods } from '@/lib/promptOptions';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Inter } from '@next/font/google';
import { Dialog } from '@capacitor/dialog';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import NetworkAPI from '@/lib/networkAPI';

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
    palette: {
      primary: {
        main: '#69e267',
      },
    },
  });

export default function Register() {
    const [profilePrivate, setProfilePrivate] = useState(true);
    const [bio, setBio] = useState('');
    const [waitToSave, setWaitToSave] = useState(true);
    const [favoriteArtist, setFaveArtist] = useState('');
    const [favoriteAlbum, setFaveAlbum] = useState('');
    const [favoriteSong, setFaveSong] = useState('');

    const [allowExplicit, setAllowExplicit] = useState(false);
    const [lyricalInstrumental, setlyricalInstrumental] = useState(80);
    const [lyricalLanguage, setlyricalLanguage] = useState('English');
    const [minSongLength, setMinSongLength] = useState(0);
    const [maxSongLength, setMaxSongLength] = useState(300);
    const [minPlaylistLength, setMinPlaylistLength] = useState(0);
    const [maxPlaylistLength, setMaxPlaylistLength] = useState(60);
    const [faveGenres, setFaveGenres] = useState('Lo-fi');
    const [faveArtists, setFaveArtists] = useState([]);
    const [dislikeArtist, setDislikeArtist] = useState('');
    const [dislikeSong, setDislikeSong] = useState('');
    const [blacklistedArtists, setBlacklistedArtists] = useState([]);
    const [blacklistedSongs, setBlacklistedSongs] = useState([]);

    const [intervalShort, setIntervalShort] = useState(5);
    const [intervalLong, setIntervalLong] = useState(10);
    const [rampUpTime, setRampUpTime] = useState(0);
    const [rampDownTime, setRampDownTime] = useState(0);
    const [mood, setMood] = useState('Happy');
    const [zipCode, setZipCode] = useState(47907);

    const router = useRouter();

    async function submitData() {
        setFaveArtists(
            faveArtists.push(favoriteArtist)
        );
        setBlacklistedArtists(
            blacklistedArtists.push(dislikeArtist)
        );
        setBlacklistedSongs(
            blacklistedSongs.push(dislikeSong)
        );

        try {
            const musicPrefData = {
                // Needs to be preference_id, can get that from getUsers api if the preference object
                // already exists or create a new preference object here (might be better, but then
                // must make updateUser api call to set the preference field to the inserted document
                // id. Might just have to discuss tomorrow and see what everybody decides)
                // Rest are fine
                allowExplicit,
                lyricalInstrumental,
                lyricalLanguage,
                minSongLength,
                maxSongLength,
                minPlaylistLength,
                maxPlaylistLength,
                faveGenres: [faveGenres],
                faveArtists,
                blacklistedArtists,
                blacklistedSongs,
            };

            const { data } = await NetworkAPI.post(
                '/api/preferences/insert',
                musicPrefData
            );

            const userData = {
                username: localStorage.getItem('username'),
                private: profilePrivate,
                waitToSave,
                bio,
                musicPrefs: data.id,
                intervalShort,
                intervalLong,
                rampUpTime,
                rampDownTime,
                mood,
                zipCode,
                favoriteArtist,
                favoriteAlbum,
                favoriteSong,
            };
            await NetworkAPI.patch('/api/users/update', userData);
            Dialog.alert({
                title: 'Success',
                message: `Settings successfully saved.`,
            });
            router.push('/platform');
        } catch (err) {
            Dialog.alert({
                title: 'Error Occurred',
                message: `Error occurred while saving: ${err.message}`,
            });
        }
    }
    return (
        <>
            <Head>
                <title>RegisterInfo</title>
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
            <main className={[inter.className, styles.main].join(' ')}>
                <div className={styles.formInfo}>
                    <h1 className={styles.title}>Get set up with</h1>
                    <Image
                    className={styles.img}
                    src="/KadenceLogo_green.svg"
                    alt="Kadence Logo"
                    width={380}
                    height={200}
                    priority
                />
                    <br />
                    <h2>Write a short bio!</h2>
                    <TextArea
                        name="bio"
                        placeholder="Bio"
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                    />
                    <h3>Who is your favorite artist?</h3>
                    <Textbox
                        name="favoriteArtist"
                        type="text"
                        placeholder="Artist"
                        onChange={(e) => setFaveArtist(e.target.value)}
                        value={favoriteArtist}
                        required
                    />
                    <h3>What is your favorite song?</h3>
                    <Textbox
                        name="favoriteSong"
                        type="text"
                        placeholder="Song"
                        onChange={(e) => setFaveSong(e.target.value)}
                        value={favoriteSong}
                        required
                    />
                    <h3>What is your favorite album?</h3>
                    <Textbox
                        name="favoriteAlbum"
                        type="text"
                        placeholder="Album"
                        onChange={(e) => setFaveAlbum(e.target.value)}
                        value={favoriteAlbum}
                        required
                    />
                    <h3>{"Who is an artist you don't like?"}</h3>
                    <Textbox
                        name="dislikeArtist"
                        type="text"
                        placeholder="Artist"
                        onChange={(e) => setDislikeArtist(e.target.value)}
                        value={dislikeArtist}
                        required
                    />
                    <h3>{"What is a song you don't like?"}</h3>
                    <Textbox
                        name="dislikeSong"
                        type="text"
                        placeholder="Song"
                        onChange={(e) => setDislikeSong(e.target.value)}
                        value={dislikeSong}
                        required
                    />
                    <h2>Set your preferences!</h2>
                    <ThemeProvider theme={theme}>
                        <div className={styles.switch}>
                            <FormControlLabel
                                label="Set profile to private"
                                control={
                                    <Switch
                                        checked={profilePrivate}
                                        name="private"
                                        color="primary"
                                        onChange={(e) =>
                                            setProfilePrivate(e.target.checked)
                                        }
                                    />
                                }
                            />
                            <FormControlLabel
                                label="Wait to save playlists"
                                control={
                                    <Switch
                                        checked={waitToSave}
                                        name="waitToSave"
                                        onChange={(e) =>
                                            setWaitToSave(e.target.checked)
                                        }
                                    />
                                }
                            />
                            <FormControlLabel
                                label="Allow explicit songs"
                                control={
                                    <Switch
                                        checked={allowExplicit}
                                        name="explicit"
                                        onChange={(e) => {
                                            setAllowExplicit(e.target.checked);
                                        }}
                                    />
                                }
                            />
                        </div>
                        <h3>Lyrical vs. Instrumental: </h3>
                        <div className={styles.sliderContainer}>
                            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center" >
                            <i className={styles.muiSliderLabel}>Lyrical</i>
                            <Slider
                                min={0}
                                step={1}
                                max={100}                              
                                value={lyricalInstrumental}
                                onChange={(e) =>
                                    setlyricalInstrumental(
                                        parseInt(e.target.value, 10)
                                    )
                                }
                            />
                            <i className={styles.muiSliderLabel}>Instrumental</i>
                            </Stack>
                        </div>
                        <div>
                            <h3>Song Length Preferences: </h3>
                            <div className={styles.subsetting}>
                                <TextField
                                    required
                                    color='primary'
                                    focused 
                                    label="Minimum"
                                    type="number"
                                    sx={{ m: 1, width: '25ch', input: { color: 'white' } }}
                                    value={minSongLength}
                                    InputProps={{
                                        endAdornment: (<InputAdornment position="end" sx={{ color: '#69e267' }}><p>seconds</p></InputAdornment>),
                                    }}
                                    onChange={(e) =>
                                        setMinSongLength(
                                            parseInt(e.target.value, 10) %
                                                10000
                                        )
                                    }
                                />
                            </div>
                            <div className={styles.subsetting}>
                                <TextField
                                    required
                                    color='primary'
                                    focused 
                                    label="Maximum"
                                    type="number"
                                    sx={{ m: 1, width: '25ch', input: { color: 'white' } }}
                                    value={maxSongLength}
                                    InputProps={{
                                        endAdornment: (<InputAdornment position="end" sx={{ color: '#69e267' }}><p>seconds</p></InputAdornment>),
                                    }}
                                    onChange={(e) =>
                                        setMaxSongLength(
                                            parseInt(e.target.value, 10) %
                                                10000
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <h3>Playlist Length Preferences: </h3>
                            <div className={styles.subsetting}>
                            <TextField
                                    required
                                    color='primary'
                                    focused 
                                    label="Minimum"
                                    type="number"
                                    sx={{ m: 1, width: '25ch', input: { color: 'white' } }}
                                    value={minPlaylistLength}
                                    InputProps={{
                                        endAdornment: (<InputAdornment position="end" sx={{ color: '#69e267' }}><p>minutes</p></InputAdornment>),
                                    }}
                                    onChange={(e) =>
                                        setMinPlaylistLength(
                                            parseInt(e.target.value, 10) %
                                                10000
                                        )
                                    }
                                />
                            </div>
                            <div className={styles.subsetting}>
                                <TextField
                                    required
                                    color='primary'
                                    focused 
                                    label="Maximum"
                                    type="number"
                                    sx={{ m: 1, width: '25ch', input: { color: 'white' } }}
                                    value={maxPlaylistLength}
                                    InputProps={{
                                        endAdornment: (<InputAdornment position="end" sx={{ color: '#69e267' }}><p>minutes</p></InputAdornment>),
                                    }}
                                    onChange={(e) =>
                                        setMaxPlaylistLength(
                                            parseInt(e.target.value, 10) %
                                                10000
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <h3>Preferred Language: </h3>
                            <div className={styles.subsetting}>
                                <FormControl required sx={{ m: 1, width : '25ch' }}>
                                    <InputLabel id="language-select-input-label" sx={{ color: '#69e267' }}>Language</InputLabel>
                                    <Select
                                        labelId="language-select-input-label"
                                        id="language-select-input"
                                        value={lyricalLanguage}
                                        label="Language"
                                        sx={{ color: 'white', 
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#69e267'
                                            },
                                            '& .MuiSvgIcon-root': {
                                                color: '#69e267'
                                            } 
                                        }}
                                        onChange={(e) =>
                                            setlyricalLanguage(e.target.value)
                                        }
                                    >
                                        {languages.map((language) => (
                                            <MenuItem value={language} key={language}>
                                                {language}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div>
                            <h3>Preferred Genre:</h3>
                            <div className={styles.subsetting}>

                            <FormControl required sx={{ m: 1, width : '25ch' }}>
                                <InputLabel id="genre-select-input-label" sx={{ color: '#69e267' }}>Genre</InputLabel>
                                <Select
                                    labelId="genre-select-input-label"
                                    id="genre-select-input"
                                    value={faveGenres}
                                    label="Genre"
                                    sx={{ color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#69e267'
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: '#69e267'
                                        }
                                    }}
                                    onChange={(e) =>
                                        setFaveGenres(e.target.value)
                                    }
                                >
                                    {genres.map((genre) => (
                                        <MenuItem value={genre} key={genre}>
                                            {genre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            </div>
                        </div>
                        <h2 className={styles.text}>
                            Set Your Mode-Specific Preferences!
                        </h2>
                        <div className={styles.settingsSection}>
                            <div>
                                <h3>Interval Mode Times: </h3>
                                <div className={styles.subsetting}>
                                    <TextField
                                        required
                                        color='primary'
                                        focused 
                                        label="Short"
                                        type="number"
                                        sx={{ m: 1, width: '25ch', input: { color: 'white' } }}
                                        value={intervalShort}
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end" sx={{ color: '#69e267' }}><p>minutes</p></InputAdornment>),
                                        }}
                                        onChange={(e) =>
                                            setIntervalShort(
                                                parseInt(
                                                    e.target.value,
                                                    10
                                                ) % 10000
                                            )
                                        }
                                    />
                                </div>
                                <div className={styles.subsetting}>
                                    <TextField
                                        required
                                        color='primary'
                                        focused 
                                        label="Long"
                                        type="number"
                                        sx={{ m: 1, width: '25ch', input: { color: 'white' } }}
                                        value={intervalLong}
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end" sx={{ color: '#69e267' }}><p>minutes</p></InputAdornment>),
                                        }}
                                        onChange={(e) =>
                                            setIntervalLong(
                                                parseInt(
                                                    e.target.value,
                                                    10
                                                ) % 10000
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <h3>Fitness Mode Ramp Up/Down: </h3>
                                <div className={styles.subsetting}>
                                    <TextField
                                        required
                                        color='primary'
                                        focused 
                                        label="Ramp Up"
                                        type="number"
                                        sx={{ m: 1, width: '25ch', input: { color: 'white' } }}
                                        value={rampUpTime}
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end" sx={{ color: '#69e267' }}><p>minutes</p></InputAdornment>),
                                        }}
                                        onChange={(e) =>
                                            setRampUpTime(
                                                parseInt(
                                                    e.target.value,
                                                    10
                                                ) % 10000
                                            )
                                        }
                                    />
                                </div>
                                <div className={styles.subsetting}>
                                    <TextField
                                        required
                                        color='primary'
                                        focused 
                                        label="Ramp Down"
                                        type="number"
                                        sx={{ m: 1, width: '25ch', input: { color: 'white' } }}
                                        value={rampDownTime}
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end" sx={{ color: '#69e267' }}><p>minutes</p></InputAdornment>),
                                        }}
                                        onChange={(e) =>
                                            setRampDownTime(
                                                parseInt(
                                                    e.target.value,
                                                    10
                                                ) % 10000
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <h3>Mood Mode Selection:</h3>
                                <div className={styles.subsetting}>
                                    <FormControl required sx={{ m: 1, width : '25ch' }}>
                                        <InputLabel id="mood-select-input-label" sx={{ color: '#69e267' }}>Mood</InputLabel>
                                        <Select
                                            labelId="mood-select-input-label"
                                            id="mood-select-input"
                                            value={mood}
                                            label="Mood"
                                            sx={{ color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#69e267'
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    color: '#69e267'
                                                }
                                            }}
                                            onChange={(e) =>
                                                setMood(e.target.value)
                                            }
                                        >
                                            {moods.map((m) => (
                                                <MenuItem value={m} key={m}>
                                                    {m}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <br />
                            <div>
                                <h3>Local Mode Zip Code:</h3>
                                <div className={styles.subsetting}>
                                    <TextField
                                        required
                                        color='primary'
                                        focused
                                        label="Zip Code"
                                        type="number"
                                        
                                        sx={{ m: 1, width: '25ch', input: { color: 'white' } }}
                                        value={zipCode}
                                        InputProps={{}}
                                        onChange={(e) => {
                                            var value = parseInt(e.target.value, 10);

                                            if (value < 0) value = 0;
                                            if (value > 99999) value = 99999;

                                            setZipCode(value)
                                        }}
                                    />
                                </div>
                            </div>
                            <br />
                        </div>
                    </ThemeProvider>
                    <div className={styles.center}>
                        <Button onClick={submitData}>
                            {/* <Link href="/home">Register</Link> */}
                            Next
                        </Button>
                    </div>
                </div>
            </main>
        </>
    );
}
