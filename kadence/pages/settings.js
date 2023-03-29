import { Dialog } from '@capacitor/dialog';
import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Select,
    Slider,
    Stack,
    Switch,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { CheckCircle } from '@mui/icons-material';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import styles from '@/styles/Settings.module.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { languages, genres, moods } from '@/lib/promptOptions';
import { removeFromArray, appendToArray } from '@/lib/arrayUtil';
import NetworkAPI from '@/lib/networkAPI';
import PageLayout from '@/components/PageLayout';

function SubList({ addNew, remove, items }) {
    return (
        items && (
            <>
                <div>
                    <div className={styles.sublistContainer}>
                        <ul className={styles.sublistULContainer}>
                            {items.map((item, idx) => (
                                <li key={`${idx} ${item}`}>
                                    <Chip
                                        className={styles.sublistChip}
                                        label={item}
                                        onDelete={() => remove(idx)}
                                    />
                                </li>
                            ))}
                            <li>
                                <button
                                    className={styles.sublistAdd}
                                    onClick={addNew}
                                >
                                    + Add New
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </>
        )
    );
}

export default function Settings() {
    const [profilePrivate, setProfilePrivate] = useState(true);
    const [waitToSave, setWaitToSave] = useState(true);

    const [allowExplicit, setAllowExplicit] = useState(false);
    const [lyricalInstrumental, setLyricalInstrumental] = useState(80);
    const [lyricalLanguage, setLyricalLanguage] = useState('English');
    const [minSongLength, setMinSongLength] = useState(0);
    const [maxSongLength, setMaxSongLength] = useState(300);
    const [minPlaylistLength, setMinPlaylistLength] = useState(0);
    const [maxPlaylistLength, setMaxPlaylistLength] = useState(60);
    const [faveGenres, setFaveGenres] = useState([]);
    const [hideFavArtists, setHideFavArtists] = useState(true);
    const [hideBlacklistedArtists, setHideBlacklistedArtists] = useState(true);
    const [hideBlacklistedSongs, setHideBlacklistedSongs] = useState(true);
    const [faveArtists, setFaveArtists] = useState([]);
    const [blacklistedArtists, setBlacklistedArtists] = useState([]);
    const [blacklistedSongs, setBlacklistedSongs] = useState([]);

    const [intervalShort, setIntervalShort] = useState(5);
    const [intervalLong, setIntervalLong] = useState(10);
    const [rampUpTime, setRampUpTime] = useState(0);
    const [rampDownTime, setRampDownTime] = useState(0);
    const [mood, setMood] = useState('Happy');
    const [zipCode, setZipCode] = useState(47907);

    const [loaded, setLoaded] = useState(false);
    const [musicPrefId, setMusicPrefId] = useState(null);

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
                setProfilePrivate(userData.private ?? true);
                setWaitToSave(userData.waitToSave ?? true);
                setIntervalShort(userData.intervalShort ?? 5);
                setIntervalLong(userData.intervalLong ?? 10);
                setRampUpTime(userData.rampUpTime ?? 5);
                setRampDownTime(userData.rampDownTime ?? 5);
                setMood(userData.mood ?? 'Happy');
                setZipCode(userData.zipCode ?? 47907);
                setMusicPrefId(userData.musicPrefs);

                // Get preference data second (using musicPrefs id)
                const { data: prefData } = await NetworkAPI.get(
                    '/api/preferences/getPreferences',
                    {
                        uid: userData.musicPrefs,
                    }
                );
                setAllowExplicit(prefData.allowExplicit ?? false);
                setLyricalInstrumental(prefData.lyricalInstrumental ?? 50);
                setLyricalLanguage(prefData.lyricalLanguage ?? 'English');
                setMinSongLength(prefData.minSongLength ?? 60);
                setMaxSongLength(prefData.maxSongLength ?? 360);
                setMinPlaylistLength(prefData.minPlaylistLength ?? 10);
                setMaxPlaylistLength(prefData.maxPlaylistLength ?? 120);
                setFaveGenres(prefData.faveGenres ?? []);
                setFaveArtists(prefData.faveArtists ?? []);
                setBlacklistedArtists(prefData.blacklistedArtists ?? []);
                setBlacklistedSongs(prefData.blacklistedSongs ?? []);
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

    const router = useRouter();

    async function logout() {
        localStorage.removeItem('jwt');
        localStorage.removeItem('username');
        try {
            const data = await NetworkAPI.get('/api/users/logout');
            if (data) {
                router.push('/login');
            }
        } catch (err) {
            console.log('Error logging out');
            console.error(err);
        }
    }

    async function deleteAccount() {
        try {
            const data = await NetworkAPI.delete('/api/users/delete', {
                username: localStorage.getItem('username'),
            });

            if (data) {
                Dialog.alert({
                    title: 'Success',
                    message: `Account successfully deleted.`,
                });
                router.push('/login');
            }
        } catch (err) {
            Dialog.alert({
                title: 'Error Occurred',
                message: `${err.status} ${err.message}`,
            });
        } finally {
            localStorage.removeItem('jwt');
            localStorage.removeItem('username');
        }
    }

    async function submitData() {
        const musicPrefData = {
            uid: musicPrefId,
            allowExplicit,
            lyricalInstrumental,
            lyricalLanguage,
            minSongLength,
            maxSongLength,
            minPlaylistLength,
            maxPlaylistLength,
            faveGenres,
            faveArtists,
            blacklistedArtists,
            blacklistedSongs,
        };
        const userData = {
            username: localStorage.getItem('username'),
            private: profilePrivate,
            waitToSave,
            intervalShort,
            intervalLong,
            rampUpTime,
            rampDownTime,
            mood,
            zipCode,
        };

        try {
            await NetworkAPI.patch('/api/users/update', userData);
            await NetworkAPI.patch('/api/preferences/update', musicPrefData);
            Dialog.alert({
                title: 'Success',
                message: `Settings successfully saved.`,
            });
        } catch (err) {
            Dialog.alert({
                title: 'Error Occurred',
                message: `Error occurred while saving: ${err.message}`,
            });
        }
    }

    const theme = createTheme({
        palette: {
            primary: {
                main: '#69e267',
            },
        },
    });

    if (!loaded)
        return (
            <PageLayout title="Settings" prevLink="/profile">
                <main className={styles.main}></main>
            </PageLayout>
        );

    return (
        <PageLayout
            title="Settings"
            prevLink="/profile"
            includeUpperRightIcon
            upperRightIcon={
                <IconButton className={styles.saveButton} onClick={submitData}>
                    <CheckCircle />
                </IconButton>
            }
        >
            <ThemeProvider theme={theme}>
                <main className={styles.main}>
                    <section>
                        <div className={styles.sticky}>
                            <Typography>General Preferences</Typography>
                        </div>
                        <div className={styles.settingsSection}>
                            <div>
                                <Box className={styles.flexWrapper}>
                                    Make Profile Private
                                    <Tooltip title="This prevents other users from finding your profile.">
                                        <InfoIcon
                                            className={styles.tooltip}
                                        ></InfoIcon>
                                    </Tooltip>
                                    <Switch
                                        checked={profilePrivate}
                                        onChange={(e) => {
                                            setProfilePrivate(e.target.checked);
                                        }}
                                        inputProps={{
                                            'aria-label': 'controlled',
                                        }}
                                    ></Switch>
                                </Box>
                            </div>
                            <div>
                                <Box className={styles.flexWrapper}>
                                    Wait to Save Playlist
                                    <Tooltip title="Whether to save the playlist at the end of playback.">
                                        <InfoIcon
                                            className={styles.tooltip}
                                        ></InfoIcon>
                                    </Tooltip>
                                    <Switch
                                        checked={waitToSave}
                                        onChange={(e) =>
                                            setWaitToSave(e.target.checked)
                                        }
                                        inputProps={{
                                            'aria-label': 'controlled',
                                        }}
                                    ></Switch>
                                </Box>
                            </div>
                        </div>
                    </section>
                    <section>
                        <Divider className={styles.divider} />
                        <div className={styles.sticky}>
                            <Typography>Song Selection Preferences</Typography>
                        </div>
                        <div className={styles.settingsSection}>
                            <div>
                                <Box className={styles.flexWrapper}>
                                    Include Explicit Songs
                                    <Tooltip title="Songs tagged 'Explicit' on the music platform.">
                                        <InfoIcon
                                            className={styles.tooltip}
                                        ></InfoIcon>
                                    </Tooltip>
                                    <Switch
                                        checked={allowExplicit}
                                        onChange={(e) =>
                                            setAllowExplicit(e.target.checked)
                                        }
                                        inputProps={{
                                            'aria-label': 'controlled',
                                        }}
                                    ></Switch>
                                </Box>
                            </div>
                            <div>
                                Lyrical vs. Instrumental
                                <div className={styles.sliderContainer}>
                                    <span className={styles.sliderLabel}>
                                        Lyrical
                                    </span>
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={lyricalInstrumental}
                                        onChange={(e) =>
                                            setLyricalInstrumental(
                                                parseInt(e.target.value, 10)
                                            )
                                        }
                                    />
                                    <span className={styles.sliderLabel}>
                                        Instrumental
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className={styles.flexWrapper}>
                                    Preferred Language
                                    <Select
                                        className={styles.select}
                                        onChange={(e) =>
                                            setLyricalLanguage(e.target.value)
                                        }
                                        value={lyricalLanguage}
                                    >
                                        {languages.map((language) => (
                                            <MenuItem
                                                value={language}
                                                key={language}
                                            >
                                                {language}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div>
                                Song Length Preferences
                                <div className={styles.subsetting}>
                                    <div className={styles.flexWrapper}>
                                        Minimum: {minSongLength} seconds
                                        <Slider
                                            min={0}
                                            max={7200}
                                            step={1}
                                            value={minSongLength}
                                            onChange={(e) =>
                                                setMinSongLength(
                                                    parseInt(e.target.value, 10)
                                                )
                                            }
                                        />
                                    </div>
                                    <div className={styles.flexWrapper}>
                                        Maximum: {maxSongLength} seconds
                                        <Slider
                                            min={0}
                                            max={7200}
                                            step={1}
                                            value={maxSongLength}
                                            onChange={(e) =>
                                                setMaxSongLength(
                                                    parseInt(e.target.value, 10)
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                Playlist Length Preferences
                                <div className={styles.subsetting}>
                                    <div className={styles.flexWrapper}>
                                        Minimum: {minPlaylistLength} minutes
                                        <Slider
                                            min={0}
                                            max={300}
                                            step={1}
                                            value={minPlaylistLength}
                                            onChange={(e) =>
                                                setMinPlaylistLength(
                                                    parseInt(e.target.value, 10)
                                                )
                                            }
                                        />
                                    </div>
                                    <div className={styles.flexWrapper}>
                                        Maximum: {maxPlaylistLength} minutes
                                        <Slider
                                            min={0}
                                            max={300}
                                            step={1}
                                            value={maxPlaylistLength}
                                            onChange={(e) =>
                                                setMaxPlaylistLength(
                                                    parseInt(e.target.value, 10)
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className={styles.flexWrapper}>
                                    Preferred Genre
                                    <Select
                                        className={styles.select}
                                        onChange={(e) =>
                                            setFaveGenres([e.target.value])
                                        }
                                        value={faveGenres[0] ?? 'No Preference'}
                                    >
                                        {genres.map((genre) => (
                                            <MenuItem value={genre} key={genre}>
                                                {genre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <div className={styles.flexWrapper}>
                                    Favorite Artists
                                    <Button
                                        className={styles.sublistShowButton}
                                        onClick={() =>
                                            setHideFavArtists(
                                                (current) => !current
                                            )
                                        }
                                    >
                                        {hideFavArtists ? 'Show' : 'Hide'}
                                    </Button>
                                </div>
                                {!hideFavArtists && (
                                    <SubList
                                        addNew={async () => {
                                            const { value, cancelled } =
                                                await Dialog.prompt({
                                                    title: 'Add New Artist',
                                                    message:
                                                        'What is the name of the artist you want to add?',
                                                });
                                            if (
                                                !cancelled &&
                                                value.trim() !== ''
                                            ) {
                                                setFaveArtists(
                                                    appendToArray(
                                                        faveArtists,
                                                        value.trim()
                                                    )
                                                );
                                            }
                                        }}
                                        remove={(idx) =>
                                            setFaveArtists(
                                                removeFromArray(
                                                    faveArtists,
                                                    idx
                                                )
                                            )
                                        }
                                        items={faveArtists}
                                    />
                                )}
                            </div>
                            <div>
                                <div className={styles.flexWrapper}>
                                    Blacklisted Artists
                                    <Button
                                        className={styles.sublistShowButton}
                                        onClick={() =>
                                            setHideBlacklistedArtists(
                                                (current) => !current
                                            )
                                        }
                                    >
                                        {hideBlacklistedArtists
                                            ? 'Show'
                                            : 'Hide'}
                                    </Button>
                                </div>
                                {!hideBlacklistedArtists && (
                                    <SubList
                                        addNew={async () => {
                                            const { value, cancelled } =
                                                await Dialog.prompt({
                                                    title: 'Blacklist New Artist',
                                                    message:
                                                        'What is the name of the artist you want to blacklist?',
                                                });
                                            if (
                                                !cancelled &&
                                                value.trim() !== ''
                                            ) {
                                                setBlacklistedArtists(
                                                    appendToArray(
                                                        blacklistedArtists,
                                                        value.trim()
                                                    )
                                                );
                                            }
                                        }}
                                        remove={(idx) =>
                                            setBlacklistedArtists(
                                                removeFromArray(
                                                    blacklistedArtists,
                                                    idx
                                                )
                                            )
                                        }
                                        items={blacklistedArtists}
                                    />
                                )}
                            </div>
                            <div>
                                <div className={styles.flexWrapper}>
                                    Blacklisted Songs
                                    <Button
                                        className={styles.sublistShowButton}
                                        onClick={() =>
                                            setHideBlacklistedSongs(
                                                (current) => !current
                                            )
                                        }
                                    >
                                        {hideBlacklistedSongs ? 'Show' : 'Hide'}
                                    </Button>
                                </div>
                                {!hideBlacklistedSongs && (
                                    <SubList
                                        addNew={async () => {
                                            let { value, cancelled } =
                                                await Dialog.prompt({
                                                    title: 'Blacklist New Song',
                                                    message:
                                                        'What is the name of the song you want to blacklist?',
                                                });
                                            if (
                                                !cancelled &&
                                                value.trim() !== ''
                                            ) {
                                                const songName = value;
                                                ({ value, cancelled } =
                                                    await Dialog.prompt({
                                                        title: 'Blacklist New Song',
                                                        message: `What is the name of the artist who wrote "${songName}"?`,
                                                    }));
                                                if (
                                                    !cancelled &&
                                                    value.trim() !== ''
                                                ) {
                                                    setBlacklistedSongs(
                                                        appendToArray(
                                                            blacklistedSongs,
                                                            {
                                                                name: songName.trim(),
                                                                artist: value.trim(),
                                                            }
                                                        )
                                                    );
                                                }
                                            }
                                        }}
                                        remove={(idx) =>
                                            setBlacklistedSongs(
                                                removeFromArray(
                                                    blacklistedSongs,
                                                    idx
                                                )
                                            )
                                        }
                                        items={blacklistedSongs.map(
                                            ({ name, artist }) =>
                                                `"${name}" by ${artist}`
                                        )}
                                    />
                                )}
                            </div>
                        </div>
                    </section>
                    <section>
                        <Divider className={styles.divider} />
                        <div className={styles.sticky}>
                            <Typography>Mode-Specific Preferences</Typography>
                        </div>
                        <div className={styles.settingsSection}>
                            <div>
                                Interval Mode Times
                                <div className={styles.subsetting}>
                                    <div className={styles.flexWrapper}>
                                        Short: {intervalShort} minutes
                                        <Slider
                                            min={0}
                                            max={300}
                                            step={1}
                                            value={intervalShort}
                                            onChange={(e) =>
                                                setIntervalShort(
                                                    parseInt(e.target.value, 10)
                                                )
                                            }
                                        />
                                    </div>
                                    <div className={styles.flexWrapper}>
                                        Long: {intervalLong} minutes
                                        <Slider
                                            min={0}
                                            max={300}
                                            step={1}
                                            value={intervalLong}
                                            onChange={(e) =>
                                                setIntervalLong(
                                                    parseInt(e.target.value, 10)
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                Fitness Mode Ramp Up/Down
                                <div className={styles.subsetting}>
                                    <div className={styles.flexWrapper}>
                                        Ramp Up: {rampUpTime} minutes
                                        <Slider
                                            min={0}
                                            max={300}
                                            step={1}
                                            value={rampUpTime}
                                            onChange={(e) =>
                                                setRampUpTime(
                                                    parseInt(e.target.value, 10)
                                                )
                                            }
                                        />
                                    </div>
                                    <div className={styles.flexWrapper}>
                                        Ramp Down: {rampDownTime} minutes
                                        <Slider
                                            min={0}
                                            max={300}
                                            step={1}
                                            value={rampDownTime}
                                            onChange={(e) =>
                                                setRampDownTime(
                                                    parseInt(e.target.value, 10)
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className={styles.flexWrapper}>
                                    Mood Mode Selection
                                    <Select
                                        className={styles.select}
                                        onChange={(e) =>
                                            setMood(e.target.value)
                                        }
                                        value={mood}
                                    >
                                        {moods.map((m) => (
                                            <MenuItem value={m} key={m}>
                                                {m}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <div className={styles.flexWrapper}>
                                    Local Mode Zip Code
                                    <TextField
                                        className={styles.zipCode}
                                        type="number"
                                        min={0}
                                        max={99999}
                                        step={1}
                                        value={zipCode}
                                        onChange={(e) =>
                                            setZipCode(
                                                Math.min(
                                                    parseInt(
                                                        e.target.value,
                                                        10
                                                    ),
                                                    99999
                                                )
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <div
                                    className={styles.flexWrapper}
                                    style={{ justifyContent: 'space-around' }}
                                >
                                    <Button
                                        className={styles.logoutButton}
                                        onClick={logout}
                                    >
                                        Log Out
                                    </Button>
                                    <Button
                                        className={styles.logoutButton}
                                        onClick={deleteAccount}
                                    >
                                        Delete Account
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </ThemeProvider>
        </PageLayout>
    );
}
