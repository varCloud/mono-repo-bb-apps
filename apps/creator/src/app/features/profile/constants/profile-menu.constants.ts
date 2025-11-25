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
    text: 'Visualizar Perfil como Cliente',
    action: 'viewAsClient',
    showArrow: true,
  },
  {
    text: 'Mis clientes',
    action: 'myClients',
    showArrow: true,
  },
  {
    text: 'Portada',
    action: 'portada',
    showArrow: true,
  },
  {
    text: 'Información bancaria y pagos',
    action: 'bankInfo',
    showArrow: true,
  },
    {
    text: 'Datos Personales',
    action: 'personalData',
    showArrow: true,
  },
  {
    text: 'Términos de servicio',
    action: 'terms',
    showArrow: true,
  },
  {
    text: 'Contactar a soporte',
    action: 'support',
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
