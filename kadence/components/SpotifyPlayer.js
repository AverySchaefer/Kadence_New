import NetworkAPI from '@/lib/networkAPI';
import styles from '@/styles/Player.module.css';

import { Dialog } from '@capacitor/dialog';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SpotifyPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playerData, setPlayerData] = useState({});

    function togglePlayState() {
        if (isPlaying) {
            // Do Pause
            NetworkAPI.put('/api/spotify/pause')
                .then(() => setIsPlaying(false))
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
            // Do Play
            NetworkAPI.put('/api/spotify/play')
                .then(() => setIsPlaying(true))
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
            .then(() => setIsPlaying(true))
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

    function getPlayerInfo() {
        NetworkAPI.get('/api/spotify/playerInfo')
            .then(({ data }) => {
                setIsPlaying(data.isPlaying);
                setPlayerData(data);

                console.log(data);
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

    useEffect(() => {
        // Refresh player information every x seconds
        getPlayerInfo();
        const intervalID = setInterval(getPlayerInfo, 60000);
        return () => clearInterval(intervalID);
    }, []);

    return (
        <div className={styles.container}>
            <button onClick={togglePlayState}>
                {playerData.isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={handleSkip}>Skip</button>
            <p>Progress: {playerData.progressPercentage}%</p>
            <p>Current Song: {playerData.songName}</p>
            <p>Artist: {playerData.artistName}</p>
            <p>Album: {playerData.albumName}</p>
            <Image
                src={playerData.albumImageSrc}
                alt="Album Cover"
                width={100}
                height={100}
            />
        </div>
    );
}
