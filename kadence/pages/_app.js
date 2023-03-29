import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import Script from 'next/script';

import { useState } from 'react';
import { MusicKitContext } from '@/lib/useMusicKit';

const AppleMusicConfiguration = {
    developerToken:
        'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlRSNjhKSjlDSEcifQ.eyJpYXQiOjE2ODAwNDI2MjMsImV4cCI6MTY5NTU5NDYyMywiaXNzIjoiOFc0Nzk4SFNZNSJ9.WlMKX6aB2sZSK1sft2npNN3sbgiahHDXXn8fQqWKERvT1w5dkQDpPaVTIjrp5ueJIaHBDAFQNvshRd4OSJ6-VQ',
    app: {
        name: 'Kadence',
        build: '1.0',
    },
};

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    const [musicKit, setMusicKit] = useState(null);

    function configureAppleMusic() {
        document.addEventListener('musickitloaded', function () {
            // MusicKit global is now defined
            MusicKit.configure(AppleMusicConfiguration);
            setMusicKit(MusicKit);
        });
    }

    return (
        <MusicKitContext.Provider value={musicKit}>
            <SessionProvider session={session}>
                <Script
                    src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"
                    onLoad={configureAppleMusic}
                    strategy="afterInteractive"
                />
                <Component {...pageProps} />
            </SessionProvider>
        </MusicKitContext.Provider>
    );
}
