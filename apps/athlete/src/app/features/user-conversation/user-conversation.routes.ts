import { Routes } from '@angular/router';

export const userConversationRoutes: Routes = [
  {
    path: 'user-conversations',
    loadComponent: () =>
      import('./pages/user-conversation/user-conversation.component').then(
        (m) => m.UserConversationComponent,
      ),
  },
  {
    path: 'user-chat',
    loadComponent: () =>
      import('./components/user-chat/user-chat.component').then(
        (m) => m.UserChatComponent,
      ),
  },
];
