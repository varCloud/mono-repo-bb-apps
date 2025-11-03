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
    },


     {
      path: 'homeaccordion',
      loadComponent: () =>
      import('./home-dynamic-accordion.component/home-dynamic-accordion.component').then(
        (m) => m.HomeAccordion,
      )
    },
    {
      path: 'homesupport',
      loadComponent: () =>
      import('./homesupport/homesupport.component').then(
        (m) => m.homesupport,
      )
    },
        {
      path: 'becomecreatordetail',
      loadComponent: () =>
      import('./become-creator-detail/become-creator-detail.page').then(
        (m) => m.BecomeCreatorDetailComponent,
      )
    },




];
