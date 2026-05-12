# Project Rules

## i18n — Translations required for every new string

Whenever you add or modify any user-facing text (labels, buttons, messages, placeholders, tooltips, modal content, etc.), you **must** also add the corresponding key to both translation files:

- `libs/shared/assets/i18n/en.json` — English
- `libs/shared/assets/i18n/es.json` — Spanish

### Rules

- Never hardcode display text directly in templates. Use `{{ 'key' | translate }}` (Angular/ngx-translate).
- Add the key to **both** JSON files in the same task — never leave one file missing a key.
- Place new keys inside the most relevant existing section. If no section fits, create a new one that matches the feature name.
- The English value is the source of truth. The Spanish value must be a real translation, not a copy of the English text.

### Example

When adding a new button label:

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
