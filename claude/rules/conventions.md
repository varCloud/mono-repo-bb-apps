# Conventions — mono-repo-bb-apps

## File Naming

| Artifact | Pattern | Example |
|---|---|---|
| Component | `kebab-case.component.ts` | `user-profile.component.ts` |
| Service | `kebab-case.service.ts` | `workout.service.ts` |
| Guard | `kebab-case.guard.ts` | `auth.guard.ts` |
| Interceptor | `kebab-case.interceptor.ts` | `http.interceptor.ts` |
| Pipe | `kebab-case.pipe.ts` | `mask-email.pipe.ts` |
| Directive | `kebab-case.directive.ts` | `profile-color.directive.ts` |
| Model/Interface | `kebab-case.model.ts` | `user.model.ts` |
| Route file | `*.routes.ts` | `app.routes.ts` |
| Barrel | `index.ts` | — |

## Directory Structure

```
apps/<app-name>/src/app/
  features/           # Feature folders (one per screen/domain)
    <feature>/
      <feature>.component.ts
      <feature>.routes.ts   (if lazy loaded)
  core/               # App-specific services only
  models/             # App-specific models only

libs/
  core/               # Auth, guards, interceptors, cross-app services
  shared/             # Models, constants, helpers, pipes, directives
  ui/                 # Reusable standalone components
  utils/              # Pure utility functions
```

## TypeScript

- **Classes**: PascalCase (`UserService`, `WorkoutModel`)
- **Methods & properties**: camelCase (`getUser()`, `currentUser`)
- **Private properties**: underscore prefix (`_baseUrl`, `_http`)
- **Interfaces**: PascalCase, no `I` prefix (`User`, `WorkoutResponse`)
- **Enums**: PascalCase name, SCREAMING_SNAKE_CASE members
- **Constants**: SCREAMING_SNAKE_CASE (`API_URLS`, `KEY_LOCALSTORAGE`)
- **Signals**: camelCase, descriptive noun (`isLoading`, `currentUser`)

## Angular Patterns

- **Always** use standalone components — no NgModules
- **Always** use `inject()` over constructor injection
- Use Angular signals for local UI state (`signal()`, `computed()`)
- Use `DestroyRef` + `takeUntilDestroyed()` for subscription cleanup
- Route guards as functions, not classes
- Services: `@Injectable({ providedIn: 'root' })` by default
- Lazy load every feature route

## Imports: Library Paths

Always use workspace aliases, never relative cross-lib paths:

```typescript
// CORRECT
import { UserService } from '@monorepo-bb-app/core';
import { UserModel } from '@monorepo-bb-app/shared';
import { HeaderComponent } from '@monorepo-bb-app/ui';

// WRONG
import { UserService } from '../../../libs/core/src/...';
```

## Styling

- **Language**: SCSS (inline styles in component decorator)
- **Variables**: Use Ionic CSS variables for colors/spacing (`--ion-color-primary`)
- **Units**: `rem` / `px` — no `em`
- No global styles except in `libs/shared/scss/`

## Formatting (Prettier)

- Semicolons: **yes**
- Quotes: **single**
- Trailing commas: **ES5** (objects/arrays, not function params)
- Print width: **100** characters
- Tab width: **2 spaces**
- Arrow params: **always parentheses** — `(x) => x`

## i18n

- All user-facing strings via `ngx-translate`
- Translation keys in `libs/shared/assets/i18n/es.json` (primary) and `en.json`
- Key format: `FEATURE.COMPONENT.KEY` (e.g., `LOGIN.FORM.EMAIL_PLACEHOLDER`)
- Comments in code may be written in Spanish

## NX Module Boundaries (enforced by ESLint)

- `apps/*` can import from any `libs/*`
- `libs/ui` must NOT import from `libs/core`
- `libs/core` must NOT import from `libs/ui`
- `libs/shared` must NOT import from `libs/core` or `libs/ui`
- No circular dependencies between libraries
