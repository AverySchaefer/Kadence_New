import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import SettingsIcon from '@mui/icons-material/Settings';
import { Fab } from '@mui/material/';
import { Inter } from '@next/font/google';

import styles from '@/styles/PageLayout.module.css';

import BottomNav from './BottomNav';
import Player from './Player';

const inter = Inter({ subsets: ['latin'] });

export default function PageLayout({
    includeNav = true,
    includeSettings = false,
    title = 'Kadence',
    activeTab = '',
    footer = <BottomNav name={activeTab} />,
    player = '',
    prevLink = '',
    children,
}) {
    const { data: session } = useSession();

    const playerName = player.toLowerCase().trim();
    const showPlayer =
        !!session && (playerName === 'spotify' || playerName === 'apple');

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="Playlist Generating App" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={[styles.pageContainer, inter.className].join(' ')}>
                <div className={styles.headerContainer}>
                    {prevLink && (
                        <Link href={prevLink}>
                            <div className={styles.backButton}></div>
                        </Link>
                    )}
                    <h1>{title}</h1>

                    {includeSettings && (
                        <div className={styles.settingsButton}>
                            <Link href="/settings">
                                <Fab size="small" aria-label="settings">
                                    <SettingsIcon />
                                </Fab>
                            </Link>
                        </div>
                    )}
                </div>
                <main className={styles.mainContainer}>{children}</main>
                {showPlayer && (
                    <div className={styles.playerContainer}>
                        <Player type={playerName} />
                    </div>
                )}
                {includeNav && (
                    <div className={styles.navContainer}>{footer}</div>
                )}
            </div>
        </>
    );
}
