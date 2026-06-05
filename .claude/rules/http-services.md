# HTTP y servicios

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
