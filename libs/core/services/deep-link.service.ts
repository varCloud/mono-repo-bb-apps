import { DeepLinkAction, DeepLinkData, DeepLinkHost } from './../models/deep-link/deep-link';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { App as CapacitorApp, URLOpenListenerEvent } from '@capacitor/app';
import { Browser } from '@capacitor/browser';

/**
 * Servicio para manejar todos los deep links de la aplicación
 * Implementa el patrón Strategy para diferentes tipos de enlaces
 * los deep links son los que  te ayudan a abrir tu aplicacion movil desde un sitio web
 * ademas de este servicio tambien es necesario agregar algunas validaciones al manifest de android y al info.plist de ios
 */
@Injectable({
  providedIn: 'root',
})
export class DeepLinkService {
  private readonly APP_SCHEME = 'coach-body-booster-app';
  //private readonly APP_SCHEME_IOS = 'coach-body-booster-app';
  private readonly APP_ID = 'io.bb.body.booster.creator';

  constructor(
    private router: Router,
    private zone: NgZone
  ) {}

  /**
   * Inicializa el listener para deep links
   */
  initialize(): void {
    this.logInitialization();
    this.setupDeepLinkListener();
  }

  /**
   * Configura el listener principal para deep links de Capacitor
   */
  private setupDeepLinkListener(): void {
    CapacitorApp.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.handleIncomingDeepLink(event);
    });
  }

  /**
   * Maneja un deep link entrante
   */
  private handleIncomingDeepLink(event: URLOpenListenerEvent): void {
    console.log('🎯 Deep link event received:', event);

    this.zone.run(async () => {
      try {
        await this.closeBrowserIfOpen();
        await this.processDeepLink(event.url);
      } catch (error) {
        console.error('💥 Error processing deep link:', error);
        this.navigateToFallback();
      }
    });
  }

  /**
   * Cierra el navegador externo si está abierto
   */
  private async closeBrowserIfOpen(): Promise<void> {
    try {
      await Browser.close();
      console.log('✅ Browser closed successfully');
    } catch (error) {
      console.log('⚠️ Browser not open or close failed:', error);
    }
  }

  /**
   * Procesa un deep link y ejecuta la navegación correspondiente
   */
  private async processDeepLink(url: string): Promise<void> {
    console.log('🔗 Processing deep link:', url);

    if (!this.isValidDeepLink(url)) {
      console.warn('❌ Invalid deep link scheme:', url);
      this.navigateToFallback();
      return;
    }

    const deepLinkData = this.parseDeepLink(url);
    await this.routeDeepLink(deepLinkData);
  }

  /**
   * Valida si el URL es un deep link válido para nuestra aplicación
   */
  private isValidDeepLink(url: string): boolean {
    return url.startsWith(`${this.APP_SCHEME}://`);
  }

  /**
   * Parsea un deep link y extrae sus componentes
   */
  private parseDeepLink(url: string): DeepLinkData {
    console.log('🔍 Parsing deep link:', url);

    const urlWithoutScheme = url.replace(`${this.APP_SCHEME}://`, '');
    const [hostAndPath, queryString] = urlWithoutScheme.split('?');
    const [host, ...pathParts] = hostAndPath.split('/');
    const path = pathParts.join('/');

    const params = this.parseQueryParams(queryString);

    const deepLinkData: DeepLinkData = {
      scheme: this.APP_SCHEME,
      host: host || '',
      path: path || undefined,
      params,
      rawUrl: url,
    };

    console.log(
      '📋 Parsed deep link data:',
      JSON.stringify({
        host: deepLinkData.host,
        path: deepLinkData.path,
        params: Array.from(deepLinkData.params.entries()),
      })
    );

    return deepLinkData;
  }

  /**
   * Parsea los parámetros de query de un deep link
   */
  private parseQueryParams(queryString?: string): Map<string, string> {
    const params = new Map<string, string>();

    if (!queryString) {
      return params;
    }

    queryString.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      if (key && value !== undefined) {
        params.set(decodeURIComponent(key), decodeURIComponent(value || ''));
      }
    });

    return params;
  }

  /**
   * Enruta el deep link según su tipo usando el patrón Strategy
   */
  private async routeDeepLink(data: DeepLinkData): Promise<void> {
    switch (data.host) {
      case DeepLinkHost.STRIPE_RETURN:
        await this.handleStripeReturn(data);
        break;

      case DeepLinkHost.OPEN:
      case '':
        await this.handleGeneralOpen(data);
        break;

      case DeepLinkHost.ONBOARDING:
        await this.handleOnboarding(data);
        break;

      case DeepLinkHost.PROFILE:
        await this.handleProfile(data);
        break;

      default:
        console.warn('❓ Unknown deep link host:', data.host);
        this.navigateToFallback();
        break;
    }
  }

  /**
   * Maneja deep links de retorno de Stripe
   */
  private async handleStripeReturn(data: DeepLinkData): Promise<void> {
    const status = data.params.get('status');
    console.log('💳 Handling Stripe return with status:', status);

    if (status === 'success') {
      console.log('✅ Stripe success! Navigating to personal-data page');
      await this.router.navigate(['home'], {
        queryParams: { stripe: 'success' },
        replaceUrl: true,
      });
      await this.router.navigate(['home/profile'], {
        queryParams: { stripe: 'success' },
        replaceUrl: true,
      });
    } else {
      console.warn('❌ Stripe onboarding failed with status:', status);
      this.navigateToFallback();
    }
  }

  /**
   * Maneja deep links generales de apertura
   */
  private async handleGeneralOpen(data: DeepLinkData): Promise<void> {
    const page = data.params.get('page');
    const action = data.params.get('action');
    const source = data.params.get('source');

    console.log('🔄 General deep link:', { page, action, source });

    if (action === DeepLinkAction.ONBOARDING_COMPLETE) {
      console.log('🎉 Onboarding completed, navigating to home');
      await this.router.navigate(['/home']);
    } else if (page) {
      console.log('📄 Navigating to specific page:', page);
      await this.router.navigate([`/${page}`]);
    } else {
      console.log('🏠 Default navigation to home');
      await this.router.navigate(['/home']);
    }
  }

  /**
   * Maneja deep links específicos de onboarding
   */
  private async handleOnboarding(data: DeepLinkData): Promise<void> {
    const step = data.params.get('step');
    console.log('🚀 Handling onboarding deep link, step:', step);

    if (step) {
      await this.router.navigate(['/onboarding', step]);
    } else {
      await this.router.navigate(['/onboarding']);
    }
  }

  /**
   * Maneja deep links específicos de perfil
   */
  private async handleProfile(data: DeepLinkData): Promise<void> {
    const section = data.params.get('section') || data.path;
    console.log('👤 Handling profile deep link, section:', section);

    if (section) {
      await this.router.navigate(['/home/profile', section]);
    } else {
      await this.router.navigate(['/home/profile']);
    }
  }

  /**
   * Navega a la página de fallback (home)
   */
  private navigateToFallback(): void {
    console.log('🏠 Navigating to fallback (home)');
    this.router.navigate(['/home']);
  }

  /**
   * Registra la información de inicialización
   */
  private logInitialization(): void {
    console.log('🚀 DeepLinkService initialized');
    console.log('📱 App ID:', this.APP_ID);
    console.log('🔗 Listening for scheme:', `${this.APP_SCHEME}://`);
  }

  /**
   * Método público para testing - simula un deep link
   */
  public simulateDeepLink(url: string): void {
    console.log('🧪 Simulating deep link for testing:', url);
    this.processDeepLink(url);
  }

  /**
   * Método público para obtener información del esquema de la app
   */
  public getAppScheme(): string {
    return this.APP_SCHEME;
  }

  /**
   * Método público para obtener el ID de la app
   */
  public getAppId(): string {
    return this.APP_ID;
  }
}
