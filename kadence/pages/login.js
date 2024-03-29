import Image from 'next/image';
import Link from 'next/link';
import { PageLayout, Button, Textbox } from '@/components/';
import styles from '@/styles/Register.module.css';
import { Inter } from '@next/font/google';
import { useRouter } from 'next/router';
import { Dialog } from '@capacitor/dialog';
import { Divider } from '@mui/material';

import NetworkAPI from '@/lib/networkAPI';

const inter = Inter({ subsets: ['latin'] });

export default function Login() {
    const router = useRouter();

    async function handleSubmit(e) {
        const form = e.target;
        const { username: formUsername, enteredPW: formPassword } = form;
        e.preventDefault();

        // Send Request
        try {
            const { data } = await NetworkAPI.get('/api/users/login', {
                username: formUsername.value,
                enteredPW: formPassword.value,
            });
            if (data) {
                console.log('Adding things to local storage');
                console.log(data);
                // Publish user to subscribers and store in local storage to stay logged in between page refreshes
                const jwt = data.token;
                localStorage.setItem('jwt', jwt);
                localStorage.setItem('username', formUsername.value);
                router.push('/home');
            } else {
                return;
            }
        } catch (err) {
            Dialog.alert({
                title: 'Error Occurred',
                message: `${err.status} ${err}`,
            });
            return;
        }

        try {
            // Get User Data first
            const { data: userData } = await NetworkAPI.get(
                '/api/users/getUsers',
                {
                    username: localStorage.getItem('username'),
                }
            );
            localStorage.setItem('mood', userData.mood);
            localStorage.setItem('waitSave', userData.waitToSave);
            localStorage.setItem('playlistURIs', null);
            localStorage.setItem('platform', userData.musicPlatform);
        } catch (err) {
            Dialog.alert({
                title: 'Error',
                message: `An error occurred while fetching your data: ${err.message}.`,
            });
        }
    }

    const buttonStyle = {
        color: '#242B2E',
        backgroundColor: '#69E267',
    };

    return (
        <PageLayout title="Login" includeTitle={false} includeNav={false}>
            <main className={[inter.className, styles.main].join(' ')}>
                <Image
                    className={styles.img}
                    src="/KadenceLogo_green.svg"
                    alt="Kadence Logo"
                    width={380}
                    height={200}
                    priority
                />
                <form
                    className={styles.form}
                    method="POST"
                    action="/api/users/login"
                    onSubmit={handleSubmit}
                >
                    <Textbox name="username" placeholder="Username" required />
                    <Textbox
                        name="enteredPW"
                        placeholder="Password"
                        type="password"
                        required
                    />
                    <Button type="submit" style={buttonStyle}>
                        Login
                    </Button>
                    <Divider className={styles.divider} />
                    <div className={styles.flexWrapper}>
                        <Link className={styles.note} href="/register">
                            {'Register account'}
                        </Link>
                        <Link className={styles.note} href="/forgotPass">
                            {'Recover password'}
                        </Link>
                    </div>
                </form>
            </main>
        </PageLayout>
    );
}
