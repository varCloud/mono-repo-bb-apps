# Tech Stack Rules — mono-repo-bb-apps

## Core Versions (locked)

| Tool | Version |
|---|---|
| Angular | 20.2.0 |
| Ionic | 8.6.1 |
| Capacitor | 7.2.0 |
| NX | 21.5.2 |
| TypeScript | 5.9.2 |
| RxJS | 7.8.0 |

## Angular 20 Rules

- **Standalone only**: never generate or add NgModules
- **Signals first**: prefer `signal()` / `computed()` / `toSignal()` over BehaviorSubject for local/UI state
- **Functional guards**: use `CanActivateFn`, not class-based guards
- **`inject()`**: prefer over constructor DI in all new code
- **`HttpClient`** with Fetch API backend (already configured in `app.config.ts`)
- **`DestroyRef`** for cleanup: `takeUntilDestroyed(destroyRef)` in services/components

## NX Workspace Rules

- Generate code with NX CLI: `nx g @angular/core:component ...`
- Respect module boundaries enforced in `eslint.config.mjs`
- Tag-based constraints: `type:app`, `type:feature`, `type:ui`, `type:util`, `type:data-access`
- Before adding a new lib dependency, verify it doesn't violate boundaries
- Cache-enabled targets: `build`, `lint` — don't disable caching without good reason

## Ionic 8 Rules

- Use Ionic standalone imports (e.g., `IonHeader`, `IonContent`) directly in component `imports[]`
- Use `IonRouterOutlet` in root component, not `RouterOutlet`
- Platform detection via `Platform` service from `@ionic/angular`
- CSS variables from Ionic theme: `--ion-color-*`, `--ion-background-color`, etc.
- Modals: use `ModalController.create()` with a standalone component

## Capacitor 7 Rules

- Native plugins imported from `@capacitor/*` packages
- Always check platform before calling native APIs:
  ```typescript
  if (Capacitor.isNativePlatform()) { ... }
  ```
- Sync after web build: `npx cap sync` (or use npm scripts `cap:athlete:sync`)
- Push notifications token handling already in `PushNotificationService`

## RxJS Rules

- Prefer `pipe()` chains over nested subscriptions
- Always unsubscribe: use `takeUntilDestroyed(destroyRef)` or `async` pipe
- Use `switchMap` for cancellable requests, `mergeMap` for parallel, `concatMap` for ordered
- Avoid `subscribe()` inside `subscribe()`
- Use `catchError` in service layer, not in components

## ngx-translate Rules

- Load translations via `HttpLoaderFactory` (already configured)
- Use `TranslateService.instant()` only in non-reactive contexts
- Prefer `| translate` pipe in templates
- Translation files: `libs/shared/assets/i18n/es.json` (Spanish primary), `en.json`

## HTTP & API

- Base URL: `https://api.bodybooster.com.mx/api/v1` (prod), configured per environment
- All constants in `libs/shared/src/lib/constants/api-urls.constants.ts`
- Auth token injected automatically by `httpInterceptor`
- Error handling centralized in interceptor — don't duplicate in services
- Stripe: test key active (`pk_test_...`) — switch in environment for prod

## Storage

- **Ionic Storage**: for persisted user data across sessions
- **LocalStorage service** (`libs/core`): for simple key-value (use `KEY_LOCALSTORAGE` constants)
- **Signals / component state**: for transient UI state only

## File Uploads (Uppy + AWS S3)

- Multipart S3 upload via pre-signed URLs
- Max file size: 10 GB
- Helper: `destroyUppy()` from `libs/shared` — always call on component destroy

## Build & Deploy

- Dev athlete: `npm run start:athlete` → port 4300
- Dev creator: `npm run start:creator` → port 4200
- Production build: `nx build athlete --configuration=production`
- Mobile: `npm run prepare:publish:athlete` (build + cap sync)
- Bundle budget: 2 MB initial — keep lazy loading enforced

## Linting & Formatting

- Run before committing: `nx lint <project>`
- Prettier auto-format on save (configured in `.prettierrc`)
- No `any` type without `// eslint-disable-next-line` justification
- Unused imports cause lint errors — keep imports clean
