import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

const SpotifyScopeString = [
    'user-read-email',
    'playlist-read-private',
    'user-read-currently-playing',
    'app-remote-control',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-playback-position',
    'playlist-modify-private',
    'playlist-modify-public',
].join(',');

// const useSecureCookies = true;

export default NextAuth({
    providers: [
        SpotifyProvider({
            authorization: `https://accounts.spotify.com/authorize?scope=${SpotifyScopeString}`,
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.refresh_token;
            }
            return token;
        },
        async session(session, user) {
            session.user = user;
            return session;
        },
    },
    // cookies: {
    //     sessionToken: {
    //         name: `${
    //             useSecureCookies ? '__Secure-' : ''
    //         }next-auth.session-token`,
    //         options: {
    //             httpOnly: true,
    //             sameSite: 'none',
    //             path: '/',
    //             domain: `.kadenceapp.com`,
    //             secure: useSecureCookies,
    //         },
    //     },
    // },
});
