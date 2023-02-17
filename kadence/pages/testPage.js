import { Inter } from '@next/font/google';
import styles from '@/styles/Settings.module.css';

import * as React from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const inter = Inter({ subsets: ['latin'] });

// API Request Information
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
            dataReqs: [{ field: 'uid' }],
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

// Parse Value based on type
function parseValue(value, type) {
    switch (type) {
        case 'number':
            return;
        case 'text':
            return;
        case 'flag':
            return;
        case 'array':
        case 'songArray':
            return;
    }
}

function TestComponent({ title, url, method, dataReqs }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSend = () => {
        console.log('Sent');
        // TODO: Show Response
        handleClose();
    };

    const [state, setState] = React.useState({});

    return (
        <div>
            <div className={styles.flexWrapper}>
                <b>{title}: </b>
                <button onClick={handleClickOpen}>Run</button>
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {method} Request to {url}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>Fill out the request.</DialogContentText>

                    {dataReqs.map(({ field, type = 'text' }) => {
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
                                    />
                                );
                            case 'flag':
                                return (
                                    <FormGroup key={field}>
                                        <FormControlLabel
                                            control={<Switch defaultChecked />}
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
                                            type === 'songArray'
                                                ? '("Song" by "Artist")'
                                                : ''
                                        }`}
                                    />
                                );
                            default:
                                return '';
                        }
                    })}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSend}>Send</Button>
                </DialogActions>
            </Dialog>
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

export default function TestPage() {
    return (
        <main className={inter.className}>
            <TestUsers />
            <TestPreferences />
            <TestDevices />
            <TestMusic />
        </main>
    );
}
