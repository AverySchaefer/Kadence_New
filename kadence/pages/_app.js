import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
// import { UseSession } from '@/lib/session';
import { StyledEngineProvider } from '@mui/material/styles';

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    return (
        // <UseSession>
        <SessionProvider session={session}>
            <StyledEngineProvider injectFirst>
                <Component {...pageProps} />
            </StyledEngineProvider>
        </SessionProvider>
        // </UseSession>
    );
}
