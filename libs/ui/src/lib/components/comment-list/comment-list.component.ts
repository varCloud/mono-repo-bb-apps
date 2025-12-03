import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons';

export interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  text: string;
  rating: number;
  timeAgo: string;
}

@Component({
  selector: 'lib-comment-list',
  standalone: true,
  imports: [IonIcon],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentListComponent {
  comments = input<Comment[]>([]);

  constructor() {
    addIcons({ star });
  }
}
