import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.bb.body.booster.athlete',
  appName: 'Body Booster',
  webDir: '../../dist/apps/athlete/browser',
  server: {
    androidScheme: 'https',
    iosScheme: 'https', // Fuerza a iOS a usar https en vez de capacitor://
    hostname: 'bb-app-athlete.com',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  // =========================================================
  // 2. AÑADIMOS ESTE BLOQUE PARA EL PLUGIN DE LOTTIE DE CORDOVA
  // =========================================================
  cordova: {
    preferences: {
      // 3. RUTA DE LA ANIMACIÓN LOTTIE
      // Asumiendo que tu archivo 'splash.json' se compila a esta ubicación
      LottieAnimationLocation: 'assets/splash.json',

      // 4. COMPORTAMIENTO
      // La animación se repite infinitamente hasta que llamemos a SplashScreen.hide()
      LottieLoopAnimation: 'true',

      // Evita el auto-ocultamiento basado en la duración del Lottie
      LottieHideAfterAnimationEnd: 'false',

      // Opcional: Ocupa toda la pantalla nativa
      LottieFullScreen: 'true',
    },
  },
};

export default config;
