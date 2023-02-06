import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'kadence',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    // Make a copy of this file called
    // capacitor.config.ts and
    // insert your IP address here
    url: 'http://###.###.###.###:3000',
    cleartext: true,
  },
};

export default config;
