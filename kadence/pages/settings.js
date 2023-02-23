import Head from 'next/head';
import Link from 'next/link';
import { Dialog } from '@capacitor/dialog';
import styles from '@/styles/Settings.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Inter } from '@next/font/google';
import { languages, genres, moods } from '@/lib/promptOptions';
import { removeFromArray, appendToArray } from '@/lib/arrayUtil';
import NetworkAPI from '@/lib/networkAPI';

const inter = Inter({ subsets: ['latin'] });

function Header({ title, prevLink = null }) {
    return (
        <div className={styles.header}>
            {prevLink && (
                <Link href="/profile">
                    <div className={styles.backButton}></div>
                </Link>
            )}
            <h1>{title}</h1>
        </div>
    );
}

function NavBar({ children }) {
    return <div className={styles.navWrapper}>{children}</div>;
}

function SubList({ addNew, remove, items }) {
    return (
        <>
            <div>
                <div className={styles.sublistContainer}>
                    <ul className={styles.sublistULContainer}>
                        {items.map((item, idx) => (
                            <li key={`${idx} ${item}`}>
                                <button
                                    className={styles.sublistDelete}
                                    onClick={() => remove(idx)}
                                >
                                    X&nbsp;
                                </button>
                                {item}
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
    );
}

export default function Settings() {
    const [profilePrivate, setProfilePrivate] = useState(true);
    const [waitToSave, setWaitToSave] = useState(true);
    const [defaultDevice, setDefaultDevice] = useState('None');
    const [defaultMusicPlatform, setDefaultMusicPlatform] = useState('None');

    const [allowExplicit, setAllowExplicit] = useState(false);
    const [lyricalInstrumental, setLyricalInstrumental] = useState(80);
    const [lyricalLanguage, setLyricalLanguage] = useState('English');
    const [minSongLength, setMinSongLength] = useState(0);
    const [maxSongLength, setMaxSongLength] = useState(300);
    const [minPlaylistLength, setMinPlaylistLength] = useState(0);
    const [maxPlaylistLength, setMaxPlaylistLength] = useState(60);
    const [faveGenres, setFaveGenres] = useState('Lo-fi');
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
                setProfilePrivate(userData.private);
                setWaitToSave(userData.waitToSave);
                setIntervalShort(userData.intervalShort);
                setIntervalLong(userData.intervalLong);
                setRampUpTime(userData.rampUpTime);
                setRampDownTime(userData.rampDownTime);
                setMood(userData.mood);
                setZipCode(userData.zipCode);
                setMusicPrefId(userData.musicPrefs);

                // Get preference data second (using musicPrefs id)
                const { data: prefData } = await NetworkAPI.get(
                    '/api/preferences/getPreferences',
                    {
                        uid: userData.musicPrefs,
                    }
                );
                setAllowExplicit(prefData.allowExplicit);
                setLyricalInstrumental(prefData.lyricalInstrumental);
                setLyricalLanguage(prefData.lyricalLanguage);
                setMinSongLength(prefData.minSongLength);
                setMaxSongLength(prefData.maxSongLength);
                setMinPlaylistLength(prefData.minPlaylistLength);
                setMaxPlaylistLength(prefData.maxPlaylistLength);
                setFaveGenres(prefData.faveGenres ?? 'Lo-fi');
                setFaveArtists(prefData.faveArtists);
                setBlacklistedArtists(prefData.blacklistedArtists);
                setBlacklistedSongs(prefData.blacklistedSongs);
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

    // TODO: actually get devices and platforms from database
    const devices = ['Device 1', 'Device 2'];
    const musicPlatforms = ['Spotify', 'Apple Music'];

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
            faveGenres: [faveGenres],
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

    if (!loaded) return '';

    return (
        <div className={inter.className}>
            <Head>
                <title>Settings</title>
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
            <main className={styles.main}>
                <section>
                    <div className={styles.sticky}>
                        <h2>General Preferences</h2>
                    </div>
                    <div className={styles.settingsSection}>
                        <div>
                            <div className={styles.flexWrapper}>
                                <b>Make Profile Private: </b>
                                <select
                                    className={styles.select}
                                    onChange={(e) =>
                                        setProfilePrivate(
                                            e.target.value === 'true'
                                        )
                                    }
                                    value={profilePrivate}
                                >
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <div className={styles.flexWrapper}>
                                <b>Wait to Save Playlist: </b>
                                <select
                                    className={styles.select}
                                    onChange={(e) =>
                                        setWaitToSave(e.target.value === 'true')
                                    }
                                    value={waitToSave}
                                >
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <div className={styles.flexWrapper}>
                                <b>Selected Device: </b>
                                <select
                                    className={styles.select}
                                    onChange={(e) =>
                                        setDefaultDevice(e.target.value)
                                    }
                                    value={defaultDevice}
                                >
                                    <option value={'None'}>None</option>
                                    {devices.map((device) => (
                                        <option value={device} key={device}>
                                            {device}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <div className={styles.flexWrapper}>
                                <b>Selected Music Platform: </b>
                                <select
                                    className={styles.select}
                                    onChange={(e) =>
                                        setDefaultMusicPlatform(e.target.value)
                                    }
                                    value={defaultMusicPlatform}
                                >
                                    <option value={'None'}>None</option>
                                    {musicPlatforms.map((mp) => (
                                        <option value={mp} key={mp}>
                                            {mp}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <div
                                className={styles.flexWrapper}
                                style={{ justifyContent: 'space-around' }}
                            >
                                <button
                                    className={styles.logoutButton}
                                    onClick={logout}
                                >
                                    Log Out
                                </button>
                                <button
                                    className={styles.logoutButton}
                                    onClick={deleteAccount}
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className={styles.sticky}>
                        <h2>Song Selection Preferences</h2>
                    </div>
                    <div className={styles.settingsSection}>
                        <div>
                            <div className={styles.flexWrapper}>
                                <b>Include Explicit Songs: </b>
                                <select
                                    className={styles.select}
                                    onChange={(e) =>
                                        setAllowExplicit(
                                            e.target.value === 'true'
                                        )
                                    }
                                    value={allowExplicit}
                                >
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <b>Lyrical vs. Instrumental: </b>
                            <div className={styles.sliderContainer}>
                                <span className={styles.sliderLabel}>
                                    Lyrical
                                </span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="1"
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
                                <b>Preferred Language: </b>
                                <select
                                    className={styles.select}
                                    onChange={(e) =>
                                        setLyricalLanguage(e.target.value)
                                    }
                                    value={lyricalLanguage}
                                >
                                    {languages.map((language) => (
                                        <option value={language} key={language}>
                                            {language}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <b>Song Length Preferences: </b>
                            <div className={styles.subsetting}>
                                <div className={styles.flexWrapper}>
                                    <i>Minimum: </i>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={minSongLength}
                                            onChange={(e) =>
                                                setMinSongLength(
                                                    parseInt(
                                                        e.target.value,
                                                        10
                                                    ) % 10000
                                                )
                                            }
                                        />{' '}
                                        seconds
                                    </div>
                                </div>
                                <div className={styles.flexWrapper}>
                                    <i>Maximum: </i>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="300"
                                            value={maxSongLength}
                                            onChange={(e) =>
                                                setMaxSongLength(
                                                    parseInt(
                                                        e.target.value,
                                                        10
                                                    ) % 10000
                                                )
                                            }
                                        />{' '}
                                        seconds
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <b>Playlist Length Preferences: </b>
                            <div className={styles.subsetting}>
                                <div className={styles.flexWrapper}>
                                    <i>Minimum: </i>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={minPlaylistLength}
                                            onChange={(e) =>
                                                setMinPlaylistLength(
                                                    parseInt(
                                                        e.target.value,
                                                        10
                                                    ) % 10000
                                                )
                                            }
                                        />{' '}
                                        minutes
                                    </div>
                                </div>
                                <div className={styles.flexWrapper}>
                                    <i>Maximum: </i>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="60"
                                            value={maxPlaylistLength}
                                            onChange={(e) =>
                                                setMaxPlaylistLength(
                                                    parseInt(
                                                        e.target.value,
                                                        10
                                                    ) % 10000
                                                )
                                            }
                                        />{' '}
                                        minutes
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className={styles.flexWrapper}>
                                <b>Preferred Genre: </b>
                                <select
                                    className={styles.select}
                                    onChange={(e) =>
                                        setFaveGenres(e.target.value)
                                    }
                                    value={faveGenres}
                                >
                                    {genres.map((genre) => (
                                        <option value={genre} key={genre}>
                                            {genre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <div className={styles.flexWrapper}>
                                <b>Favorite Artists: </b>
                                <button
                                    className={styles.sublistShowButton}
                                    onClick={() =>
                                        setHideFavArtists((current) => !current)
                                    }
                                >
                                    {hideFavArtists
                                        ? 'Click to show!'
                                        : 'Click to hide!'}
                                </button>
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
                                        if (!cancelled && value.trim() !== '') {
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
                                            removeFromArray(faveArtists, idx)
                                        )
                                    }
                                    items={faveArtists}
                                />
                            )}
                        </div>
                        <div>
                            <div className={styles.flexWrapper}>
                                <b>Blacklisted Artists: </b>
                                <button
                                    className={styles.sublistShowButton}
                                    onClick={() =>
                                        setHideBlacklistedArtists(
                                            (current) => !current
                                        )
                                    }
                                >
                                    {hideBlacklistedArtists
                                        ? 'Click to show!'
                                        : 'Click to hide!'}
                                </button>
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
                                        if (!cancelled && value.trim() !== '') {
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
                                <b>Blacklisted Songs: </b>
                                <button
                                    className={styles.sublistShowButton}
                                    onClick={() =>
                                        setHideBlacklistedSongs(
                                            (current) => !current
                                        )
                                    }
                                >
                                    {hideBlacklistedSongs
                                        ? 'Click to show!'
                                        : 'Click to hide!'}
                                </button>
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
                                        if (!cancelled && value.trim() !== '') {
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
                    <div className={styles.sticky}>
                        <h2>Mode-Specific Preferences</h2>
                    </div>
                    <div className={styles.settingsSection}>
                        <div>
                            <b>Interval Mode Times: </b>
                            <div className={styles.subsetting}>
                                <div className={styles.flexWrapper}>
                                    <i>Short: </i>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="5"
                                            value={intervalShort}
                                            onChange={(e) =>
                                                setIntervalShort(
                                                    parseInt(
                                                        e.target.value,
                                                        10
                                                    ) % 10000
                                                )
                                            }
                                        />{' '}
                                        minutes
                                    </div>
                                </div>
                                <div className={styles.flexWrapper}>
                                    <i>Long: </i>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="10"
                                            value={intervalLong}
                                            onChange={(e) =>
                                                setIntervalLong(
                                                    parseInt(
                                                        e.target.value,
                                                        10
                                                    ) % 10000
                                                )
                                            }
                                        />{' '}
                                        minutes
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <b>Fitness Mode Ramp Up/Down: </b>
                            <div className={styles.subsetting}>
                                <div className={styles.flexWrapper}>
                                    <i>Ramp Up: </i>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={rampUpTime}
                                            onChange={(e) =>
                                                setRampUpTime(
                                                    parseInt(
                                                        e.target.value,
                                                        10
                                                    ) % 10000
                                                )
                                            }
                                        />{' '}
                                        minutes
                                    </div>
                                </div>
                                <div className={styles.flexWrapper}>
                                    <i>Ramp Down: </i>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={rampDownTime}
                                            onChange={(e) =>
                                                setRampDownTime(
                                                    parseInt(
                                                        e.target.value,
                                                        10
                                                    ) % 10000
                                                )
                                            }
                                        />{' '}
                                        minutes
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className={styles.flexWrapper}>
                                <b>Mood Mode Selection: </b>
                                <select
                                    className={styles.select}
                                    onChange={(e) => setMood(e.target.value)}
                                    value={mood}
                                >
                                    {moods.map((m) => (
                                        <option value={m} key={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <div className={styles.flexWrapper}>
                                <b>Local Mode Zip Code: </b>
                                <input
                                    className={styles.zipCode}
                                    type="number"
                                    min="0"
                                    max="99999"
                                    step="1"
                                    value={zipCode}
                                    onChange={(e) =>
                                        setZipCode(
                                            parseInt(e.target.value, 10) % 99999
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Header title="Settings" prevLink="/profile" />
            <NavBar>
                <button
                    style={{ paddingInline: '0.5rem' }}
                    onClick={submitData}
                >
                    Save Changes
                </button>
            </NavBar>
        </div>
    );
}
