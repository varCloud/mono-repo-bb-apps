import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.bc.body.booster.creator',
  appName: 'Coach Body Booster',
  webDir: '../../dist/apps/creator/browser',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  android: {
    allowMixedContent: true,
    buildOptions: {
      keystorePath:
        'E:/Documents/BlueCloud/Proyectos/BB/key-android-creator/keystore.jks',
      keystorePassword: 'bb2025',
      keystoreAlias: 'body-booster',
      keystoreAliasPassword: 'bb2025',
    },
  },
};

export default config;
