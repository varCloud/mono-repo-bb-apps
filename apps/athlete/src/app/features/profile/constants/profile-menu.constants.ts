export interface ProfileMenuItem {
  text: string;
  icon?: string;
  actionText?: string;
  showArrow?: boolean;
  action: string;
  labelClass?: string;
  danger?: boolean;
  iconEnd?: string;
}

export const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  {
    text: 'Datos personales',
    action: 'personalData',
    showArrow: true,
  },
  // {
  //   text: 'Mis Suscripciones',
  //   action: 'mySubscriptions',
  //   showArrow: true,
  // },
  // {
  //   text: 'Notificaciones',
  //   action: 'themeColor',
  //   showArrow: true,
  // },
  {
    text: 'Contactar a soporte',
    action: 'support',
    showArrow: true,
  },
  {
    text: '¿Cómo convertirme en creador de contenido?',
    action: 'becomeCreator',
    showArrow: true,
  },
  {
    text: 'Eliminar cuenta',
    action: 'deleteAccount',
    showArrow: false,
    labelClass: 'text-danger',
    iconEnd: 'trash-sharp',
  },
  {
    text: 'Cerrar sesión',
    action: 'logout',
    showArrow: false,
    labelClass: 'text-primary',
    iconEnd: 'log-in-outline',
  },
];

export const OPTIONS_PROFILE_MENU = [
  {
    icon: './assets/icons/profile/hearth.svg',
    name: 'Favoritos',
    action: 'favorites',
  },
  {
    icon: './assets/icons/profile/bookmark.svg',
    name: 'Guardados',
    action: 'bookmarks',
  },  {
    icon: './assets/icons/profile/chat.svg',
    name: 'Mensajes',
    action: 'messages',
  }
]
