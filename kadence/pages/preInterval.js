import { useState, useEffect } from 'react';

import InfoIcon from '@mui/icons-material/Info';

import styles from '@/styles/PreInterval.module.css';

import NetworkAPI from '@/lib/networkAPI';
import PageLayout from '@/components/PageLayout';
import { useRouter } from 'next/router';

export default function PreIntervalScreen() {
    const [intervalLow, setIntervalLow] = useState(10);
    const [intervalHigh, setIntervalHigh] = useState(20);

    const [showExplanation, setShowExplanation] = useState(false);

    const router = useRouter();

    // Fetch preferences from database
    useEffect(() => {
        async function fetchData() {
            try {
                // Get User Data first
                const { data: userData } = await NetworkAPI.get(
                    '/api/users/getUsers',
                    {
                        username: localStorage.getItem('username'),
                    }
                );
                setIntervalLow(userData.intervalShort ?? 10);
                setIntervalHigh(userData.intervalLong ?? 20);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    return (
        <PageLayout title="Interval Mode" prevLink="/home" includeNav={false}>
            <div className={styles.pageWrapper}>
                <div className={styles.contentContainer}>
                    <div className={styles.description}>
                        <p>Select your interval lengths.</p>
                        <InfoIcon
                            onClick={() => setShowExplanation((prev) => !prev)}
                        />
                    </div>

                    {showExplanation && (
                        <div className={styles.explanation}>
                            <p className={styles.explanationTitle}>
                                What is Interval Mode?
                            </p>
                            <p>
                                Interval Mode allows you to create a playlist
                                which alternates between periods of high energy
                                and low energy songs.
                            </p>
                        </div>
                    )}
                    <div className={styles.settings}>
                        <div className={styles.setting}>
                            <p>
                                High Energy: {intervalHigh} minute
                                {intervalHigh === 1 ? '' : 's'}
                            </p>
                            <div className={styles.slider}>
                                <input
                                    type="range"
                                    min={0}
                                    max={40}
                                    step={1}
                                    value={intervalHigh}
                                    onChange={(e) =>
                                        setIntervalHigh(
                                            parseInt(e.target.value, 10)
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className={styles.setting}>
                            <p>
                                Low Energy: {intervalLow} minute
                                {intervalLow === 1 ? '' : 's'}
                            </p>
                            <div className={styles.slider}>
                                <input
                                    type="range"
                                    min={0}
                                    max={20}
                                    step={1}
                                    value={intervalLow}
                                    onChange={(e) =>
                                        setIntervalLow(
                                            parseInt(e.target.value, 10)
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    className={styles.generateButton}
                    onClick={() => {
                        // TODO: Generate playlist using specified
                        // intervalLow and intervalHigh values
                        router.push({
                            pathname: '/interval',
                            query: {
                                intervalLow,
                                intervalHigh,
                            },
                        });
                    }}
                >
                    Generate Playlist
                </button>
            </div>
        </PageLayout>
    );
}
