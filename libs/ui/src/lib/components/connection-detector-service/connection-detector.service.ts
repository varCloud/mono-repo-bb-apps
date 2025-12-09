import { Injectable, NgZone, signal, WritableSignal } from '@angular/core';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class ConnectionDetectorService {

  public isOnline: WritableSignal<boolean> = signal(true);

  constructor(private ngZone: NgZone) {
    this.initNetworkListener();
  }

  private async initNetworkListener() {

    const status = await Network.getStatus();
    this.updateStatus(status.connected);


    Network.addListener('networkStatusChange', (status) => {
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
