import { Routes } from '@angular/router';
import { authGuard } from 'libs/core/guard/auth.guard';

export const userConversationRoutes: Routes = [
  {
    canActivate: [authGuard],
    path: 'user-conversations',
    loadComponent: () =>
      import('./pages/user-conversation/user-conversation.component').then(
        (m) => m.UserConversationComponent,
      ),
  },
  {
    path: ':id/user-chat',
    loadComponent: () =>
      import('./components/user-chat/user-chat.component').then(
        (m) => m.UserChatComponent,
      ),
  },
];
