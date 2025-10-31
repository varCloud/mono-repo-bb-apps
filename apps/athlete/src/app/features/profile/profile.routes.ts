import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent,
      )
  },
    {
    path: 'support',
    loadComponent: () =>
      import('./support/toolbar/toolbar.component').then(
        (m) => m.ToolBarComponent,
      )
  },
  {
      path: 'search',
    loadComponent: () =>
      import('./search/search.component').then(
        (m) => m.SimpleSearchInputComponent,
      )
  },
    {
      path: 'infocard',
    loadComponent: () =>
      import('./info-card/info-card.component').then(
        (m) => m.InfoCardComponent,
      )
    },
      {
      path: 'homeslide',
      loadComponent: () =>
      import('./home-slide-card/home-slide-card.component').then(
        (m) => m.HomeSlideCard,
      )
    },      {
      path: 'accordion',
      loadComponent: () =>
      import('./home-faq-accordion/home-faq-accordion.component').then(
        (m) => m.HomePageAccordion,
      )
    },
        {
      path: 'faq',
      loadComponent: () =>
      import('./faq-accordion/faq-accordion.component').then(
        (m) => m.FaqAccordionComponent,
      )
    },



];
