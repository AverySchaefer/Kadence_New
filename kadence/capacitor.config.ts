import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.kadenceapp',
    appName: 'kadence',
    webDir: 'out',
    bundledWebRuntime: false,
    server: {
        url: 'https://kadenceapp.com',
        cleartext: true,
        hostname: 'kadenceapp.com',
    },
};

export default config;
