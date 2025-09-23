import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bb.athlete',
  appName: 'BB Athlete',
  webDir: '../../dist/apps/athlete/browser',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
}

export default config;