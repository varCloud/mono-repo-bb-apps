# Architecture — mono-repo-bb-apps

## Overview

NX monorepo hosting two Ionic/Angular apps (`athlete`, `creator`) that share ~80% of code through three shared libraries. Targets iOS, Android, and web via Capacitor.

## Workspace Map

```
mono-repo-bb-apps/
├── apps/
│   ├── athlete/        @monorepo-bb-app/athlete  — port 4300 (dev)
│   └── creator/        @monorepo-bb-app/creator  — port 4200 (dev)
│
└── libs/
    ├── core/           @monorepo-bb-app/core      — services, auth, interceptors
    ├── shared/         @monorepo-bb-app/shared    — models, constants, pipes, helpers
    ├── ui/             @monorepo-bb-app/ui         — 60+ standalone components
    └── utils/          @monorepo-bb-app/utils     — (empty, reserved)
```

## Dependency Graph (allowed directions)

```
apps/athlete ──┐
               ├──▶ libs/core ──▶ libs/shared
apps/creator ──┘
    │
    └──────────────▶ libs/ui ──▶ libs/shared
    │
    └──────────────▶ libs/shared
```

**Hard rule**: `shared` has no upstream lib deps. `ui` cannot import `core`.

## libs/core — Responsibilities

- **Authentication**: `LoginService`, `UserService`, session management
- **Guards**: `authGuard` (protected routes), `loggedInGuard` (redirect if already logged in)
- **HTTP Interceptor**: Injects Bearer token, handles 401/403 globally
- **Platform Services**: `ThemeService`, `NetworkService`, `DeepLinkService`, `PushNotificationService`
- **Storage**: `LocalStorageService` (wrapper over `@ionic/storage-angular`)
- **File Uploads**: `S3UploadService` (Uppy + pre-signed S3 URLs)

## libs/shared — Responsibilities

- **Models** (40+): `User`, `Workout`, `Subscription`, `Payment`, `Exercise`, `Category`, `Rating`, `FAQ`, etc.
- **Constants**: `API_URLS`, `KEY_LOCALSTORAGE`, `PATTERNS`, `TIMES`, `MESSAGE_STATUS`
- **Helpers**: File utilities, form validators, photo upload helpers, `destroyUppy()`
- **Pipes**: `MaskEmailPipe`, `SentenceCasePipe`
- **Directives**: `AppIonMaskDirective`
- **Domain Services**: `ToastService`, `StripeService`, `WorkoutService`, `SubscriptionService`, `PaymentService`, `OtpService`, `ShareService`
- **i18n assets**: `libs/shared/assets/i18n/es.json`, `en.json`
- **SCSS**: Global style variables at `libs/shared/scss/`

## libs/ui — Responsibilities

60+ standalone Angular/Ionic components, grouped by category:

| Category | Examples |
|---|---|
| Forms | `CreateAccountFormComponent`, `LoginFormComponent`, `ResetPasswordFormComponent` |
| Modals | `PaymentMethodModal`, `DeleteAccountModalComponent`, `ConfirmSaveModalComponent` |
| Selection | `CountryCodeSelectComponent`, `CatalogSelectComponent`, `CurrencyComponent` |
| Display | `HeaderComponent`, `CardComponent`, `ItemListComponent`, `CommentListComponent` |
| Media | `AvatarPickerComponent`, `CoverUploadComponent`, `YouTubeVideoComponent` |
| Payments | `PaymentMethodsListComponent`, `ModalAddPaymentMethodComponent` |
| Utility | `LoaderComponent`, `ErrorMessageComponent`, `LayoutContentComponent` |

## App Structure (athlete & creator follow same pattern)

```
src/app/
  features/           # One folder per domain feature (lazy loaded)
    home/
    login/
    onboarding/
    profile/
    subscriptions/
    training/
    workouts/
    support/
    user-conversation/
  core/               # App-specific services (not shared across apps)
  models/             # App-specific models (not shared)
  app.ts              # Root standalone component
  app.config.ts       # DI providers, HttpClient, interceptors, i18n, Ionic config
  app.routes.ts       # Top-level routes (lazy imports to features)
```

## External Integrations

| Service | Purpose | Location |
|---|---|---|
| `api.bodybooster.com.mx/api/v1` | Backend REST API | `API_URLS` constant |
| Stripe | Payments | `StripeService`, `PaymentMethodModal` |
| AWS S3 | File/video uploads | `S3UploadService` (Uppy multipart) |
| Google OAuth | Social login | `LoginService` |
| Capacitor Push | Push notifications | `PushNotificationService` |
| DeepLink | External URL nav | `DeepLinkService` |
| ngx-translate | i18n (ES/EN) | `HttpLoaderFactory` |

## State Management Strategy

No global state store (no NgRx/Akita). State managed via:

1. **Signals** — local component/service UI state (`signal()`, `computed()`)
2. **Services** — domain state held in service properties (UserService holds current user)
3. **Ionic Storage** — persisted state across sessions
4. **URL/Route params** — navigation state

## Key Architectural Decisions

- **No NgModules**: Full standalone components from Angular 15+ adoption
- **No testing setup**: `unitTestRunner: none`, `e2eTestRunner: none` in `nx.json` (intentional)
- **Creator defaults to prod**: `creator` project.json uses `production` as default configuration
- **Athlete defaults to dev**: `athlete` project.json uses `development` as default
- **Spanish as primary language**: i18n keys always have `es.json` as source of truth
- **Single interceptor**: All HTTP concerns (auth, errors) in one interceptor per app
