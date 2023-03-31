import Head from 'next/head';
import Link from 'next/link';

import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Inter } from '@next/font/google';

import styles from '@/styles/PageLayout.module.css';

import BottomNav from './BottomNav';
import MusicPlayer from './MusicPlayer';

const inter = Inter({ subsets: ['latin'] });

export default function PageLayout({
    includeNav = true,
    includeUpperRightIcon = false,
    includeTitle = true,
    upperRightIcon = (
        <Link href="/settings">
            <SettingsIcon />
        </Link>
    ),
    title = 'Kadence',
    activeTab = '',
    player = '',
    prevLink = '',
    children,
}) {
    const playerName = player.toLowerCase().trim();
    const showPlayer = playerName === 'spotify' || playerName === 'apple';

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
                {includeTitle && (
                    <div className={styles.headerContainer}>
                        <div className={styles.title}>
                            {prevLink && (
                                <Link href={prevLink}>
                                    <ArrowBackIcon />
                                </Link>
                            )}
                            {title}
                        </div>

                        {includeUpperRightIcon && (
                            <div className={styles.upperRightIcon}>
                                {upperRightIcon}
                            </div>
                        )}
                    </div>
                )}
                <main className={styles.mainContainer}>{children}</main>
                {showPlayer && (
                    <div className={styles.playerContainer}>
                        <MusicPlayer size="small" />
                    </div>
                )}
                {includeNav && (
                    <div className={styles.navContainer}>
                        <BottomNav name={activeTab} />
                    </div>
                )}
            </div>
        </>
    );
}
