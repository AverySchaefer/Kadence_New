import * as React from 'react';
import Head from 'next/head';
import styles from '@/styles/Register.module.css';
import Button from '@/components/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { languages, genres, moods } from '@/lib/promptOptions';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Inter } from '@next/font/google';
import { Dialog } from '@capacitor/dialog';

import NetworkAPI from '@/lib/networkAPI';

const inter = Inter({ subsets: ['latin'] });

export default function Register() {
    const [profilePrivate, setProfilePrivate] = useState(true);
    const [bio, setBio] = useState('');
    const [waitToSave, setWaitToSave] = useState(true);
    const [defaultDevice, setDefaultDevice] = useState(null);

    const [allowExplicit, setAllowExplicit] = useState(false);
    const [lyricalVsInstrumental, setLyricalVsInstrumental] = useState(80);
    const [prefLanguage, setPrefLanguage] = useState('English');
    const [minSongLength, setMinSongLength] = useState(0);
    const [maxSongLength, setMaxSongLength] = useState(300);
    const [minPlaylistLength, setMinPlaylistLength] = useState(0);
    const [maxPlaylistLength, setMaxPlaylistLength] = useState(60);
    const [faveGenres, setFaveGenres] = useState('Lo-fi');

    const [intervalShort, setIntervalShort] = useState(5);
    const [intervalLong, setIntervalLong] = useState(10);
    const [rampUpTime, setRampUpTime] = useState(0);
    const [rampDownTime, setRampDownTime] = useState(0);
    const [mood, setMood] = useState('Happy');
    const [zipcode, setZipcode] = useState(69420);

    const router = useRouter();

    async function submitData() {
        const musicPrefData = {
            username: localStorage.getItem('username'),
            allowExplicit,
            lyricalVsInstrumental,
            prefLanguage,
            minSongLength,
            maxSongLength,
            minPlaylistLength,
            maxPlaylistLength,
            faveGenres,
        };
        const userData = {
            username: localStorage.getItem('username'),
            private: profilePrivate,
            bio,
            intervalShort,
            intervalLong,
            rampUpTime,
            rampDownTime,
            mood,
            zipcode,
        };

        try {
            await NetworkAPI.patch('/api/users/update', userData);
            await NetworkAPI.patch('/api/preferences/update', musicPrefData);
            Dialog.alert({
                title: 'Success',
                message: `Settings successfully saved.`,
            });
            router.push('/home');
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
                    <h1 className={styles.title}>Kadence!!</h1>
                    <br />
                    <h2>Write a short bio!</h2>
                    <textarea
                        name="bio"
                        rows="3"
                        cols="40"
                        placeholder="Bio"
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                    />
                    <h2>Set your preferences!</h2>
                    <div className={styles.switch}>
                        <FormControlLabel
                            label="Set profile to private"
                            control={
                                <Switch
                                    defaultChecked
                                    name="private"
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
                                    onChange={(e) =>
                                        setAllowExplicit(e.target.checked)
                                    }
                                />
                            }
                        />
                    </div>
                    <h3>Lyrical vs. Instrumental: </h3>
                    <div className={styles.sliderContainer}>
                        <span className={styles.sliderLabel}>Lyrical</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={lyricalVsInstrumental}
                            onChange={(e) =>
                                setLyricalVsInstrumental(
                                    parseInt(e.target.value, 10)
                                )
                            }
                        />
                        <span className={styles.sliderLabel}>Instrumental</span>
                    </div>
                    <div>
                        <h3>Song Length Preferences: </h3>
                        <div className={styles.subsetting}>
                            <div className={styles.flexWrapper}>
                                <i>Minimum: &nbsp;</i>
                                <div>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className={styles.input}
                                        value={minSongLength}
                                        onChange={(e) =>
                                            setMinSongLength(
                                                parseInt(e.target.value, 10) %
                                                    10000
                                            )
                                        }
                                    />{' '}
                                    seconds
                                </div>
                            </div>
                            <div className={styles.flexWrapper}>
                                <i>Maximum: &nbsp;</i>
                                <div>
                                    <input
                                        type="number"
                                        placeholder="300"
                                        className={styles.input}
                                        value={maxSongLength}
                                        onChange={(e) =>
                                            setMaxSongLength(
                                                parseInt(e.target.value, 10) %
                                                    10000
                                            )
                                        }
                                    />{' '}
                                    seconds
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3>Playlist Length Preferences: </h3>
                        <div className={styles.subsetting}>
                            <div className={styles.flexWrapper}>
                                <i>Minimum: &nbsp;</i>
                                <div>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className={styles.input}
                                        value={minPlaylistLength}
                                        onChange={(e) =>
                                            setMinPlaylistLength(
                                                parseInt(e.target.value, 10) %
                                                    10000
                                            )
                                        }
                                    />{' '}
                                    minutes
                                </div>
                            </div>
                            <div className={styles.flexWrapper}>
                                <i>Maximum: &nbsp;</i>
                                <div>
                                    <input
                                        type="number"
                                        placeholder="60"
                                        className={styles.input}
                                        value={maxPlaylistLength}
                                        onChange={(e) =>
                                            setMaxPlaylistLength(
                                                parseInt(e.target.value, 10) %
                                                    10000
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
                            <b>Preferred Language: &nbsp;</b>
                            <select
                                className={styles.select}
                                onChange={(e) =>
                                    setPrefLanguage(e.target.value)
                                }
                                value={prefLanguage}
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
                        <div className={styles.flexWrapper}>
                            <b>Preferred Genre: &nbsp;</b>
                            <select
                                className={styles.select}
                                onChange={(e) => setFaveGenres(e.target.value)}
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
                    <h2 className={styles.text}>
                        Set Your Mode-Specific Preferences!
                    </h2>
                    <div className={styles.settingsSection}>
                        <div>
                            <h3>Interval Mode Times: </h3>
                            <div className={styles.subsetting}>
                                <div className={styles.left}>
                                    <i>Short: &nbsp;</i>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="5"
                                            className={styles.input}
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
                                <div className={styles.left}>
                                    <i>Long: &nbsp;</i>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="10"
                                            className={styles.input}
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
                            <h3>Fitness Mode Ramp Up/Down: </h3>
                            <div className={styles.subsetting}>
                                <div className={styles.left}>
                                    <i>Ramp Up: &nbsp;</i>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className={styles.input}
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
                                <div className={styles.left}>
                                    <i>Ramp Down: &nbsp;</i>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className={styles.input}
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
                        <div className={styles.left}>
                            <div className={styles.flexWrapper}>
                                <b>Mood Mode Selection: &nbsp;</b>
                                <select
                                    className={styles.select}
                                    onChange={(e) => setMood(e.target.value)}
                                    value={mood}
                                >
                                    {moods.map((mood) => (
                                        <option value={mood} key={mood}>
                                            {mood}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <br />
                        <div className={styles.left}>
                            <div className={styles.flexWrapper}>
                                <b>Local Mode Zip Code: &nbsp;</b>
                                <input
                                    className={styles.zipCode}
                                    type="number"
                                    min="0"
                                    max="99999"
                                    step="1"
                                    value={zipcode}
                                    onChange={(e) =>
                                        setZipcode(
                                            parseInt(e.target.value, 10) % 99999
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.center}>
                        <Button onClick={() => signIn()}>
                            Sign in to Spotify
                        </Button>
                    </div>
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
