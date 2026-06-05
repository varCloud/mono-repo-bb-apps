# Project Rules

## Stack de referencia

Este monorepo usa **Angular v20 + Ionic v8.6 + Capacitor v7 + Nx 21**. Hay dos apps (`athlete`, `creator`) y tres libs compartidas:

- `@monorepo-bb-app/core` — guards, interceptors, servicios core (sesión, push, deep-link)
- `@monorepo-bb-app/shared` — modelos, helpers, constantes, servicios de dominio, pipes, directives
- `@monorepo-bb-app/ui` — 60+ componentes reutilizables (formularios, modales, cards, etc.)

---

## i18n — Traducciones requeridas para cada nuevo texto

Siempre que agregues o modifiques texto visible al usuario (labels, botones, mensajes, placeholders, tooltips, contenido de modales, etc.), **debes** agregar la clave a ambos archivos:

- `libs/shared/assets/i18n/en.json` — Inglés
- `libs/shared/assets/i18n/es.json` — **Español México (es-MX)**

### Reglas

- Nunca hardcodear texto en templates. Usar `{{ 'key' | translate }}` (ngx-translate).
- Agregar la clave a **ambos** archivos en la misma tarea — nunca dejar un archivo sin la clave.
- Colocar las claves dentro de la sección existente más relevante. Si no existe ninguna, crear una nueva que coincida con el nombre del feature.
- El valor en inglés es la fuente de verdad. El valor en español **debe ser una traducción real al español de México**, no una copia del texto en inglés.

### Ejemplo

**Template:**
```html
<ion-button>{{ 'leave-app.continue' | translate }}</ion-button>
```

**`en.json`:**
```json
"leave-app": {
  "continue": "Continue",
  "cancel": "Cancel"
}
```

**`es.json`:**
```json
"leave-app": {
  "continue": "Continuar",
  "cancel": "Cancelar"
}
```

---

## Componentes Ionic

- Usar siempre los componentes de Ionic (`IonButton`, `IonInput`, `IonContent`, `IonHeader`, `IonToolbar`, `IonGrid`, `IonRow`, `IonCol`, etc.). **No usar elementos HTML nativos** cuando existe un equivalente en Ionic.
- Todos los componentes son **standalone** — importarlos directamente en el array `imports` del componente.
- Para diálogos programáticos usar los controllers de Ionic:
  - Modales → `ModalController` (`.create()` / `.dismiss()`)
  - Alertas → `AlertController` (`.create()` / `.present()`)
  - Action sheets → `ActionSheetController`
  - Toasts → `ToastController`
- No crear modales o alertas con HTML/CSS custom cuando `ModalController`/`AlertController` resuelven el caso.

---

## Estado — Angular Signals

- Usar **Angular Signals exclusivamente** para el estado reactivo: `signal()`, `computed()`, `effect()`, `input.required()`.
- **No usar NgRx, Akita, ni BehaviorSubject** para estado nuevo.
- El estado persistente (sesión, token) vive en `libs/core/services/sesion.service.ts` usando `signal()` + Ionic Storage.
- Exponer señales de solo lectura con `.asReadonly()` cuando el estado es gestionado internamente.

```typescript
// ✅ correcto
private _items = signal<Item[]>([]);
public items = this._items.asReadonly();

// ❌ evitar
private _items$ = new BehaviorSubject<Item[]>([]);
```

---

## Formularios — ReactiveFormsModule

- Usar **solo ReactiveFormsModule** — nunca template-driven forms.
- Construir con `FormBuilder`, `FormGroup`, `FormArray`, `FormControl`.
- Los validadores custom van en `libs/shared/helpers/form-validators.ts`.
- Binding en template: `[formGroup]="form"`, `[formControl]="control"`.

---

## HTTP y servicios

- Inyectar `HttpClient` directamente en servicios especializados por dominio (no existe ni se debe crear un `BaseService` genérico).
- Usar `firstValueFrom()` para convertir observables a promesas dentro de métodos `async`.
- Las URLs base vienen de `environment.ts`; los paths de `libs/shared/constants/api-urls.ts`.
- El interceptor `httpInterceptor` en `libs/core/interceptors/` añade el token Bearer y maneja el 401 automáticamente — no repetir esa lógica en los servicios.

