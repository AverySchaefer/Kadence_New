import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Register.module.css';
import { Button, PageLayout, Textbox } from '@/components/';
import { Inter } from '@next/font/google';
import { Dialog } from '@capacitor/dialog';
import { useRouter } from 'next/router';

import Password from '@/lib/passwordStrength';
import NetworkAPI from '@/lib/networkAPI';

const inter = Inter({ subsets: ['latin'] });

export default function Register() {
    const router = useRouter();

    async function handleSubmit(e) {
        const form = e.target;
        console.log('Handling the submission:');
        const { email, username, password, confirmedPassword } = form;
        e.preventDefault();

        // Validate Fields
        if (password.value !== confirmedPassword.value) {
            Dialog.alert({
                title: 'Error',
                message: 'Passwords do not match!',
            });
            return;
        }
        if (!Password.isStrong(password.value)) {
            Dialog.alert({
                title: 'Weak Password',
                message: Password.errorMessage,
            });
            return;
        }

        // Send Request
        try {
            const { data } = await NetworkAPI.post('/api/users/signup', {
                email: email.value,
                username: username.value,
                password: password.value,
                confirmedPassword: confirmedPassword.value,
            });
            if (data) {
                Dialog.alert({
                    title: 'Success',
                    message: `Account created successfully!`,
                });
                const jwt = data.token;
                localStorage.setItem('jwt', jwt);
                localStorage.setItem('username', username.value);
                router.push('/registerInfo');
            }
        } catch (err) {
            Dialog.alert({
                title: 'Error Occurred',
                message: `${err.status} ${err}`,
            });
        }
    }

    return (
        <PageLayout title="Register" includeTitle={false} includeNav={false}>
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
                    action="/api/users/signup"
                    onSubmit={handleSubmit}
                >
                    <Textbox
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                    />
                    <Textbox
                        name="username"
                        placeholder="Username"
                        type="text"
                        required
                    />
                    <Textbox
                        name="password"
                        placeholder="Password"
                        type="password"
                        required
                    />
                    <Textbox
                        name="confirmedPassword"
                        placeholder="Confirm Password"
                        type="password"
                        required
                    />
                    <Link className={styles.note} href="/login">
                        Already have an account? Login here!
                    </Link>
                    <Button type="submit">
                        {/* <Link href="/home">Register</Link> */}
                        Register
                    </Button>
                </form>
            </main>
        </PageLayout>
    );
}
