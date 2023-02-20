import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import SpotifyProvider from 'next-auth/providers/spotify';
import verfiyPassword from '../../../lib/passwordCompare';
import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

export default NextAuth({
  providers: [
    SpotifyProvider({
      authorization:
        'https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private',
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: 'credentials-login',
      name: 'Standard Login Procedure',
      async authorize(credentials) {
        const user = {
          /* add function to get user */
        }
        return user
      },
    }),
  ],
  callbacks: {
    async jwt({token, account}) {
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
});