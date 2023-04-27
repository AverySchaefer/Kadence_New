import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import Script from 'next/script';

import { useState } from 'react';
import { MusicKitContext } from '@/lib/useMusicKit';
import { StyledEngineProvider } from '@mui/material/styles';

import { AppleMusicConfiguration } from '@/lib/apple/AppleAPI';

import AppUrlListener from '@/components/AppUrlListener';

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    const [musicKit, setMusicKit] = useState(null);

    function configureAppleMusic() {
        document.addEventListener('musickitloaded', () => {
            // MusicKit global is now defined

            // eslint-disable-next-line no-undef
            MusicKit.configure(AppleMusicConfiguration);
            // eslint-disable-next-line no-undef
            setMusicKit(MusicKit);
        });
    }

    return (
        <MusicKitContext.Provider value={musicKit}>
            <AppUrlListener></AppUrlListener>
            <SessionProvider session={session}>
                <Script
                    src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"
                    onLoad={configureAppleMusic}
                    strategy="afterInteractive"
                />
                <StyledEngineProvider injectFirst>
                    <Component {...pageProps} />
                </StyledEngineProvider>
            </SessionProvider>
        </MusicKitContext.Provider>
    );
}
