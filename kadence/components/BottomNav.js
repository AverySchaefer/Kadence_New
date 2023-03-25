import Styles from '@/styles/BottomNav.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    RiHomeSmile2Line,
    RiHomeSmile2Fill,
    RiSearchEyeFill,
    RiUser3Line,
    RiUser3Fill,
} from 'react-icons/ri';
import { BiSearchAlt } from 'react-icons/bi';

const BottomNav = (props) => {
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
            default:
                break;
        }
        setAlreadyNavigated(true);
    }, [router, activeTabs, alreadyNavigated]);

    return (
        <div className={Styles.bottomNav}>
            <div className={Styles.bnTab}>
                {activeTabs === 'home' ? (
                    <RiHomeSmile2Fill
                        size="35"
                        color="#fff"
                        onClick={() => changeActiveTab('home')}
                    />
                ) : (
                    <RiHomeSmile2Line
                        size="35"
                        color="#fff"
                        onClick={() => changeActiveTab('home')}
                    />
                )}
                <div className={Styles.bnTabName}>Home</div>
            </div>
            <div className={Styles.bnTab}>
                {activeTabs === 'search' ? (
                    <RiSearchEyeFill
                        size="35"
                        color="#fff"
                        onClick={() => changeActiveTab('search')}
                    />
                ) : (
                    <BiSearchAlt
                        size="35"
                        color="#fff"
                        onClick={() => changeActiveTab('search')}
                    />
                )}
                <div className={Styles.bnTabName}>Search</div>
            </div>
            <div className={Styles.bnTab}>
                {activeTabs === 'profile' ? (
                    <RiUser3Fill
                        size="35"
                        color="#fff"
                        onClick={() => changeActiveTab('profile')}
                    />
                ) : (
                    <RiUser3Line
                        size="35"
                        color="#fff"
                        onClick={() => changeActiveTab('profile')}
                    />
                )}
                <div className={Styles.bnTabName}>Profile</div>
            </div>
        </div>
    );
};

export default BottomNav;
