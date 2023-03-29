import NetworkAPI from '@/lib/networkAPI';
import Default from '@/lib/default';

import { Dialog } from '@capacitor/dialog';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import { useEffect, useState } from 'react';

import { Inter } from '@next/font/google';
import Image from 'next/image';

import smallStyles from '@/styles/SmallPlayer.module.css';
import largeStyles from '@/styles/LargePlayer.module.css';
import useMusicKit from '@/lib/useMusicKit';

const inter = Inter({ subsets: ['latin'] });

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

function handleError(err) {
    if (err.status === 400 || err.status === 401) {
        Dialog.alert({
            title: 'Error',
            message: `${err.message}`,
        });
    } else {
        console.log('Error: ', err);
    }
}

function SmallPlayer({
    playerData,
    songProgress,
    handleSkip,
    togglePlayState,
}) {
    const progress = convertSecondsToTimeString(songProgress);
    const duration = convertSecondsToTimeString(playerData.songDurationSeconds);
    return (
        <div className={[smallStyles.player, inter.className].join(' ')}>
            <button
                disabled={playerData.artistName === 'N/A'}
                className={smallStyles.togglePlayBtn}
                onClick={togglePlayState}
            >
                {playerData.isPlaying ? (
                    <PauseIcon sx={{ width: '100%', height: '100%' }} />
                ) : (
                    <PlayArrowIcon sx={{ width: '100%', height: '100%' }} />
                )}
            </button>
            <div className={smallStyles.topInfoContainer}>
                <a
                    href={playerData.songURI || null}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className={smallStyles.song}>
                        {playerData.songName}
                    </div>
                    <div className={smallStyles.artistAndProgressContainer}>
                        <div className={smallStyles.artist}>
                            {playerData.artistName}
                        </div>
                        <div className={smallStyles.progress}>
                            {progress} / {duration}
                        </div>
                    </div>
                </a>
            </div>

            <div className={smallStyles.albumImgContainer}>
                <a
                    href={playerData.songURI}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        src={
                            playerData.albumImageSrc ??
                            'https://demofree.sirv.com/nope-not-here.jpg'
                        }
                        alt="Album Cover"
                        width={50}
                        height={50}
                    />
                </a>
            </div>
            <button
                disabled={playerData.artistName === 'N/A'}
                className={smallStyles.skipBtn}
                onClick={handleSkip}
            >
                <SkipNextIcon sx={{ width: '100%', height: '100%' }} />
            </button>
        </div>
    );
}

function LargePlayer({
    playerData,
    songProgress,
    handleSkip,
    togglePlayState,
}) {
    const progress = convertSecondsToTimeString(songProgress);
    const duration = convertSecondsToTimeString(playerData.songDurationSeconds);
    return (
        <div className={[largeStyles.player, inter.className].join(' ')}>
            <div className={largeStyles.albumImgContainer}>
                <a
                    href={playerData.songURI}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        src={
                            playerData.albumImageSrc ??
                            'https://demofree.sirv.com/nope-not-here.jpg'
                        }
                        alt="Album Cover"
                        width={50}
                        height={50}
                    />
                </a>
            </div>
            <p className={largeStyles.songName}>{playerData.songName}</p>
            <p className={largeStyles.artistName}>{playerData.artistName}</p>
            <div className={largeStyles.songProgress}>
                <div>
                    <input
                        disabled
                        min={0}
                        max={playerData.songDurationSeconds}
                        value={songProgress}
                        className={largeStyles.slider}
                        type="range"
                    />
                </div>
                <div className={largeStyles.timestamps}>
                    <p>{progress}</p>
                    <p>{duration}</p>
                </div>
            </div>
            <div className={largeStyles.controlButtons}>
                <button
                    disabled={playerData.artistName === 'N/A'}
                    className={largeStyles.likeButton}
                >
                    <ThumbUpIcon sx={{ width: '100%', height: '100%' }} />
                </button>
                <button
                    disabled={playerData.artistName === 'N/A'}
                    className={largeStyles.togglePlayBtn}
                    onClick={togglePlayState}
                >
                    {playerData.isPlaying ? (
                        <PauseIcon sx={{ width: '100%', height: '100%' }} />
                    ) : (
                        <PlayArrowIcon sx={{ width: '100%', height: '100%' }} />
                    )}
                </button>
                <button
                    disabled={playerData.artistName === 'N/A'}
                    className={largeStyles.skipBtn}
                    onClick={handleSkip}
                >
                    <SkipNextIcon sx={{ width: '100%', height: '100%' }} />
                </button>
                <button
                    disabled={playerData.artistName === 'N/A'}
                    className={largeStyles.dislikeButton}
                >
                    <ThumbDownIcon sx={{ width: '100%', height: '100%' }} />
                </button>
            </div>
        </div>
    );
}

