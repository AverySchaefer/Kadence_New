import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BottomNav from '@/components/BottomNav';
import Button from '@/components/Button';
import NetworkAPI from '@/lib/networkAPI';

function Home() {
  /*
  const [isLogged, setIsLogged] = useState();
  useEffect(() => {
      setIsLogged(!!localStorage.getItem('jwt'));
  }, []);

  function handleClick() {
    console.log("Clicking the logout button!")
  }

  if (isLogged) {
    return (
      <div>
        <h1>Home. The user is logged in.</h1>
        <Button onClick={handleClick}>Logout</Button>
        <BottomNav name="home" />
      </div>
    );
  } else {
    console.log("Not logged in.")
    return (
      <div>
        <h1>Home. The user is not logged in.</h1>
        <BottomNav name="home" />
      </div>
    );
  }
  */
  const router = useRouter();

  function handleClick() {
    console.log("Clicking the logout button!")
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    // Send Request
    NetworkAPI.get('/api/users/logout', {
        })
        .then(({ data }) => {
            router.push('/login');
        })
        .catch(({ status, error }) => {
            console.log('Error: ', status, error);
        });
  }

  return (
    <div>
      <h1>Home. The user is logged in.</h1>
      <Button onClick={handleClick}>Logout</Button>
      <BottomNav name="home" />
    </div>
  );
}

export default Home;
