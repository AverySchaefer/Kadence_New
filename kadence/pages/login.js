import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Register.module.css';
import { Button, Textbox } from '@/components/';
import { Inter } from '@next/font/google';
import { useRouter } from 'next/router';

import NetworkAPI from '@/lib/networkAPI';

const inter = Inter({ subsets: ['latin'] });

export default function Login() {
    const router = useRouter();

    async function handleSubmit(e) {
        const form = e.target;
        const { username, enteredPW } = form;
        e.preventDefault();

        try {
            const data = await NetworkAPI.get('/api/users/login', {
                username: username.value,
                enteredPW: enteredPW.value,
            });

            if (data) {
                router.push('/home');
            }
        } catch (err) {
            // TODO: handle error (wrong password, perhaps)
            console.log('Error: ', err.status, err.statusText);
            console.log(err);
        }
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
                    <Link className={styles.note} href="/register">
                        {"Don't have an account? Register here!"}
                    </Link>
                    <Button type="submit">Login</Button>
                </form>
            </main>
        </>
    );
}
