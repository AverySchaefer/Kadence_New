import { Inter } from '@next/font/google';
import styles from '@/styles/Settings.module.css';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import NetworkAPI from '../lib/networkAPI';

const inter = Inter({ subsets: ['latin'] });

// API Request Information
//
// dataReqs is an array of objects that can be sent to the server.
// Each consists of a field and the type of the field, which
// defaults to "text" if unspecified. Valid types are:
//   - text, number, flag, array, songArray
// These types are used to parse the fields (and generate UI components)
// accordingly.
const API = {
    userEndpoints: [
        {
            title: 'Login',
            url: '/api/users/login',
            method: 'GET',
            dataReqs: [{ field: 'username' }, { field: 'enteredPW' }],
        },
        {
            title: 'Get Users',
            url: '/api/users/getUsers',
            method: 'GET',
            dataReqs: [{ field: 'username' }],
        },
        {
            title: 'Delete',
            url: '/api/users/delete',
            method: 'DELETE',
            dataReqs: [{ field: 'uid' }],
        },
        {
            title: 'Insert',
            url: '/api/users/insert',
            method: 'POST',
            dataReqs: [
                { field: 'uid' },
                { field: 'username' },
                { field: 'email' },
                { field: 'password' },
                { field: 'bio' },
                { field: 'profilePic' },
                { field: 'private', type: 'flag' },
                { field: 'devices', type: 'array' },
                { field: 'selectedDevice' },
                { field: 'musicPlatforms', type: 'array' },
                { field: 'selectedMusic' },
                { field: 'musicPrefs' },
                { field: 'waitToSave', type: 'flag' },
                { field: 'intervalShort', type: 'number' },
                { field: 'intervalLong', type: 'number' },
                { field: 'rampUpTime', type: 'number' },
                { field: 'rampDownTime', type: 'number' },
                { field: 'mood' },
                { field: 'zipcode', type: 'number' },
                { field: 'friendRequests', type: 'array' },
                { field: 'friends', type: 'array' },
                { field: 'actions', type: 'array' },
            ],
        },
        {
            title: 'Update',
            url: '/api/users/update',
            method: 'PATCH',
            dataReqs: [
                { field: 'uid' },
                { field: 'username' },
                { field: 'email' },
                { field: 'password' },
                { field: 'bio' },
                { field: 'profilePic' },
                { field: 'private', type: 'flag' },
                { field: 'devices', type: 'array' },
                { field: 'selectedDevice' },
                { field: 'musicPlatforms', type: 'array' },
                { field: 'selectedMusic' },
                { field: 'musicPrefs' },
                { field: 'waitToSave', type: 'flag' },
                { field: 'intervalShort', type: 'number' },
                { field: 'intervalLong', type: 'number' },
                { field: 'rampUpTime', type: 'number' },
                { field: 'rampDownTime', type: 'number' },
                { field: 'mood' },
                { field: 'zipcode', type: 'number' },
                { field: 'friendRequests', type: 'array' },
                { field: 'friends', type: 'array' },
                { field: 'actions', type: 'array' },
            ],
        },
    ],
    prefEndpoints: [
        {
            title: 'Get Preferences',
            url: '/api/preferences/getPreferences',
            method: 'GET',
            dataReqs: [{ field: 'uid' }],
        },
        {
            title: 'Delete',
            url: '/api/preferences/delete',
            method: 'DELETE',
            dataReqs: [{ field: 'uid' }],
        },
        {
            title: 'Insert',
            url: '/api/preferences/insert',
            method: 'POST',
            dataReqs: [
                { field: 'uid' },
                { field: 'allowExplicit', type: 'flag' },
                { field: 'lyricalInstrumental', type: 'number' },
                { field: 'lyricalLanguage' },
                { field: 'minSongLength', type: 'number' },
                { field: 'maxSongLength', type: 'number' },
                { field: 'minPlaylistLength', type: 'number' },
                { field: 'maxPlaylistLength', type: 'number' },
                { field: 'faveGenres', type: 'array' },
                { field: 'faveArtists', type: 'array' },
                { field: 'blacklistedArtists', type: 'array' },
                { field: 'blacklistedSongs', type: 'songArray' },
            ],
        },
        {
            title: 'Update',
            url: '/api/preferences/update',
            method: 'PATCH',
            dataReqs: [
                { field: 'uid' },
                { field: 'allowExplicit', type: 'flag' },
                { field: 'lyricalInstrumental', type: 'number' },
                { field: 'lyricalLanguage' },
                { field: 'minSongLength', type: 'number' },
                { field: 'maxSongLength', type: 'number' },
                { field: 'minPlaylistLength', type: 'number' },
                { field: 'maxPlaylistLength', type: 'number' },
                { field: 'faveGenres', type: 'array' },
                { field: 'faveArtists', type: 'array' },
                { field: 'blacklistedArtists', type: 'array' },
                { field: 'blacklistedSongs', type: 'songArray' },
            ],
        },
    ],
    musicEndpoints: [
        {
            title: 'Get Music Platform',
            url: '/api/music/getPlatform',
            method: 'GET',
            dataReqs: [{ field: 'uid' }],
        },
        {
            title: 'Delete',
            url: '/api/music/delete',
            method: 'DELETE',
            dataReqs: [{ field: 'uid' }],
        },
        {
            title: 'Insert',
            url: '/api/music/insert',
            method: 'POST',
            dataReqs: [
                { field: 'uid' },
                { field: 'spotifyAccountID' },
                { field: 'appleMusicID' },
            ],
        },
        {
            title: 'Update',
            url: '/api/music/update',
            method: 'PATCH',
            dataReqs: [
                { field: 'uid' },
                { field: 'spotifyAccountID' },
                { field: 'appleMusicID' },
            ],
        },
    ],
    deviceEndpoints: [
        {
            title: 'Get Device',
            url: '/api/devices/getDevices',
            method: 'GET',
            dataReqs: [{ field: 'uid' }],
        },
        {
            title: 'Delete',
            url: '/api/devices/delete',
            method: 'DELETE',
            dataReqs: [{ field: 'uid' }],
        },
        {
            title: 'Insert',
            url: '/api/devices/insert',
            method: 'POST',
            dataReqs: [
                { field: 'uid' },
                { field: 'deviceList', type: 'array' },
                { field: 'selectedDeviceName' },
                { field: 'selectedDeviceID' },
                { field: 'tracking', type: 'flag' },
            ],
        },
        {
            title: 'Update',
            url: '/api/devices/update',
            method: 'PATCH',
            dataReqs: [
                { field: 'uid' },
                { field: 'deviceList', type: 'array' },
                { field: 'selectedDeviceName' },
                { field: 'selectedDeviceID' },
                { field: 'tracking', type: 'flag' },
            ],
        },
    ],
};

