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
import getPkce from 'oauth-pkce';

const theme = createTheme({
    palette: {
        primary: {
            main: '#69e267',
        },
    },
});

const inter = Inter({ subsets: ['latin'] });

// Generate a random 36-character string to use as the anti-CSRF state value
async function generateState() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let stateString = '';
    const charsLength = chars.length;

    for (let i = 0; i < 36; i++) {
        stateString += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return stateString;
}

export default function Display() {
    const [deviceName, setDeviceName] = useState('');

    async function connectDevice(e) {
        e.preventDefault();
        try {
            const userData = {
                username: localStorage.getItem('username'),
                deviceName,
            };
            await NetworkAPI.patch('/api/users/update', userData);

            // Generate 128 character long code_verifier and corresponding challenge needed for PKCE auth flow
            // https://dev.fitbit.com/build/reference/web-api/developer-guide/authorization/#Authorization-Code-Grant-Flow-with-PKCE
            getPkce(128, (error, { verifier, challenge }) => {
                if (!error) {
                    // Make code_verifier and challenge available to profile page later
                    localStorage.setItem('pkceVerifier', verifier);
                    localStorage.setItem('pkceChallenge', challenge);
                    let state = generateState();
                    localStorage.setItem('state', state);
                }

                const redirectUri =
                    process.env.NODE_ENV === 'development'
                        ? 'http://localhost:3000/profile'
                        : 'http://kadenceapp.com/profile';

                const urlParams = {
                    response_type: 'code',
                    client_id: '23QSGJ',
                    scope: 'activity cardio_fitness electrocardiogram heartrate profile settings',
                    code_challenge: localStorage.getItem('pkceChallenge'),
                    code_challenge_method: 'S256',
                    state: localStorage.getItem('state'),
                    redirect_uri: redirectUri,
                };

                console.table(urlParams);

                const fitbitAuthURL = `https://www.fitbit.com/oauth2/authorize?${new URLSearchParams(
                    urlParams
                ).toString()}`;

                localStorage.setItem('fromFitbit', 'true');
                window.location.assign(fitbitAuthURL);
            });
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
                </main>
            </PageLayout>
        </>
    );
}
