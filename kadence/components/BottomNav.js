import styles from '@/styles/BottomNav.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { RiHomeSmile2Line, RiUser3Fill } from 'react-icons/ri';
import { BiSearchAlt } from 'react-icons/bi';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function BottomNav(props) {
    const router = useRouter();
    const [activeTabs, setActiveTabs] = useState(props.name);
    const [alreadyNavigated, setAlreadyNavigated] = useState(false);

    function changeActiveTab(name) {
        setAlreadyNavigated(false);
        setActiveTabs(name);
    }

    useEffect(() => {
        if (alreadyNavigated) return;
        switch (activeTabs) {
            case 'home':
                router.push('/home');
                break;
            case 'search':
                router.push('/search');
                break;
            case 'profile':
                router.push('/profile');
                break;
            case 'social':
                router.push('/social');
                break;
            default:
                break;
        }
        setAlreadyNavigated(true);
    }, [router, activeTabs, alreadyNavigated]);

    return (
        <div className={styles.bottomNav}>
            <div
                className={[
                    styles.bnTab,
                    activeTabs === 'home' ? styles.active : '',
                ].join(' ')}
            >
                <RiHomeSmile2Line
                    size="35"
                    onClick={() => changeActiveTab('home')}
                />
                Home
            </div>
            <div
                className={[
                    styles.bnTab,
                    activeTabs === 'search' ? styles.active : '',
                ].join(' ')}
            >
                <BiSearchAlt
                    size="35"
                    onClick={() => changeActiveTab('search')}
                />
                Search
            </div>
            <div
                className={[
                    styles.bnTab,
                    activeTabs === 'profile' ? styles.active : '',
                ].join(' ')}
            >
                <RiUser3Fill
                    size="35"
                    onClick={() => changeActiveTab('profile')}
                />
                Profile
            </div>
            <div
                className={[
                    styles.bnTab,
                    activeTabs === 'social' ? styles.active : '',
                ].join(' ')}
                onClick={() => changeActiveTab('social')}
            >
                <NotificationsIcon sx={{ width: 35, height: 35 }} />
                Social
            </div>
        </div>
    );
}
