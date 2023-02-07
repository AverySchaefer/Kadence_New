import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Settings.module.css';

function Header({ title, prevLink = null }) {
  return (
    <div className={styles.header}>
      {prevLink && (
        <Link href={prevLink}>
          <div className={styles.backButton}></div>
        </Link>
      )}
      <h1>{title}</h1>
    </div>
  );
}

function NavBar() {
  return (
    <div className={styles.navWrapper}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default function Settings() {
  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title="Settings" prevLink="/login" />
      <main className={styles.main}>
        <h1>Settings Page</h1>
      </main>
      <NavBar />
    </>
  );
}
