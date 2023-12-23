import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.newapp',
  appName: 'newapp',
  webDir: 'build',
  server: {
    // androidScheme: 'https'
    url: 'http://192.168.56.116:3000',
    cleartext: true
  }
};

export default config;
