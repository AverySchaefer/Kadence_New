import * as React from 'react';
import Head from 'next/head';
import Textbox from '@/components/Textbox';
import TextArea from '@/components/TextArea';
import styles from '@/styles/Platform.module.css';
import { Box, Stack, Button } from '@mui/material/';
import { Dialog } from '@capacitor/dialog';
import { useRouter } from 'next/router';
import { Inter } from '@next/font/google';
import NetworkAPI from '@/lib/networkAPI';

const inter = Inter({ subsets: ['latin'] });


export default function ChangeProfile() {

    const [favoriteArtist, setFaveArtist] = React.useState('');
    const [favoriteAlbum, setFaveAlbum] = React.useState('');
    const [favoriteSong, setFaveSong] = React.useState('');
    const [bio, setBio] = React.useState('');

    const [loaded, setLoaded] = React.useState(false);

    const router = useRouter();

    // Fetch values from database
    React.useEffect(() => {
        async function fetchData() {
            try {
                // Get User Data first
                const { data: userData } = await NetworkAPI.get('/api/users/getUsers', {
                    username: localStorage.getItem('username'),
                });
                setFaveArtist(userData.favoriteArtist);
                setFaveAlbum(userData.favoriteAlbum);
                setFaveSong(userData.favoriteSong);
                setBio(userData.bio);
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

    async function submitData() {
        const newProfileData = {
            username: localStorage.getItem('username'),
            favoriteArtist,
            favoriteAlbum,
            favoriteSong,
            bio,
        };

        try {
            await NetworkAPI.patch('/api/users/update', newProfileData);
            router.push('/profile');
        } catch (err) {
            Dialog.alert({
                title: 'Error',
                message: `An error occurred while submitting your data: ${err.message}.`,
            });
        }
    }

    if (!loaded) return '';

    return (
        <>
            <Head>
                <title>Change Profile</title>
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
                <Box>
                    <Stack spacing={2} alignItems="center">
                        <h2>Write a short bio!</h2>
                        <TextArea
                            name="bio"
                            placeholder="Bio"
                            onChange={(e) => setBio(e.target.value)}
                            value={bio}
                        />
                        <h2>Favorite Artist</h2>
                        <Textbox
                            name="favoriteArtist"
                            type="text"
                            placeholder="Artist"
                            onChange={(e) => setFaveArtist(e.target.value)}
                            value={favoriteArtist}
                            required
                        />
                        <h2>Favorite Song</h2>
                        <Textbox
                            name="favoriteSong"
                            type="text"
                            placeholder="Song"
                            onChange={(e) => setFaveSong(e.target.value)}
                            value={favoriteSong}
                            required
                        />
                        <h2>Favorite Album</h2>
                        <Textbox
                            name="favoriteAlbum"
                            type="text"
                            placeholder="Album"
                            onChange={(e) => setFaveAlbum(e.target.value)}
                            value={favoriteAlbum}
                            required
                        />
                        <br />
                        <Button 
                            variant="contained"                                 
                            sx={{ width: "25ch", backgroundColor: "#69e267", "&:active": {backgroundColor: "#69e267"} }}
                            onClick={submitData}
                        >
                            Save
                        </Button>
                    </Stack>
                </Box>
            </main>
        </>
    );
}