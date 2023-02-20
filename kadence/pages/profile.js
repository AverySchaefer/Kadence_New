import * as React from 'react';
import Image from 'next/image';
import SettingsIcon from '@mui/icons-material/Settings';
import Fab from '@mui/material/Fab';
import Avatar from '@mui/material/Avatar';
import Link from 'next/link';
import Head from 'next/head';
import BottomNav from '@/components/BottomNav';
import styles from '@/styles/Profile.module.css';
import { Inter } from '@next/font/google';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const inter = Inter({ subsets: ['latin'] });

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [image, setImage] = React.useState('/Spotify.jpg');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth">
          <Tab label="About Me" {...a11yProps(0)} />
          <Tab label="Platform" {...a11yProps(1)} />
          <Tab label="Devices" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <Box sx={{ padding: 2 }}>
        {value === 0 && (
          <Box>
            <Stack spacing={2} alignItems="center">
            <h4 className={styles.tabTitle}>Favorite Artist</h4>
            <p>Snarky Puppy</p>
            <br />
            <h4 className={styles.tabTitle}>Favorite Song</h4>
            <p>Sleeper</p>
            <br />
            <h4 className={styles.tabTitle}>Favorite Album</h4>
            <p>Immigrance</p>
            <br />
            <Button variant="contained">Edit</Button>
          </Stack>
          </Box>
        )}
        {value === 1 && (
          <Box>
            <Stack spacing={2} alignItems="center">
              <Image src="/Spotify.jpg" alt="Spotify Logo" width="300" height="150" className={styles.platformImage} priority/>
              <Button variant="contained">Change</Button>
            </Stack>
          </Box>
        )}
        {value === 2 && (
          <Box>
            <Button variant="contained">Connect</Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function Profile() {
  return (
    <div className={inter.className}>
      <Head>
          <title>Profile</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <section>
          <div className={styles.picture}>
            <Avatar 
              alt="NS"
              sx={{ width: 150, height: 150 }}
            >NS</Avatar>
          </div>
        </section>
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Nathan Simon</h4>
        </div>
        <div className={styles.cardText}>
          Nathan enjoys jazz, punk rock, and funk.
        </div>
        <BasicTabs />
      </main>
      <Header title="Profile" />
      <BottomNav name="profile" />
    </div>
  );
}

function Header({ title }) {
  return (
    <div className={styles.header}>
      <h1>{title}</h1>
      <div className={styles.settingsButton}>
        <Link href="/settings">
        <Fab size="small" aria-label="settings">
            <SettingsIcon />
        </Fab>
        </Link>
      </div>
    </div>
  );
}

export default Profile;
