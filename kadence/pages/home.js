import { useRouter } from 'next/router';
import { Button, BottomNav } from '@/components/';
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

    async function handleClick() {
        console.log('Clicking the logout button!');
        localStorage.removeItem('jwt');
        localStorage.removeItem('username');
        // Send Request
        try {
            const data = await NetworkAPI.get('/api/users/logout', {});
            if (data) {
                router.push('/login');
            }
        } catch (err) {
            console.log('Error: ', err.status, err);
        }
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
