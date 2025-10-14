import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

interface Conversation {
  name: string;
  email?: string;
  message?: string;
  date: string;
  avatar: string;
}

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ConversationListComponent {
  @Input() conversations: Conversation[] = [];
  @Output() conversationSelected = new EventEmitter<Conversation>();

  onSelectConversation(conversation: Conversation): void {
    this.conversationSelected.emit(conversation);
  }
}
