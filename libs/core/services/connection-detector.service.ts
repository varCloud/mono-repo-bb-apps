import { Injectable, signal, WritableSignal } from '@angular/core';
import { Network } from '@capacitor/network';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ConnectionDetectorService {

  public isOnline: WritableSignal<boolean> = signal(true);

  constructor(private platform: Platform) {
    this.initNetworkMonitoring();
  }

  private async initNetworkMonitoring() {
    await this.platform.ready();

    const status = await Network.getStatus();
    this.updateStatus(status.connected);

    Network.addListener('networkStatusChange', (status) => {
      this.updateStatus(status.connected);
    });
  }

  private updateStatus(connected: boolean) {
    this.isOnline.set(connected);
    console.log('Estado de conexion:', connected ? 'Online' : 'Offline');
  }
}
