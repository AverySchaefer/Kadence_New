import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { App } from '@capacitor/app';
import { Dialog } from '@capacitor/dialog';
import NetworkAPI from '@/lib/networkAPI';

// Component to implement mobile deeplinking
const AppUrlListener = () => {
    const router = useRouter();
    useEffect(() => {
        App.addListener('appUrlOpen', async (event) => {
            // Example url: https://kadenceapp.com/profile/JohnSmith
            // slug = /profile/JohnSmith
            const slug = event.url.split('.com').pop();

            const url = new URLSearchParams(event.url);
            if (url.get('code')) {
                const authorizationCode = url.get('code');

                const codeVerifier = localStorage.getItem('pkceVerifier');

                try {
                    const { data: response } = await NetworkAPI.post(
                        '/api/fitbit/getTokens',
                        {
                            authorizationCode,
                            codeVerifier,
                        }
                    );

                    localStorage.setItem(
                        'authorization_code',
                        authorizationCode
                    );
                    localStorage.setItem('access_token', response.access_token);
                    localStorage.setItem(
                        'refresh_token',
                        response.refresh_token
                    );
                } catch (err) {
                    Dialog.alert({
                        title: 'Error',
                        message: `An error occurred while authorizing to Fitbit: ${err.message}.`,
                    });
                }
            }

            if (slug) {
                router.push(slug);
            }
            // If no match, do nothing - let regular routing logic take over
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

export default AppUrlListener;
