import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Register.module.css';
import { Inter } from '@next/font/google';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

export default function Index() {
    // Redirect to home page if logged in, otherwise to login page
    const router = useRouter();
    useEffect(() => {
        if (localStorage.getItem('username') !== null) {
            router.push('/profile');
        } else {
            router.push('/login');
        }
    });

    return (
        <>
            <Head>
                <title>Index</title>
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
            </main>
        </>
    );
}
