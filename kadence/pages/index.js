import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Register.module.css';
import Textbox from '@/components/Textbox';
import Button from '@/components/Button';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Register() {
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        <form className={styles.form} method="POST" action="">
          <Textbox name="username" placeholder="Username" />
          <Textbox name="password" placeholder="Password" password />
          <Link className={styles.note} href="/register">
            {"Don't have an account? Register here!"}
          </Link>
          <Button type="submit">
            Login
          </Button>
        </form>
      </main>
    </>
  );
}
