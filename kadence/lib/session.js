import { useEffect, useState, createContext } from 'react';
import { useRouter } from 'next/router';
import appConfig from '../app.config';

export const SessionContext = createContext(null);

/**
 * This is our custom UseSession provider that fetches the session because the default SessionProvider that calls getSession doesn't make a request with credentials mode set to include
 */
export function UseSession({ children }) {
    const [session, setSession] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function loadSession() {
            const sess = await fetch(`${appConfig.apiHost}/api/auth/session`, {
                credentials: 'include',
            }).then((res) => res.json());
            setSession(sess);
        }

        if (router.pathname !== `${appConfig.apiHost}/api/auth/callback`) {
            loadSession();
        }
    }, [router.pathname]);

    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    );
}
