# App Settings — AppSettingsService

Para acceder a la configuración de la app (`AppSettingsModel`) usar siempre `AppSettingsService` de `@monorepo-bb-app/core`.

- **No leer** `KEY_LOCALSTORAGE.CONFIG` directamente desde componentes o servicios de dominio.
- Leer el signal `settings$()` — es síncrono, no requiere `await`.
- Al hacer login, llamar `_appSettingsService.setSettings(config)` — guarda en memoria y en localStorage en un solo paso.
- Solo leer del localStorage para app-settings cuando sea estrictamente necesario (p.ej. inicialización del servicio en sí).

```typescript
// ✅ correcto
const settings = this._appSettingsService.settings$();
const url = settings?.onlyWorkoutSuscription === '1' ? API_URLS.WORKOUT_SUBSCRIBED : API_URLS.WORKOUT;

// ❌ evitar
const config = await this._localStorage.get(KEY_LOCALSTORAGE.CONFIG);
```
