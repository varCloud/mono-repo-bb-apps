# Routing — lazy loading standalone

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
