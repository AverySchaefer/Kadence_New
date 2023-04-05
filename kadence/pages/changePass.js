import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Register.module.css';
import { Button, PageLayout, Textbox } from '@/components/';
import { Inter } from '@next/font/google';
import { useRouter } from 'next/router';
import { Dialog } from '@capacitor/dialog';

import {
    passwordIsStrong,
    clientSideHash,
    weakPasswordMessage,
} from '@/lib/passwordUtils';
import NetworkAPI from '@/lib/networkAPI';

const inter = Inter({ subsets: ['latin'] });

export default function Login() {
    const router = useRouter();

    async function handleSubmit(e) {
        const form = e.target;
        const { username, oldPassword, newPassword, newConfirmedPassword } =
            form;
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

        const oldHashedPassword = clientSideHash(username, oldPassword);
        const hashedPassword = clientSideHash(username, newPassword);

        // Send Request
        NetworkAPI.post('/api/users/changePass', {
            username: username.value,
            oldPassword: oldHashedPassword,
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
            title="Change Password"
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
                    <Link
                        className={styles.note}
                        style={{ textAlign: 'center' }}
                        href="/login"
                    >
                        {'Want to keep your password? Login here!'}
                    </Link>
                    <Button type="submit">Change Password</Button>
                </form>
            </main>
        </PageLayout>
    );
}
