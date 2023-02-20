import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Logout() {
    const { push } = useRouter();

    useEffect(() => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('username');
        push('/login');
    }, [push]);

    return <></>;
}