// Parse value based on dataReq type
function parseValue(value, type) {
    switch (type) {
        case 'number':
            if (value === '') return null;
            return parseFloat(value);
        case 'text':
            if (value === '') return null;
            return value;
        case 'flag':
            return value;
        case 'array':
        case 'songArray':
            if (value.trim() === '') return null;
            // Split on semicolon
            let tokens = value.split(';');
            tokens = tokens.map((tok) => tok.trim());
            if (type === 'array') return tokens;
            // Split on "by" to get song title and artist separately
            const result = [];
            tokens.forEach((tok) => {
                if (/^".+" by ".+"$/.test(tok)) {
                    let insideQuotes = false;
                    let firstQuote = -1;
                    let lastQuote = -1;
                    for (let i = 0; i < tok.length; i++) {
                        if (tok[i] === '"') {
                            if (insideQuotes) {
                                lastQuote = i;
                            } else {
                                firstQuote = i;
                            }
                            insideQuotes = !insideQuotes;
                        } else if (
                            i < tok.length - 2 &&
                            i > 0 &&
                            !insideQuotes &&
                            tok[i - 1] === ' ' &&
                            tok[i] === 'b' &&
                            tok[i + 1] === 'y' &&
                            tok[i + 2] === ' '
                        ) {
                            const songName = tok
                                .substring(firstQuote + 1, lastQuote)
                                .trim();
                            const remainder = tok.substring(i + 3).trim();
                            const songArtist = remainder
                                .substring(1, remainder.length - 1)
                                .trim();
                            result.push({ name: songName, artist: songArtist });
                            break;
                        }
                    }
                }
            });
            return result;
    }
}

