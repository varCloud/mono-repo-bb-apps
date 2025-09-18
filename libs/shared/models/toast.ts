export enum ToastPosition {
  Top = 'top',
  Middle = 'middle',
  Bottom = 'bottom',
}
export enum ToastColor {
  Primary = 'primary',
  Secondary = 'secondary',
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
}
export interface ToastOptions {
  position?: ToastPosition;
  message?: string;
  cssClass?: string;
  color?: ToastColor;
  duration?: number;
}

export interface ToastConfig {
  position?: ToastPosition;
  cssClass?: string;
  duration?: number;
}
