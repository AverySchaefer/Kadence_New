import { act, render, fireEvent, screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { useSession } from 'next-auth/react';

import NetworkAPI from '@/lib/networkAPI';
import Home from '@/pages/home';

jest.mock('next-auth/react');

describe('Home', () => {
    afterEach(() => {
        window.localStorage.clear();
    });

    test('renders welcome message and mode buttons when logged in', () => {
        mockRouter.push('/home');
        useSession.mockReturnValue([{ user: { name: 'John Doe' } }, false]);

        window.localStorage.setItem('jwt', 'testJWT');
        window.localStorage.setItem('username', 'Test User');

        const { getByText } = render(<Home />);

        expect(mockRouter).toMatchObject({ asPath: '/home' });
        const welcomeMessage = getByText('Welcome,');
        expect(welcomeMessage).toBeInTheDocument();
        expect(welcomeMessage.textContent).toEqual('Welcome, Test User');

        const heartRateButton = getByText('Heart Rate');
        expect(heartRateButton).toBeInTheDocument();
        fireEvent.click(heartRateButton);
        expect(mockRouter).toMatchObject({ asPath: '/mode/preFitness' });

        const intervalButton = getByText('Interval');
        expect(intervalButton).toBeInTheDocument();
        fireEvent.click(intervalButton);
        expect(mockRouter).toMatchObject({ asPath: '/mode/preInterval' });

        const moodButton = getByText('Mood');
        expect(moodButton).toBeInTheDocument();
        fireEvent.click(moodButton);
        expect(mockRouter).toMatchObject({ asPath: '/mode/mood' });

        const localArtistButton = getByText('Local Artist');
        expect(localArtistButton).toBeInTheDocument();
        fireEvent.click(localArtistButton);
        expect(mockRouter).toMatchObject({ asPath: '/mode/preLocal' });
    });

    test('redirects to login page when not logged in', () => {
        mockRouter.push('/home');
        render(<Home />);
        expect(mockRouter).toMatchObject({ asPath: '/login' });
    });

    test('handles logout', async () => {
        mockRouter.push('/home');
        window.localStorage.setItem('jwt', 'testJWT');
        window.localStorage.setItem('username', 'Test User');
        const networkSpy = jest
            .spyOn(NetworkAPI, 'get')
            .mockResolvedValueOnce({ status: 200 });

        render(<Home />);

        const logoutButton = screen.getByRole('button', {
            name: 'logout',
        });

        await act(async () => {
            fireEvent.click(logoutButton);
        });

        expect(localStorage.getItem('jwt')).toEqual(null);
        expect(localStorage.getItem('username')).toEqual(null);
        expect(networkSpy).toHaveBeenCalled();
        expect(mockRouter).toMatchObject({ asPath: '/login' });
    });
});
