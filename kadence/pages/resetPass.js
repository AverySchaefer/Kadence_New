import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Register.module.css';
import { Button, Textbox, PageLayout } from '@/components/';
import { Inter } from '@next/font/google';
import { useRouter } from 'next/router';
import { Dialog } from '@capacitor/dialog';

import NetworkAPI from '@/lib/networkAPI';
import {
    passwordIsStrong,
    clientSideHash,
    weakPasswordMessage,
} from '@/lib/passwordUtils';

const inter = Inter({ subsets: ['latin'] });

export default function ResetPass() {
    const router = useRouter();

    async function handleSubmit(e) {
        const form = e.target;
        const { username, newPassword, newConfirmedPassword } = form;
        e.preventDefault();

        // Validate Fields
        if (newPassword.value !== newConfirmedPassword.value) {
            Dialog.alert({
                title: 'Error',
                message: 'Passwords do not match!',
            });
            return;
        }
        if (!passwordIsStrong(newPassword.value)) {
            Dialog.alert({
                title: 'Weak Password',
                message: weakPasswordMessage,
            });
            return;
        }

        const hashedPassword = clientSideHash(
            username.value,
            newPassword.value
        );

        // Send Request
        NetworkAPI.post('/api/users/resetPass', {
            username: username.value,
            newPassword: hashedPassword,
            newConfirmedPassword: hashedPassword,
        })
            .then(() => router.push('/login'))
            .catch((err) =>
                Dialog.alert({
                    title: 'Error Occurred',
                    message: `${err.status} ${err}`,
                })
            );
    }

    return (
        <PageLayout
            title="Reset Password"
            includeNav={false}
            includeTitle={false}
        >
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
                    action="/api/users/resetPass"
                    onSubmit={handleSubmit}
                >
                    <Textbox name="username" placeholder="Username" required />
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
                    <Link
                        className={styles.note}
                        style={{ textAlign: 'center' }}
                        href="/login"
                    >
                        {'Remember your password? Login here!'}
                    </Link>
                    <Button type="submit">Reset Password</Button>
                </form>
            </main>
        </PageLayout>
    );
}
