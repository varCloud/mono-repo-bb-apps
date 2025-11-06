import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  input,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonItem,
  IonLabel,
  AccordionGroupCustomEvent,
  IonIcon,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  addOutline,
  removeOutline,
  caretDownCircle,
  add,
} from 'ionicons/icons';
import { Faq } from '@monorepo-bb-app/shared';
@Component({
  selector: 'app-faq-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    IonButton,
  ],
})
export class AccordionComponent {
  items = input.required<Faq[]>();

  public tittleaccordion = input<string>('Frecuent Questions');

  accordionGroup = viewChild.required<IonAccordionGroup>('accordionGroup');
  currentOpenValue = signal<string[]>([]);
  allExpanded = computed(() => {
    const items = this.items();
    const openItems = this.currentOpenValue();
    return items.length > 0 && items.length === openItems.length;
  });

  constructor() {
    addIcons({ addOutline, removeOutline, caretDownCircle, add });
  }

  toggleAll() {
    if (this.allExpanded()) {
      this.accordionGroup().value = [];
      this.currentOpenValue.set([]);
    } else {
      const allItemValues = this.items().map((_, index) => 'item-' + index);
      this.accordionGroup().value = allItemValues;
      this.currentOpenValue.set(allItemValues);
    }
  }
  onAccordionChange(event: AccordionGroupCustomEvent) {
    this.currentOpenValue.set(event.detail.value as string[]);
  }
  isItemOpen(index: number): boolean {
    const itemValue = 'item-' + index;
    // Lee el signal
    return this.currentOpenValue().includes(itemValue);
  }
}