```typescript
// ✅ patrón estándar
async getItems(): Promise<Item[]> {
  return firstValueFrom(
    this._http.get<Item[]>(`${this.baseUrl}/items`)
  );
}
```

---

## Routing — lazy loading standalone

- Todas las rutas usan `loadComponent` con import dinámico.
- Organización: `feature.routes.ts` por feature, importado en `app.routes.ts`.
- Proteger rutas privadas con `authGuard` de `libs/core/guard/auth.guard.ts`.
- `PreloadAllModules` está configurado globalmente — no agregar estrategias de precarga custom.

```typescript
{
  path: 'my-feature',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/my-feature/my-feature.component').then(m => m.MyFeatureComponent),
}
```

---

## Upload de archivos — Uppy + AWS S3

- Para subir archivos usar **Uppy** con el plugin `AwsS3Multipart`.
- Inicializar Uppy en `ngAfterViewInit()`, destruir en `ngOnDestroy()` usando el helper `destroyUppy` de `libs/shared/helpers/destroy-uppy.ts`.
- El dashboard se renderiza en un elemento con id `#uppy-dashboard` (inline).
- Configurar restricciones desde `environment.MAX_SIZE_FILE_AWS_S3`.
- **No usar** `<input type="file">` directo para uploads de contenido multimedia.

```typescript
ngAfterViewInit() {
  this.uppy = new Uppy({ restrictions: { maxFileSize: environment.MAX_SIZE_FILE_AWS_S3 } })
    .use(AwsS3Multipart, { ... })
    .use(Dashboard, { inline: true, target: '#uppy-dashboard' });
}

ngOnDestroy() {
  destroyUppy(this.uppy);
}
```

---

## Pagos — Stripe

- Toda la lógica de Stripe vive en `libs/shared/services/stripe/stripe.service.ts`.
- Usar `loadStripe()` en el constructor del servicio (no en los componentes).
- El flujo de onboarding abre la URL con `Browser.open()` de Capacitor.
- El estado de éxito/error se expone como `signal<boolean>`.
- **No instanciar `loadStripe()` fuera del servicio**.

---

## Selects — ng-select

- Para selects con búsqueda, múltiple selección o datos remotos usar el componente wrapper `catalog-select` de `libs/ui/src/lib/components/catalog-select/`.
- Acepta `control: FormControl`, `typeCatalog`, `multiple`, `placeholder`.
- No usar `NgSelectComponent` directamente en features — siempre a través del wrapper.

---

## Máscaras de input — ngx-mask

- Usar la directiva wrapper `[appMask]` de `libs/shared/directives/app-ion-mask.directive.ts`.
- No importar `NgxMaskDirective` directamente en componentes de feature.

---

## Visor de PDF — ng2-pdf-viewer

- Usar el componente reutilizable `ViewPdfComponent` de `libs/ui/src/lib/components/view-pdf.component/`.
- Acepta `url` como input requerido. Ya incluye controles de zoom y fullscreen.
- No instanciar `PdfViewerModule` directamente en features.

---

## Multimedia — Swiper / Plyr

- **Swiper** está registrado globalmente en `app.config.ts` (`register()` del bundle). Usarlo como web component `<swiper-container>`.
- **Plyr** se usa vía el componente `CustomVideoPlayerComponent` de `libs/ui/`.
- No crear reproductores de video custom desde cero.

---

## Capacitor — plugins nativos

- Cada plugin de Capacitor tiene su propio servicio wrapper en `libs/core/services/` o `libs/shared/services/`.
- No llamar a los plugins (`Camera`, `Share`, `Filesystem`, etc.) directamente desde componentes.
- Para fotos usar el helper `managePhotoToUpload` de `libs/shared/helpers/manage-photo-to-upload.ts`.

---

## Estructura de archivos nueva

Al crear un nuevo feature seguir la estructura:

```
apps/{app}/src/app/features/{feature}/
├── {feature}.routes.ts
└── pages/
    └── {page}/
        ├── {page}.component.ts
        ├── {page}.component.html
        └── {page}.component.scss
```

Componentes reutilizables → `libs/ui/src/lib/components/`.
Servicios de dominio → `libs/shared/services/{domain}/`.
Servicios core (auth, sesión, push) → `libs/core/services/`.
