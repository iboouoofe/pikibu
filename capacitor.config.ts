import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pikibu.app',
  appName: 'Pikibu',
  webDir: 'public',
  server: {
    url: 'https://pikibu.vercel.app',
    cleartext: false,
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#F5F5F7'
  }
};

export default config;
