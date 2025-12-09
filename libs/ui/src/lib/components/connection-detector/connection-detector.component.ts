import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionDetectorService } from'@monorepo-bb-app/ui';
import { Observable } from 'rxjs';
import { IonContent, ModalController, IonButton, IonModal } from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'lib-connection-detector',
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonModal],
  templateUrl: './connection-detector.component.html',
  styleUrls: ['./coonection-detector.component.scss']
})
export class ConnectionDetectorComponent implements OnInit {
  public isOnline$!: Observable<boolean>;
  isSearchModalOpen = false;

  constructor(
      private modalCtrl: ModalController,
    private connectionStatusService: ConnectionDetectorService) {}

  ngOnInit(): void {
    this.isOnline$ = this.connectionStatusService.isOnline;
  }


onModalDismiss(event: CustomEvent<OverlayEventDetail>) {
    this.isSearchModalOpen = false;

    const data = event.detail.data;

    if (data) {
      console.log('Modal Data:', data);
    }
  }

  async openConnectionModal() {
    console.log('Abriendo modal inline...');
    this.isSearchModalOpen = true;
  }

}

