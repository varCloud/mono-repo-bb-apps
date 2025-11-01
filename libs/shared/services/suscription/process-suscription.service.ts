import { Injectable, signal } from '@angular/core';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ProcessSuscriptionService {
  creatorSelected = signal<User | null>(null);

  constructor() {}

  public setCreator(creator: User) {
    this.creatorSelected.set(creator);
  }

  public clearCreator() {
    this.creatorSelected.set(null);
  }

  public getCreator() {
    return this.creatorSelected();
  }
}
