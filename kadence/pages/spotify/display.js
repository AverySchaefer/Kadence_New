import {useSession, signIn, signOut} from 'next-auth/react';
import {useState} from 'react';

export default function Display() {
  const {data: session} = useSession();
  const [songName, setSongItem] = useState('');

  const getMyCurrentSong = async () => {
    const res = await fetch('/api/spotify/currentSong');
    const songItem = await res.json();
    console.log(songItem.item.name)
    setSongItem(songItem.item.name)
  };

  if (session) {
    return (
      <>
        Signed in as {session?.token?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        <hr />
        <h1>Your song: {songName}</h1>
        <button onClick={() => getMyCurrentSong()}>Get the song I am currently playing!</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}