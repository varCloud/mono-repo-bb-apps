# Estado — Angular Signals

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
