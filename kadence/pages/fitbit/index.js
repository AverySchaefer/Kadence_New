import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Fitbit.module.css';
import Button from '@mui/material/Button';
import Textbox from '@/components/Textbox';
import NetworkAPI from '@/lib/networkAPI';
import PageLayout from '@/components/PageLayout';
import { useState } from 'react';
import { Inter } from '@next/font/google';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Dialog } from '@capacitor/dialog';

const theme = createTheme({
    palette: {
        primary: {
            main: '#69e267',
        },
    },
});

const inter = Inter({ subsets: ['latin'] });

export default function Display() {
    const [deviceName, setDeviceName] = useState('');

    async function disconnectDevice() {
        try {
            const userData = {
                username: localStorage.getItem('username'),
                deviceName: '',
            };
            await NetworkAPI.patch('/api/users/update', userData);
            localStorage.setItem('authorization_code', '');
            localStorage.setItem('access_token', '');
            localStorage.setItem('refresh_token', '');
        } catch (err) {
            Dialog.alert({
                title: 'Error Occurred',
                message: `Error occurred while saving: ${err.message}`,
            });
        }
    }

    async function connectDevice(e) {
        e.preventDefault();
        try {
            const userData = {
                username: localStorage.getItem('username'),
                deviceName,
            };
            await NetworkAPI.patch('/api/users/update', userData);
            const redirectUri =
                process.env.NODE_ENV === 'development'
                    ? 'http://localhost:3000/profile'
                    : 'http://kadenceapp.com/profile';
            console.log(redirectUri);
            window.location.assign(
                `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23QTD8&scope=activity+cardio_fitness+electrocardiogram+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&code_challenge=vaC5salqWAhM5k50MMvXGPxkTQGyQeLa0NpP_K3689Y&code_challenge_method=S256&state=3j3k386j3x606u7000324b4x4n0b0o06&redirect_uri=${encodeURI(
                    redirectUri
                )}`
            );
            console.log(window.location.search);
            const url = new URLSearchParams(window.location.search);
            const authorizationCode = url.get('code');

            const response = NetworkAPI.post('/api/fitbit/getTokens', {
                authorizationCode,
            });

            localStorage.setItem('authorization_code', authorizationCode);
            localStorage.setItem('access_token', response.json().access_token);
            localStorage.setItem(
                'refresh_token',
                response.json().refresh_token
            );
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
                <title>Fitbit Connect!</title>
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
            <PageLayout title="Connect a device" footer="" prevLink="/profile">
                <main className={[inter.className, styles.main].join(' ')}>
                    <Image
                        className={styles.img}
                        src="/KadenceLogo_green.svg"
                        alt="Kadence Logo"
                        width={380}
                        height={200}
                        priority
                    />
                    <Image
                        src="Fitbit-Symbol.jpg"
                        alt="Fitbit Logo"
                        width="500"
                        height="250"
                        className={styles.fitbitImage}
                        priority
                    />
                    <form
                        className={styles.form}
                        method="PATCH"
                        action="/api/users/update"
                        onSubmit={connectDevice}
                    >
                        <Textbox
                            name="Fitbit device name"
                            placeholder="Fitbit device name"
                            type="text"
                            required
                            onChange={(e) => setDeviceName(e.target.value)}
                        />
                        <ThemeProvider theme={theme}>
                            <Button
                                type="submit"
                                variant="contained"
                                className={`${styles.connectButton}`}
                            >
                                Connect
                            </Button>
                        </ThemeProvider>
                    </form>
                    <Button
                        variant="contained"
                        className={`${styles.connectButton}`}
                        onClick={() => disconnectDevice()}
                    >
                        Disconnect
                    </Button>
                </main>
            </PageLayout>
        </>
    );
}
