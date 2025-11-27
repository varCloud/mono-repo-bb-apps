import { Component, effect, NgZone, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoaderComponent } from '@monorepo-bb-app/ui';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { App as CapacitorApp, URLOpenListenerEvent } from '@capacitor/app';
import { Browser } from '@capacitor/browser';

import {
  LoaderUIService,
  PushNotificationService,
  ThemeService,
  TranslationService,
} from '@monorepo-bb-app/core';


@Component({
  standalone: true,
  imports: [RouterModule, IonRouterOutlet, IonApp, LoaderComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'creator';
  public isLoading = signal(false);
  constructor(
    public globalBlockUIService: LoaderUIService,
    private pushNotificationService: PushNotificationService,
    private _themeService: ThemeService,
    private _translationService: TranslationService,
    private zone: NgZone,
    private router: Router,

  ) {
    this._themeService.initializeTheme();
    this._translationService.setDefaultConfig();
    this.pushNotificationService.initPushNotifications();
    effect(() => {
      const blockUIState = this.globalBlockUIService.getLoading();
      if (blockUIState) {
        this.isLoading.set(true);
      } else {
        this.isLoading.set(false);
      }
    });
    this.initializeApp();
  }

initializeApp() {
  console.log('🚀 Initializing App...');
  console.log('📱 App ID:', 'io.bb.body.booster.creator');
  console.log('🔗 Listening for deep links with scheme: coach_body_booster_app://');
  
  CapacitorApp.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
    console.log('🎯 Deep link event received!', event);
    
    this.zone.run(async () => {
      const url = event.url;
      console.log('🔗 Deep link URL:', url)
      console.log('🔗 URL type:', typeof url);
      console.log('🔗 URL length:', url.length);
      
      // Cerrar el navegador si está abierto
      try {
        await Browser.close();
        console.log('✅ Browser closed successfully');
      } catch (e) {
        console.log('⚠️ Browser not open or close failed:', e);
      }

      // Manejar diferentes tipos de deep links
      if (url.startsWith('coach_body_booster_app://')) {
        console.log('✅ Deep link matches our scheme, handling...');
        this.handleDeepLink(url);
      } else {
        console.warn('❌ Deep link does not match our scheme:', url);
      }
    });
  });
}

private handleDeepLink(url: string) {
  try {
    console.log('🔍 Parsing deep link manually:', url);
    
    // Remover el esquema
    const urlWithoutScheme = url.replace('coach_body_booster_app://', '');
    console.log('📝 URL sin esquema:', urlWithoutScheme);
    
    // Separar host y parámetros
    const [hostPart, queryPart] = urlWithoutScheme.split('?');
    const host = hostPart || '';
    
    console.log('🏠 Host:', host);
    console.log('🔗 Query part:', queryPart);
    
    // Parsear parámetros manualmente
    const params = new Map<string, string>();
    if (queryPart) {
      queryPart.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          params.set(decodeURIComponent(key), decodeURIComponent(value));
        }
      });
    }
    
    console.log('📋 Parámetros parseados:', Array.from(params.entries()));

    switch (host) {
      case 'stripe-return':
        this.handleStripeReturn(params);
        break;
      
      case 'open':
      case '':
        this.handleGeneralOpen(params);
        break;
        
      default:
        console.warn('❓ Host desconocido:', host);
        this.router.navigate(['/home']);
        break;
    }
  } catch (error) {
    console.error('💥 Error parsing deep link:', error);
    console.log('🚨 Navegando a home como fallback');
    this.router.navigate(['/home']);
  }
}

private handleStripeReturn(params: Map<string, string>) {
  const status = params.get('status');
  console.log('💳 Handling Stripe return with status:', status);
  console.log('💳 All params:', Array.from(params.entries()));
  
  if (status === 'success') {
    console.log('✅ Stripe success! Navigating to personal-data page');
    this.router.navigate(['home/profile/personal-data']);
  } else {
    console.warn('❌ Stripe onboarding status not success:', status);
    console.log('🏠 Navigating to home as fallback');
    this.router.navigate(['/home']);
  }
}

private handleGeneralOpen(params: Map<string, string>) {
  const page = params.get('page');
  const action = params.get('action');
  const source = params.get('source');
  
  console.log('🔄 General deep link - page:', page, 'action:', action, 'source:', source);
  
  if (action === 'onboarding_complete') {
    console.log('🎉 Onboarding completado, navegando a home');
    this.router.navigate(['/home']);
  } else if (page) {
    console.log('📄 Navegando a página específica:', page);
    this.router.navigate([`/${page}`]);
  } else {
    console.log('🏠 Navegación por defecto a home');
    this.router.navigate(['/home']);
  }
}

}
