import Styles from '@/styles/BottomNav.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  RiHomeSmile2Line,
  RiHomeSmile2Fill,
  RiSearchEyeFill,
  RiUser5Line,
  RiUser5Fill,
} from 'react-icons/ri';
import { BiSearchAlt } from 'react-icons/bi';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

const BottomNav = (props) => {
  const router = useRouter();
  const [activeTabs, setActiveTabs] = useState(props.name);
  useEffect(() => {
    switch (activeTabs) {
      case 'home':
        router.push('/');
        break;
      case 'search':
        router.push('/search');
        break;
      case 'login':
        router.push('/login');
        break;
      case 'profile':
        router.push('/profile');
        break;
      default:
        router.push('/');
        break;
    }
  }, [activeTabs, router]);

  return (
    <div className={`${Styles.bottomNav}`}>
      <div className={`${Styles.bnTab}`}>
        {activeTabs === 'home' ? (
          <RiHomeSmile2Fill
            size="35"
            color="#000"
            onClick={() => setActiveTabs('home')}
          />
        ) : (
          <RiHomeSmile2Line
            size="35"
            color="#000"
            onClick={() => setActiveTabs('home')}
          />
        )}
      </div>
      <div className={`${Styles.bnTab}`}>
        {activeTabs === 'search' ? (
          <RiSearchEyeFill
            size="35"
            color="#000"
            onClick={() => setActiveTabs('search')}
          />
        ) : (
          <BiSearchAlt
            size="35"
            color="#000"
            onClick={() => setActiveTabs('search')}
          />
        )}
      </div>
      <div className={`${Styles.bnTab}`}>
        {activeTabs === 'login' ? (
          <AiFillHeart
            size="35"
            color="#000"
            onClick={() => setActiveTabs('login')}
          />
        ) : (
          <AiOutlineHeart
            size="35"
            color="#000"
            onClick={() => setActiveTabs('login')}
          />
        )}
      </div>
      <div className={`${Styles.bnTab}`}>
        {activeTabs === 'profile' ? (
          <RiUser5Fill
            size="35"
            color="#000"
            onClick={() => setActiveTabs('profile')}
          />
        ) : (
          <RiUser5Line
            size="35"
            color="#000"
            onClick={() => setActiveTabs('profile')}
          />
        )}
      </div>
    </div>
  );
};

export default BottomNav;
