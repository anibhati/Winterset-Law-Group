import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wintersetlawgroup.app',
  appName: 'Winterset Law Group',
  webDir: 'out',
  server: {
    url: 'https://winterset-law-group.vercel.app',
    cleartext: false,
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#10283B',
    scrollEnabled: true,
  },
};

export default config;
