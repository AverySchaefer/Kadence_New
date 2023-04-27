import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Register.module.css';
import { Button } from '@mui/material';
import { PageLayout, Textbox } from '@/components/';
import { Inter } from '@next/font/google';
import { Dialog } from '@capacitor/dialog';
import { useRouter } from 'next/router';

import {
    passwordIsStrong,
    clientSideHash,
    weakPasswordMessage,
} from '@/lib/passwordUtils';

import NetworkAPI from '@/lib/networkAPI';

const inter = Inter({ subsets: ['latin'] });

export default function Register() {
    const router = useRouter();

    async function handleSubmit(e) {
        const form = e.target;
        const email = form.email.value.trim();
        const password = form.password.value.trim();
        const username = form.username.value.trim();
        const confirmedPassword = form.confirmedPassword.value.trim();

        e.preventDefault();

        // Validate Fields
        if (!email || !password || !username || !confirmedPassword) {
            Dialog.alert({
                title: 'Error',
                message: 'No fields can be left empty!',
            });
            return;
        }

        if (password !== confirmedPassword) {
            Dialog.alert({
                title: 'Error',
                message: 'Passwords do not match!',
            });
            return;
        }
        if (!passwordIsStrong(password)) {
            Dialog.alert({
                title: 'Weak Password',
                message: weakPasswordMessage,
            });
            return;
        }

        const hashedPassword = clientSideHash(username, password);

        // Send Request
        try {
            const { data } = await NetworkAPI.post('/api/users/signup', {
                email,
                username,
                password: hashedPassword,
                confirmedPassword: hashedPassword,
            });
            if (data) {
                Dialog.alert({
                    title: 'Success',
                    message: `Account created successfully!`,
                });
                const jwt = data.token;
                localStorage.setItem('jwt', jwt);
                localStorage.setItem('username', username);
                router.push('/registerInfo');
            }
        } catch (err) {
            Dialog.alert({
                title: 'Error Occurred',
                message: `${err.status} ${err}`,
            });
        }
    }

    return (
        <PageLayout title="Register" includeTitle={false} includeNav={false}>
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
                    action="/api/users/signup"
                    onSubmit={handleSubmit}
                >
                    <Textbox
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                    />
                    <Textbox
                        name="username"
                        placeholder="Username"
                        type="text"
                        required
                    />
                    <Textbox
                        name="password"
                        placeholder="Password"
                        type="password"
                        required
                    />
                    <Textbox
                        name="confirmedPassword"
                        placeholder="Confirm Password"
                        type="password"
                        required
                    />
                    <Link className={styles.note} href="/login">
                        Already have an account? Login here!
                    </Link>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#69e267',
                            color: '#242b2e',
                            width: '100%',
                            '&:active': { backgroundColor: '#69e267' },
                        }}
                        type="submit"
                    >
                        Register
                    </Button>
                </form>
            </main>
        </PageLayout>
    );
}
