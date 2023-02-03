import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'kadence',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
		url: 'http://10.186.46.40:3000',
		cleartext: true
	}
};

export default config;
