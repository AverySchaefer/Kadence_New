import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Register.module.css';
import Textbox from '@/components/Textbox';
import Button from '@/components/Button';
import { Inter } from '@next/font/google';
import { useRouter } from 'next/router';

import NetworkAPI from '@/lib/networkAPI';

const inter = Inter({ subsets: ['latin'] });

export default function Login() {
    const router = useRouter();

    function handleSubmit(e) {
        const form = e.target;
        const { username, oldPassword, newPassword, newConfirmedPassword } = form;
        e.preventDefault();

        // Send Request
        return NetworkAPI.post('/api/users/changePass', {
            username: username.value,
            oldPassword: oldPassword.value,
            newPassword: newPassword.value,
            newConfirmedPassword: newConfirmedPassword.value,
        })
            .then(({ data }) => {
                router.push('/login');
            })
            .catch(({ status, error }) => {
                console.log('Error: ', status, error);
            });
    }

    return (
        <>
            <Head>
                <title>Login</title>
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
                <Image
                    className={styles.img}
                    src="/logo.png"
                    alt="Kadence Logo"
                    width={380}
                    height={200}
                    priority
                />
                <form
                    className={styles.form}
                    method="POST"
                    action="/api/users/changePass"
                    onSubmit={handleSubmit}
                >
                    <Textbox name="username" placeholder="Username" required />
                    <Textbox
                        name="oldPassword"
                        placeholder="Old Password"
                        type="password"
                        required
                    />
                    <Textbox
                        name="newPassword"
                        placeholder="New Password"
                        type="password"
                        required
                    />
                    <Textbox
                        name="newConfirmedPassword"
                        placeholder="Confirm New Password"
                        type="password"
                        required
                    />
                    <Link className={styles.note} href="/login">
                        {"Don't mean to change passwords? Login here!"}
                    </Link>
                    <Button type="submit">Change Password</Button>
                </form>
            </main>
        </>
    );
}