export default function MusicPlayer({ type = 'spotify', size = 'small' }) {
    const [playerData, setPlayerData] = useState(Default.playerData);
    const [timer, setTimer] = useState(0);
    const [pausedTimer, setPausedTimer] = useState(0);

    const MusicKit = useMusicKit();

    function fetchPlayerDataSpotify() {
        NetworkAPI.get('/api/spotify/playerInfo')
            .then(({ data }) => {
                setPlayerData(data);
                setTimer(0);
            })
            .catch(handleError);
    }

    function fetchPlayerDataApple() {
        // TODO: TEST
        const music = MusicKit.getInstance();
        setPlayerData({
            isPlaying: music.player.isPlaying === 'playing',
            progressSeconds: music.player.currentPlaybackProgress,
            songDurationSeconds: music.player.currentPlaybackDuration,
            songName: 'Player is not currently active!',
            songURI: '',
            artistName: 'N/A',
            albumImageSrc: 'https://demofree.sirv.com/nope-not-here.jpg',
        });
        setTimer(0);
    }

    function togglePlayStateSpotify() {
        const url = `/api/spotify/${playerData.isPlaying ? 'pause' : 'play'}`;

        NetworkAPI.put(url)
            .then(() => {
                setPlayerData((old) => ({
                    ...old,
                    isPlaying: !old.isPlaying,
                }));
                setTimeout(fetchPlayerDataSpotify, fetchAfterSkipDelayMs);
            })
            .catch(handleError);
    }

    function togglePlayStateApple() {
        // TODO: TEST
        const music = MusicKit.getInstance();
        if (playerData.isPlaying) {
            music
                .authorize()
                .then(() => {
                    music.pause();
                    setPlayerData((old) => ({
                        ...old,
                        isPlaying: !old.isPlaying,
                    }));
                    setTimeout(fetchPlayerDataApple, fetchAfterSkipDelayMs);
                })
                .catch(handleError);
        } else {
            music
                .authorize()
                .then(() => {
                    music
                        .play()
                        .then(() => {
                            setPlayerData((old) => ({
                                ...old,
                                isPlaying: !old.isPlaying,
                            }));
                            setTimeout(
                                fetchPlayerDataApple,
                                fetchAfterSkipDelayMs
                            );
                        })
                        .catch(handleError);
                })
                .catch(handleError);
        }
    }

    function handleSkipSpotify() {
        NetworkAPI.post('/api/spotify/skip')
            .then(() =>
                setTimeout(fetchPlayerDataSpotify, fetchAfterSkipDelayMs)
            )
            .catch(handleError);
    }

    function handleSkipApple() {
        // TODO: TEST
        const music = MusicKit.getInstance();
        music
            .skipToNextItem()
            .then(() => setTimeout(fetchPlayerDataApple, fetchAfterSkipDelayMs))
            .catch(handleError);
    }

    const fetchPlayerData =
        type === 'spotify' ? fetchPlayerDataSpotify : fetchPlayerDataApple;

    // Initial get on page load
    useEffect(fetchPlayerData, [fetchPlayerData]);

    // Establish timer to refresh every so often
    useEffect(() => {
        const counterID = setInterval(() => {
            if (
                playerData &&
                playerData.progressSeconds + timer + 1 >
                    playerData.songDurationSeconds
            ) {
                fetchPlayerData();
            } else if (timer + 1 === playerRefreshRateSeconds) {
                fetchPlayerData();
            } else if (playerData && playerData.isPlaying) {
                setTimer((old) => old + 1);
            } else if (pausedTimer + 1 === playerRefreshRateSeconds) {
                fetchPlayerData();
                setPausedTimer(0);
            } else {
                setPausedTimer((old) => old + 1);
            }
        }, 1000);
        return () => clearInterval(counterID);
    }, [fetchPlayerData, timer, playerData, pausedTimer]);

    if (size === 'small') {
        return (
            <SmallPlayer
                playerData={playerData}
                songProgress={playerData.progressSeconds + timer}
                handleSkip={
                    type === 'spotify' ? handleSkipSpotify : handleSkipApple
                }
                togglePlayState={
                    type === 'spotify'
                        ? togglePlayStateSpotify
                        : togglePlayStateApple
                }
            />
        );
    }
    if (size === 'large') {
        return (
            <LargePlayer
                playerData={playerData}
                songProgress={playerData.progressSeconds + timer}
                handleSkip={
                    type === 'spotify' ? handleSkipSpotify : handleSkipApple
                }
                togglePlayState={
                    type === 'spotify'
                        ? togglePlayStateSpotify
                        : togglePlayStateApple
                }
            />
        );
    }
    return 'Invalid player size specified!';
}
