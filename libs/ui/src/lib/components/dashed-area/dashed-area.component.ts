import { Component, input, OnInit, output } from '@angular/core';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, cloudUploadOutline } from 'ionicons/icons';

type iconType = 'cloud-upload-outline' | 'add-circle-outline';

@Component({
  selector: 'app-dashed-area',
  templateUrl: './dashed-area.component.html',
  styleUrls: ['./dashed-area.component.scss'],
  imports: [IonIcon, IonButton],
})
export class DashedAreaComponent implements OnInit {
  label = input('Carga el video de tu ejercicio');
  icon = input<iconType>('cloud-upload-outline');
  disabled = input<boolean>(false);
  clickEvent = output<void>();
  imageSrc = input<string | null>(null);
  constructor() {
    addIcons({ cloudUploadOutline, addCircleOutline });
  }

  ngOnInit() {}

  onClick() {
    this.clickEvent.emit();
  }
}
