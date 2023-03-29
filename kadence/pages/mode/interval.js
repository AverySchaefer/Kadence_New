import { useRouter } from 'next/router';
import { PageLayout } from '@/components/';
import { Button, Stack, Slider, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import NetworkAPI from '@/lib/networkAPI';
import styles from '@/styles/IntervalPage.module.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/system';

export default function IntervalModeSetup() {
    const router = useRouter();

    const theme = createTheme({
        palette: {
            primary: {
                main: '#69e267',
            },
        },
    });
    const [lowEnergyDuration, setLowEnergyDuration] = useState(40);
    const [highEnergyDuration, setHighEnergyDuration] = useState(20);

    return (
        <PageLayout title="Interval Mode" prevLink="/home">
            <ThemeProvider theme={theme}>
                <Box sx={{ p: 2 }}>
                    <h4>Select your interval lengths.</h4>
                    <Box>
                        <Typography id="high-energy-label">
                            High Energy:
                        </Typography>
                        <Stack spacing={2} direction="row" sx={{ mb: 1 }}>
                            <Slider
                                min={5}
                                step={1}
                                max={60}
                                value={highEnergyDuration}
                                onChange={(e) => {
                                    setHighEnergyDuration(
                                        parseInt(e.target.value, 10)
                                    );
                                }}
                                aria-labelledby="high-energy-label"
                            />
                            <p className={styles.muiSliderLabel}>
                                {highEnergyDuration} minutes
                            </p>
                        </Stack>
                    </Box>
                    <Box>
                        <Typography id="low-energy-label">
                            Low Energy:
                        </Typography>
                        <Stack spacing={2} direction="row" sx={{ mb: 1 }}>
                            <Slider
                                min={5}
                                step={1}
                                max={60}
                                value={lowEnergyDuration}
                                onChange={(e) => {
                                    setLowEnergyDuration(
                                        parseInt(e.target.value, 10)
                                    );
                                }}
                                aria-labelledby="low-energy-label"
                            />
                            <p className={styles.muiSliderLabel}>
                                {lowEnergyDuration} minutes
                            </p>
                        </Stack>
                    </Box>
                    <Button
                        variant="contained"
                        sx={{ borderRadius: 3, width: '100%' }}
                        className={`${styles.generateButton}`}
                        onClick={() => {}}
                    >
                        Generate Playlist
                    </Button>
                </Box>
            </ThemeProvider>
        </PageLayout>
    );
}
