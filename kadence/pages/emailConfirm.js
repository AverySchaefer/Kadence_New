import Image from 'next/image';
import styles from '@/styles/Register.module.css';
import { Inter } from '@next/font/google';
import { PageLayout, Button } from '@/components';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

function EmailConfirm() {
    const router = useRouter();

    function handleClick() {
        router.push('/login');
    }
    return (
        <PageLayout title="Email Sent" includeNav={false} includeTitle={false}>
            <main className={[inter.className, styles.main].join(' ')}>
                <Image
                    className={styles.img}
                    src="/KadenceLogo_green.svg"
                    alt="Kadence Logo"
                    width={380}
                    height={200}
                    priority
                />
                <p style={{ textAlign: 'center' }}>
                    Check the provided email address for the recovery link!
                </p>
                <Button onClick={handleClick}>Login Page</Button>
            </main>
        </PageLayout>
    );
}

export default EmailConfirm;
