import { DeepLinkData, DeepLinkHost } from './../models/deep-link/deep-link';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { App as CapacitorApp, URLOpenListenerEvent } from '@capacitor/app';
import { Browser } from '@capacitor/browser';

/**
 * Servicio de deep links exclusivo para la app del atleta.
 * Scheme: athlete-body-booster-app://
 *
 * Deep links soportados:
 *  - payment-success?status=success&creatorId=1
 *      → cierra el browser y navega al perfil del creador para refrescar la suscripción
 *  - payment-success?status=failed&creatorId=1
 *      → navega al home como fallback
 */
@Injectable({
  providedIn: 'root',
})
export class AthleteDeepLinkService {
  private readonly APP_SCHEME = 'athlete-body-booster-app';
  private readonly APP_ID = 'io.bc.body.booster.athlete';

  constructor(
    private router: Router,
    private zone: NgZone
  ) {}

  initialize(): void {
    this.logInitialization();
    this.setupDeepLinkListener();
  }

  private setupDeepLinkListener(): void {
    CapacitorApp.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.handleIncomingDeepLink(event);
    });
  }

  private handleIncomingDeepLink(event: URLOpenListenerEvent): void {
    console.log('🎯 [Athlete] Deep link received:', event.url);

    this.zone.run(async () => {
      try {
        await this.closeBrowserIfOpen();
        await this.processDeepLink(event.url);
      } catch (error) {
        console.error('💥 [Athlete] Error processing deep link:', error);
        this.navigateToFallback();
      }
    });
  }

  private async closeBrowserIfOpen(): Promise<void> {
    try {
      await Browser.close();
      console.log('✅ [Athlete] Browser closed');
    } catch (error) {
      console.log('⚠️ [Athlete] Browser not open or close failed:', error);
    }
  }

  private async processDeepLink(url: string): Promise<void> {
    if (!this.isValidDeepLink(url)) {
      console.warn('❌ [Athlete] Invalid deep link scheme:', url);
      this.navigateToFallback();
      return;
    }

    const data = this.parseDeepLink(url);
    await this.routeDeepLink(data);
  }

  private isValidDeepLink(url: string): boolean {
    return url.startsWith(`${this.APP_SCHEME}://`);
  }

  private parseDeepLink(url: string): DeepLinkData {
    const urlWithoutScheme = url.replace(`${this.APP_SCHEME}://`, '');
    const [hostAndPath, queryString] = urlWithoutScheme.split('?');
    const [host, ...pathParts] = hostAndPath.split('/');

    const data =  {
      scheme: this.APP_SCHEME,
      host: host || '',
      path: pathParts.join('/') || undefined,
      params: this.parseQueryParams(queryString),
      rawUrl: url,
    };
    console.log('✅ [Athlete] data' , JSON.stringify(data));
    return data;
  }

  private parseQueryParams(queryString?: string): Map<string, string> {
    const params = new Map<string, string>();
    if (!queryString) return params;

    queryString.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      if (key && value !== undefined) {
        params.set(decodeURIComponent(key), decodeURIComponent(value || ''));
      }
    });

    return params;
  }

  private async routeDeepLink(data: DeepLinkData): Promise<void> {
    switch (data.host) {
      case DeepLinkHost.PAYMENT_SUCCESS:
        await this.handlePaymentSuccess(data);
        break;

      default:
        console.warn('❓ [Athlete] Unknown deep link host:', data.host);
        this.navigateToFallback();
        break;
    }
  }

  /**
   * Maneja el retorno desde la web tras procesar el pago.
   *
   * URL esperada (éxito):  athlete-body-booster-app://payment-success?status=success&creatorId=1
   * URL esperada (fallo):  athlete-body-booster-app://payment-success?status=failed&creatorId=1
   *
   * En caso de éxito navega al perfil del creador; checkSubscription() se ejecuta
   * automáticamente al entrar a la página y el contenido quedará visible.
   */
  private async handlePaymentSuccess(data: DeepLinkData): Promise<void> {
    const status = data.params.get('status');
    const creatorId = data.params.get('creatorId');

    console.log('💳 [Athlete] Payment deep link — status:', status, '| creatorId:', creatorId);

    if (status === 'success' && creatorId) {
      await this.router.navigate(
        ['/home/suscriptions/profile-creator', creatorId],
        { replaceUrl: true }
      );
    } else {
      console.warn('❌ [Athlete] Payment failed or missing params — redirecting to home');
      this.navigateToFallback();
    }
  }

  private navigateToFallback(): void {
    this.router.navigate(['/home']);
  }

  private logInitialization(): void {
    console.log('🚀 [Athlete] AthleteDeepLinkService initialized');
    console.log('📱 App ID:', this.APP_ID);
    console.log('🔗 Listening for scheme:', `${this.APP_SCHEME}://`);
  }

  /** Simula un deep link para testing en desarrollo */
  public simulateDeepLink(url: string): void {
    console.log('🧪 [Athlete] Simulating deep link:', url);
    this.processDeepLink(url);
  }

  public getAppScheme(): string {
    return this.APP_SCHEME;
  }

  public getAppId(): string {
    return this.APP_ID;
  }
}