// Get UI component for field based on type
function getRelevantUIComponent(field, type, handleUpdate) {
    switch (type) {
        case 'number':
        case 'text':
            return (
                <TextField
                    key={field}
                    autoFocus
                    margin="dense"
                    id={field}
                    label={field}
                    type={type}
                    fullWidth
                    variant="outlined"
                    onBlur={(e) => handleUpdate(field, e.target.value, type)}
                />
            );
        case 'flag':
            return (
                <FormGroup key={field}>
                    <FormControlLabel
                        control={
                            <Switch
                                defaultChecked
                                onBlur={(e) =>
                                    handleUpdate(field, e.target.checked, type)
                                }
                            />
                        }
                        label={field}
                    />
                </FormGroup>
            );
        case 'array':
        case 'songArray':
            return (
                <TextField
                    key={field}
                    autoFocus
                    margin="dense"
                    id={field}
                    label={field}
                    type="text"
                    fullWidth
                    variant="outlined"
                    helperText={`Semicolon-Separated List ${
                        type === 'songArray' ? '("Song" by "Artist")' : ''
                    }`}
                    onBlur={(e) => handleUpdate(field, e.target.value, type)}
                />
            );
        default:
            return '';
    }
}

function TestComponent({ title, url, method, dataReqs }) {
    const [dataOpen, setDataOpen] = useState(false);
    const [receivedOpen, setReceivedOpen] = useState(false);

    const handleClickOpen = () => setDataOpen(true);
    const handleClosePrompt = () => setDataOpen(false);

    const [state, setState] = useState({});
    function updateField(field, value, type) {
        setState((oldState) => {
            const copy = { ...oldState };
            copy[field] = parseValue(value, type);
            return copy;
        });
    }

    const [sentData, setSentData] = useState(null);
    const [receivedData, setReceivedData] = useState(null);

    const handleDataReceived = (data) => {
        setReceivedOpen(true);
        setReceivedData(data);
    };
    const handleCloseReceivedPrompt = () => {
        setReceivedOpen(false);
        setReceivedData(null);
        setSentData(null);
    };

    const handleSend = () => {
        setSentData(state);
        handleClosePrompt();
        // TODO: Show Response
        NetworkAPI._fetch(url, method, state)
            .then((response) => {
                handleDataReceived(response);
            })
            .catch((errorResponse) => {
                handleDataReceived(errorResponse);
            });
    };

    return (
        <div>
            <div className={styles.flexWrapper}>
                <b>{title}: </b>
                <button onClick={handleClickOpen}>Run</button>
            </div>
            <Dialog open={dataOpen} onClose={handleClosePrompt}>
                <DialogTitle>
                    Send {method} Request to {url}
                </DialogTitle>
                <DialogContent>
                    {dataReqs.length > 0 && (
                        <DialogContentText>
                            Fill out the request.
                        </DialogContentText>
                    )}

                    {dataReqs.map(({ field, type = 'text' }) => {
                        return getRelevantUIComponent(field, type, updateField);
                    })}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePrompt}>Cancel</Button>
                    <Button onClick={handleSend}>Send</Button>
                </DialogActions>
            </Dialog>

            {receivedData !== null && (
                <Dialog
                    open={receivedOpen}
                    maxWidth="lg"
                    fullWidth
                    onClose={handleCloseReceivedPrompt}
                >
                    <DialogTitle>Request Result</DialogTitle>
                    <DialogContent>
                        <div className={inter.className}>
                            <div style={{ marginBottom: '1em' }}>
                                <i>
                                    {method} Request to {url}
                                </i>
                            </div>
                            {receivedData.status !== -1 ? (
                                <div style={{ marginBottom: '1em' }}>
                                    Status: {receivedData.status}{' '}
                                    {receivedData.message}
                                </div>
                            ) : (
                                <div style={{ marginBottom: '1em' }}>
                                    {receivedData.message}
                                </div>
                            )}

                            <div>Response Data: </div>
                            <pre
                                style={{
                                    backgroundColor: '#DDD',
                                    padding: '0.5em',
                                    overflow: 'auto',
                                    fontFamily: 'monospace',
                                }}
                            >
                                {JSON.stringify(
                                    receivedData.data || receivedData.error,
                                    null,
                                    2
                                )}
                            </pre>
                            <div style={{ marginTop: '1em' }}>
                                Data You Sent:{' '}
                            </div>
                            <pre
                                style={{
                                    backgroundColor: '#DDD',
                                    padding: '0.5em',
                                    overflow: 'auto',
                                    fontFamily: 'monospace',
                                }}
                            >
                                {JSON.stringify(sentData, null, 2)}
                            </pre>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseReceivedPrompt} autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
}

function TestUsers() {
    return (
        <section>
            <div className={styles.sticky}>
                <h1>USER ENDPOINTS</h1>
            </div>
            <div className={styles.settingsSection}>
                {API.userEndpoints.map((obj, idx) => (
                    <TestComponent {...obj} key={idx} />
                ))}
            </div>
        </section>
    );
}

function TestDevices() {
    return (
        <section>
            <div className={styles.sticky}>
                <h1>DEVICE ENDPOINTS</h1>
            </div>
            <div className={styles.settingsSection}>
                {API.deviceEndpoints.map((obj, idx) => (
                    <TestComponent {...obj} key={idx} />
                ))}
            </div>
        </section>
    );
}

function TestMusic() {
    return (
        <section>
            <div className={styles.sticky}>
                <h1>MUSIC ENDPOINTS</h1>
            </div>
            <div className={styles.settingsSection}>
                {API.musicEndpoints.map((obj, idx) => (
                    <TestComponent {...obj} key={idx} />
                ))}
            </div>
        </section>
    );
}

function TestPreferences() {
    return (
        <section>
            <div className={styles.sticky}>
                <h1>PREFERENCE ENDPOINTS</h1>
            </div>
            <div className={styles.settingsSection}>
                {API.prefEndpoints.map((obj, idx) => (
                    <TestComponent {...obj} key={idx} />
                ))}
            </div>
        </section>
    );
}

function NavLinks() {
    const navLinks = [
        { name: 'Index', link: '/' },
        { name: 'Login', link: '/login' },
        { name: 'Home', link: '/home' },
        { name: 'Profile', link: '/profile' },
        { name: 'Register', link: '/register' },
        { name: 'Search', link: '/search' },
        { name: 'Settings', link: '/settings' },
        { name: 'Test Page', link: '/testPage' },
    ];

    return (
        <section>
            <div className={styles.sticky}>
                <h1>NAV LINKS</h1>
            </div>
            <div className={styles.settingsSection}>
                {navLinks.map(({ name, link }) => {
                    return (
                        <Link
                            key={name}
                            href={link}
                            style={{ display: 'block' }}
                        >
                            <div
                                className={styles.flexWrapper}
                                style={{
                                    justifyContent: 'center',
                                }}
                            >
                                <b>{name}</b>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

export default function TestPage() {
    return (
        <main className={inter.className}>
            <NavLinks />
            <TestUsers />
            <TestPreferences />
            <TestDevices />
            <TestMusic />
        </main>
    );
}
