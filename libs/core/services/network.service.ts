import { Injectable, signal } from '@angular/core';
import { Network, ConnectionStatus } from '@capacitor/network';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private _isConnected = signal<boolean>(true);
  private _showNoConnectionModal = signal<boolean>(false);
  public readonly isConnected = this._isConnected.asReadonly();
  public readonly showNoConnectionModal = this._showNoConnectionModal.asReadonly();

  constructor() {
    this.initializeNetworkListener();
  }

  private async initializeNetworkListener(): Promise<void> {
    const status = await Network.getStatus();
    this._isConnected.set(status.connected);
    
    if (!status.connected) {
      this._showNoConnectionModal.set(true);
    }

    // Escuchar cambios de conexión
    Network.addListener('networkStatusChange', (status: ConnectionStatus) => {
        this._isConnected.set(status.connected);
        this._showNoConnectionModal.set(!status.connected);
    });
  }

  public async checkConnection(): Promise<boolean> {
    const status = await Network.getStatus();
    this._isConnected.set(status.connected);
    
    if (status.connected) {
      this._showNoConnectionModal.set(false);
    }
    
    return status.connected;
  }

 
  public async onRetryConnection(): Promise<void> {
    const hasConnection = await this.checkConnection();
    
    if (!hasConnection) {
      this._showNoConnectionModal.set(true);
    }
  }

  public hideModal(): void {
    if (this._isConnected()) {
      this._showNoConnectionModal.set(false);
    }
  }
}
