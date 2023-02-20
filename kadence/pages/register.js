import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Register.module.css';
import Textbox from '@/components/Textbox';
import Button from '@/components/Button';
import { Inter } from '@next/font/google';
import { Dialog } from '@capacitor/dialog';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

export default function Register() {
    return (
        <>
            <Head>
                <title>Register</title>
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
                    action="/api/users/insert"
                    onSubmit={(e) => {
                        const router = useRouter();
                        const form = e.target;
                        const { password, password2 } = form;
                        if (password.value !== password2.value) {
                            Dialog.alert({
                                title: 'Error',
                                message: 'Passwords do not match!',
                            });
                            e.preventDefault();
                        }
                        router.push('/registerInfo');
                    }}
                >
                    <Textbox name="email" type="email" placeholder="Email" required/>
                    <Textbox
                        name="username"
                        placeholder="Username"
                        type="text"
                    />
                    <Textbox
                        name="password"
                        placeholder="Password"
                        type="password"
                    />
                    <Textbox
                        name="password2"
                        placeholder="Confirm Password"
                        type="password"
                    />
                    <Link className={styles.note} href="../login">
                        Already have an account? Login here!
                    </Link>
                    <Button type="submit">
                        {/* <Link href="/home">Register</Link> */}
                        Register
                    </Button>
                </form>
            </main>
        </>
    );
}
