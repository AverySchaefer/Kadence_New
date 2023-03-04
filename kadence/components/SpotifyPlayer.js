import NetworkAPI from '@/lib/networkAPI';
import styles from '@/styles/Player.module.css';

import { Dialog } from '@capacitor/dialog';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const playerRefreshRateSeconds = 10;
const fetchAfterSkipDelayMs = 250;

function convertSecondsToTimeString(s) {
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    if (seconds < 10) {
        return `${minutes}:0${seconds}`;
    }
    return `${minutes}:${seconds}`;
}

export default function SpotifyPlayer() {
    const [playerData, setPlayerData] = useState({});
    const [timer, setTimer] = useState(0);
    const [pausedTimer, setPausedTimer] = useState(0);

    function getPlayerInfo() {
        NetworkAPI.get('/api/spotify/playerInfo')
            .then(({ data }) => {
                setPlayerData(data);
                setTimer(0);
            })
            .catch((err) => {
                if (err.status === 400 || err.status === 401) {
                    Dialog.alert({
                        title: 'Error',
                        message: `${err.message}`,
                    });
                } else {
                    console.log('Error: ', err);
                }
            });
    }

    function togglePlayState() {
        if (playerData.isPlaying) {
            NetworkAPI.put('/api/spotify/pause')
                .then(() => {
                    setPlayerData((old) => ({ ...old, isPlaying: false }));
                    setTimeout(getPlayerInfo, fetchAfterSkipDelayMs);
                })
                .catch((err) => {
                    if (err.status === 400 || err.status === 401) {
                        Dialog.alert({
                            title: 'Error',
                            message: `${err.message}`,
                        });
                    } else {
                        console.log('Error: ', err);
                    }
                });
        } else {
            NetworkAPI.put('/api/spotify/play')
                .then(() => {
                    setPlayerData((old) => ({ ...old, isPlaying: true }));
                    setTimeout(getPlayerInfo, fetchAfterSkipDelayMs);
                })
                .catch((err) => {
                    if (err.status === 400 || err.status === 401) {
                        Dialog.alert({
                            title: 'Error',
                            message: `${err.message}`,
                        });
                    } else {
                        console.log('Error: ', err);
                    }
                });
        }
    }

    function handleSkip() {
        NetworkAPI.post('/api/spotify/skip')
            .then(() => setTimeout(getPlayerInfo, fetchAfterSkipDelayMs))
            .catch((err) => {
                if (err.status === 400 || err.status === 401) {
                    Dialog.alert({
                        title: 'Error',
                        message: `${err.message}`,
                    });
                } else {
                    console.log('Error: ', err);
                }
            });
    }

    // Initial get on page load
    useEffect(getPlayerInfo, []);

    // Establish timer to refresh every so often
    useEffect(() => {
        const counterID = setInterval(() => {
            if (
                playerData &&
                playerData.progressSeconds + timer + 1 >
                    playerData.songDurationSeconds
            ) {
                getPlayerInfo();
            } else if (timer + 1 === playerRefreshRateSeconds) {
                getPlayerInfo();
            } else if (playerData && playerData.isPlaying) {
                setTimer((old) => old + 1);
            } else if (pausedTimer + 1 === playerRefreshRateSeconds) {
                getPlayerInfo();
                setPausedTimer(0);
            } else {
                setPausedTimer((old) => old + 1);
            }
        }, 1000);
        return () => clearInterval(counterID);
    }, [timer, playerData, pausedTimer]);

    const progress = convertSecondsToTimeString(
        playerData.progressSeconds + timer
    );
    const duration = convertSecondsToTimeString(playerData.songDurationSeconds);

    return (
        <div className={styles.container}>
            <button onClick={togglePlayState}>
                {playerData.isPlaying ? (
                    <PauseIcon sx={{ width: '100%', height: '100%' }} />
                ) : (
                    <PlayArrowIcon sx={{ width: '100%', height: '100%' }} />
                )}
            </button>
            <button onClick={handleSkip}>
                <SkipNextIcon sx={{ width: '100%', height: '100%' }} />
            </button>
            <p>Current Song: {playerData.songName}</p>
            <p>Artist: {playerData.artistName}</p>
            <p>Album: {playerData.albumName}</p>
            <p>
                Progress: {progress} / {duration}
            </p>
            <Image
                src={playerData.albumImageSrc}
                alt="Album Cover"
                width={64}
                height={64}
            />
        </div>
    );
}
