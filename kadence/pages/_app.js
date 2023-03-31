import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { StyledEngineProvider } from '@mui/material/styles';

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    return (
        <SessionProvider session={session}>
            <StyledEngineProvider injectFirst>
                <Component {...pageProps} />
            </StyledEngineProvider>
        </SessionProvider>
    );
}
