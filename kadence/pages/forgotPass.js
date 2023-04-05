import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Register.module.css';
import Textbox from '@/components/Textbox';
import Button from '@/components/Button';
import { Inter } from '@next/font/google';
import { useRouter } from 'next/router';
import { Dialog } from '@capacitor/dialog';

import NetworkAPI from '@/lib/networkAPI';
import { PageLayout } from '@/components';

const inter = Inter({ subsets: ['latin'] });

export default function ForgotPass() {
    const router = useRouter();

    async function handleSubmit(e) {
        const form = e.target;
        const { email } = form;
        e.preventDefault();

        // Send Request
        NetworkAPI.post('/api/users/forgottenPass', { email: email.value })
            .then(() => router.push('/emailConfirm'))
            .catch((err) =>
                Dialog.alert({
                    title: 'Error Occurred',
                    message: `${err.status} ${err}`,
                })
            );
    }

    return (
        <PageLayout
            title="Forgot Password"
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
                    action="/api/users/forgottenPass"
                    onSubmit={handleSubmit}
                >
                    <h4 style={{ textAlign: 'center' }}>
                        Please enter the email address associated with the
                        account.
                    </h4>
                    <Textbox
                        name="email"
                        placeholder="Email Address"
                        required
                    />
                    <Link className={styles.note} href="/login">
                        {'Remember your password? Login here!'}
                    </Link>
                    <Button type="submit">Send Email!</Button>
                </form>
            </main>
        </PageLayout>
    );
}
