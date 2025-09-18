import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private _storage: Storage = null!;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public async set(key: string, value: any) {
    await this.checkInitialized();
    this._storage.set(key, value);
  }

  public async get(key: string) {
    await this.checkInitialized();
    return this._storage.get(key);
  }
  public async remove(key: string): Promise<any> {
    await this.checkInitialized();
    return this._storage!.remove(key);
  }

  public async clear() {
    await this.checkInitialized();
    this._storage?.clear();
  }

  async checkInitialized() {
    if (!this._storage) {
      await this.init();
    }
  }
}
