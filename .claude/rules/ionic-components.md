# Componentes Ionic

- Usar siempre los componentes de Ionic (`IonButton`, `IonInput`, `IonContent`, `IonHeader`, `IonToolbar`, `IonGrid`, `IonRow`, `IonCol`, etc.). **No usar elementos HTML nativos** cuando existe un equivalente en Ionic.
- Todos los componentes son **standalone** — importarlos directamente en el array `imports` del componente.
- Para diálogos programáticos usar los controllers de Ionic:
  - Modales → `ModalController` (`.create()` / `.dismiss()`)
  - Alertas → `AlertController` (`.create()` / `.present()`)
  - Action sheets → `ActionSheetController`
  - Toasts → `ToastController`
- No crear modales o alertas con HTML/CSS custom cuando `ModalController`/`AlertController` resuelven el caso.
