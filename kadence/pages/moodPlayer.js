import PageLayout from '@/components/PageLayout';
import MusicPlayer from '@/components/MusicPlayer';
import Textbox from '@/components/Textbox';
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { Dialog } from '@capacitor/dialog';
import { useRouter } from 'next/router';
import styles from '@/styles/MoodPlayer.module.css';

export default function LargePlayer() {
    const [playlistURIs, setPlaylistURIs] = useState(null);
    const [playlistName, setPlaylistName] = useState('');

    useEffect(() => {
        setPlaylistURIs(JSON.parse(localStorage.getItem('playlistURIs')));
    }, []);

    const router = useRouter();

    async function createPlaylist(e) {
        e.preventDefault();
        const saveRoute = '/api/generation/save';
        await fetch(saveRoute, {
            method: 'POST',
            body: JSON.stringify({
                playlistName,
                playlistArray: playlistURIs,
            }),
        });
        Dialog.alert({
            title: 'Success',
            message: 'Your playlist has been saved!',
        });
        localStorage.setItem('playlistURIs', null);
        router.push('/spotify/playlistSaved');
    }

    return (
        <PageLayout title="" includeNav={true}>
            <div style={{ overflow: 'hidden', height: '100%' }}>
                <MusicPlayer size="large" />
                {playlistURIs && (
                    <>
                        <form
                            method="POST"
                            action="/api/generation/save"
                            onSubmit={createPlaylist}
                            className={styles.form}
                        >
                            <Textbox
                                name="playlistName"
                                type="text"
                                placeholder="Playlist Name"
                                onChange={(e) =>
                                    setPlaylistName(e.target.value)
                                }
                                required
                            />
                            <Button
                                variant="contained"
                                type="submit"
                                sx={{ borderRadius: 3, width: '100%' }}
                                className={`${styles.generateButton}`}
                            >
                                Save Playlist
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </PageLayout>
    );
}
