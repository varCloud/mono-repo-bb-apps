import { Injectable, NgZone, signal, WritableSignal } from '@angular/core';
import { Network } from '@ca';

@Injectable({
  providedIn: 'root'
})
export class ConnectionDetectorService {
  // Signal para manejar el estado: true = online, false = offline
  public isOnline: WritableSignal<boolean> = signal(true);

  constructor(private ngZone: NgZone) {
    this.initNetworkListener();
  }

  private async initNetworkListener() {
    // 1. Obtener estado inicial
    const status = await Network.getStatus();
    this.updateStatus(status.connected);

    // 2. Escuchar cambios en la red
    Network.addListener('networkStatusChange', (status) => {
      // Es crucial usar NgZone porque el listener de Capacitor
      // corre fuera del contexto de detección de cambios de Angular
      this.ngZone.run(() => {
        this.updateStatus(status.connected);
      });
    });
  }

  private updateStatus(connected: boolean) {
    this.isOnline.set(connected);
    console.log('Estado de red:', connected ? 'Conectado' : 'Desconectado');
  }
}
