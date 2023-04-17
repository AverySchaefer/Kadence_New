import { PageLayout } from '@/components/';
import { useState } from 'react';
import Image from 'next/image';
import { Card, Grid } from '@mui/material';
import styles from '@/styles/PlaylistSaved.module.css';

export default function LocalModeSetup() {
    const [albumImgs] = useState(
        JSON.parse(localStorage.getItem('playlistImgs'))
    );

    return (
        <PageLayout title="" prevLink="/home" includeNav={false}>
            <main className={styles.main}>
                <h3>Your playlist has been saved</h3>
                <Card className={styles.imageContainer}>
                    <Grid
                        container
                        rowSpacing={0}
                        columnSpacing={{ xs: 0, sm: 0, md: 0 }}
                    >
                        <Grid item xs={0}>
                            <Image
                                src={
                                    albumImgs[0] ??
                                    'https://demofree.sirv.com/nope-not-here.jpg'
                                }
                                alt="Album Art"
                                width={150}
                                height={150}
                            />
                        </Grid>
                        <Grid item xs={0}>
                            <Image
                                src={
                                    albumImgs[1] ??
                                    'https://demofree.sirv.com/nope-not-here.jpg'
                                }
                                alt="Album Art"
                                width={150}
                                height={150}
                            />
                        </Grid>
                        <Grid item xs={0}>
                            <Image
                                src={
                                    albumImgs[2] ??
                                    'https://demofree.sirv.com/nope-not-here.jpg'
                                }
                                alt="Album Art"
                                width={150}
                                height={150}
                            />
                        </Grid>
                        <Grid item xs={0}>
                            <Image
                                src={
                                    albumImgs[3] ??
                                    'https://demofree.sirv.com/nope-not-here.jpg'
                                }
                                alt="Album Art"
                                width={150}
                                height={150}
                            />
                        </Grid>
                    </Grid>
                </Card>
                <h2>Playlist Name</h2>
            </main>
        </PageLayout>
    );
}
