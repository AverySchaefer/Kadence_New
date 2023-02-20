import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

import NetworkAPI from '@/lib/networkAPI';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    login,
    logout
};

function login(username, enteredPW) {
    // Send Request
    return NetworkAPI.get('/api/users/login', {
        username: username.value,
        enteredPW: enteredPW.value,
    })
        .then(({ user }) => {
            // Publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        })
        .catch(({ status, error }) => {
            console.log('Error: ', status, error);
        });
}

function logout() {
    // Remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    const router = useRouter();
    router.push('/login');
}