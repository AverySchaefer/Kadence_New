import styles from '@/styles/Header.module.css';

import Link from 'next/link';

export default function Header({ title, prevLink = null }) {
    return (
        <div className={styles.header}>
            {prevLink && (
                <Link href="/profile">
                    <div className={styles.backButton}></div>
                </Link>
            )}
            <h1>{title}</h1>
        </div>
    );
}
